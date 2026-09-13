import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { config } from '../config/index.js';

const router = Router();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: !!user.is_admin,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function setAuthCookie(res, token, remember = true) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : null,
  });
}

/**
 * GitHub OAuth
 */
router.get('/github', (req, res) => {
  if (!config.github.clientId) {
    return res.status(500).json({ error: 'GitHub OAuth 未配置' });
  }
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${encodeURIComponent(config.github.callbackUrl)}&scope=read:user user:email`;
  res.redirect(authUrl);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: '缺少授权码' });

    // 用 code 换 access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: config.github.callbackUrl,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) return res.status(400).json({ error: tokenData.error_description || '授权失败' });

    // 获取用户信息
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const githubUser = await userRes.json();

    // 获取邮箱
    let email = githubUser.email;
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const emails = await emailRes.json();
      const primary = emails.find((e) => e.primary);
      email = primary?.email;
    }

    if (!email) {
      return res.status(400).json({ error: '无法获取 GitHub 邮箱' });
    }

    // 查找或创建用户
    let user = db.prepare('SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?')
      .get('github', String(githubUser.id));

    if (!user) {
      // 检查邮箱是否已被注册
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (user) {
        // 关联 OAuth
        db.prepare('UPDATE users SET oauth_provider = ?, oauth_id = ? WHERE id = ?')
          .run('github', String(githubUser.id), user.id);
      } else {
        // 创建新用户
        const userId = uuidv4();
        let username = githubUser.login;
        // 用户名唯一化
        while (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
          username = `${githubUser.login}_${Math.random().toString(36).slice(2, 6)}`;
        }
        db.prepare(
          'INSERT INTO users (id, username, email, oauth_provider, oauth_id, avatar, is_verified) VALUES (?, ?, ?, ?, ?, ?, 1)'
        ).run(userId, username, email, 'github', String(githubUser.id), githubUser.avatar_url);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      }
    }

    const token = generateToken(user);
    setAuthCookie(res, token);
    res.redirect(`${config.clientOrigin}/?oauth=success`);
  } catch (err) {
    console.error('[GitHub OAuth]', err);
    res.redirect(`${config.clientOrigin}/?oauth=error`);
  }
});

/**
 * Google OAuth
 */
router.get('/google', (req, res) => {
  if (!config.google.clientId) {
    return res.status(500).json({ error: 'Google OAuth 未配置' });
  }
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google.clientId}&redirect_uri=${encodeURIComponent(config.google.callbackUrl)}&response_type=code&scope=email profile&access_type=offline`;
  res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: '缺少授权码' });

    // 用 code 换 access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.google.callbackUrl,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) return res.status(400).json({ error: tokenData.error_description || '授权失败' });

    // 获取用户信息
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return res.status(400).json({ error: '无法获取 Google 邮箱' });
    }

    // 查找或创建用户
    let user = db.prepare('SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?')
      .get('google', googleUser.sub);

    if (!user) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(googleUser.email);
      if (user) {
        db.prepare('UPDATE users SET oauth_provider = ?, oauth_id = ? WHERE id = ?')
          .run('google', googleUser.sub, user.id);
      } else {
        const userId = uuidv4();
        let username = googleUser.name || googleUser.email.split('@')[0];
        while (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
          username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
        }
        db.prepare(
          'INSERT INTO users (id, username, email, oauth_provider, oauth_id, avatar, is_verified) VALUES (?, ?, ?, ?, ?, ?, 1)'
        ).run(userId, username, googleUser.email, 'google', googleUser.sub, googleUser.picture);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      }
    }

    const token = generateToken(user);
    setAuthCookie(res, token);
    res.redirect(`${config.clientOrigin}/?oauth=success`);
  } catch (err) {
    console.error('[Google OAuth]', err);
    res.redirect(`${config.clientOrigin}/?oauth=error`);
  }
});

export default router;
