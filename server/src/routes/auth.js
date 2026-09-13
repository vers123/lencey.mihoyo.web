import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { config } from '../config/index.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';
import { isValidEmail, validatePassword, validateUsername, escapeHtml } from '../utils/validators.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';

const router = Router();

// 生成 JWT token
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

// 记录登录历史
function logLogin(userId, ip, userAgent, success) {
  db.prepare(
    'INSERT INTO login_history (id, user_id, ip, user_agent, success) VALUES (?, ?, ?, ?, ?)'
  ).run(uuidv4(), userId, ip || '', userAgent || '', success ? 1 : 0);
}

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱、密码不能为空' });
    }

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) return res.status(400).json({ error: usernameCheck.message });

    if (!isValidEmail(email)) return res.status(400).json({ error: '邮箱格式不正确' });

    const pwdCheck = validatePassword(password);
    if (!pwdCheck.valid) return res.status(400).json({ error: pwdCheck.message });

    // 检查邮箱是否已注册
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: '该邮箱已注册' });

    // 检查用户名是否已存在
    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUsername) return res.status(409).json({ error: '该用户名已被使用' });

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, is_verified) VALUES (?, ?, ?, ?, 0)'
    ).run(userId, escapeHtml(username), email, passwordHash);

    // 生成邮箱验证 token（24小时有效）
    const verifyToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.prepare(
      'INSERT INTO verification_tokens (id, user_id, token, type, expires_at) VALUES (?, ?, ?, ?, ?)'
    ).run(uuidv4(), userId, verifyToken, 'email_verify', expiresAt);

    // 发送验证邮件
    const verifyUrl = `${config.clientOrigin}/verify-email?token=${verifyToken}`;
    const emailSent = await sendVerificationEmail(email, username, verifyUrl);

    res.status(201).json({
      message: '注册成功，请查收邮箱验证邮件',
      emailSent,
      userId,
    });
  } catch (err) {
    console.error('[Register]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/auth/verify-email
 * 验证邮箱
 */
router.post('/verify-email', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: '缺少验证令牌' });

    const record = db.prepare(
      "SELECT * FROM verification_tokens WHERE token = ? AND type = 'email_verify' AND used = 0"
    ).get(token);

    if (!record) return res.status(400).json({ error: '验证链接无效或已使用' });

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: '验证链接已过期' });
    }

    // 标记已使用 + 更新用户验证状态
    const tx = db.transaction(() => {
      db.prepare('UPDATE verification_tokens SET used = 1 WHERE id = ?').run(record.id);
      db.prepare('UPDATE users SET is_verified = 1 WHERE id = ?').run(record.user_id);
    });
    tx();

    res.json({ message: '邮箱验证成功' });
  } catch (err) {
    console.error('[VerifyEmail]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      logLogin(null, req.ip, req.headers['user-agent'], false);
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // OAuth 用户没有密码
    if (!user.password_hash) {
      logLogin(user.id, req.ip, req.headers['user-agent'], false);
      return res.status(401).json({ error: '该账号使用第三方登录，请使用对应方式登录' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      logLogin(user.id, req.ip, req.headers['user-agent'], false);
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: '请先验证邮箱', needVerify: true });
    }

    const token = generateToken(user);
    logLogin(user.id, req.ip, req.headers['user-agent'], true);

    // 设置 cookie（7天或会话）
    const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : null;
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge,
    });

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: !!user.is_admin,
      },
    });
  } catch (err) {
    console.error('[Login]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/auth/logout
 * 退出登录
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '已退出登录' });
});

/**
 * POST /api/auth/forgot-password
 * 请求密码重置
 */
router.post('/forgot-password', loginLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: '请输入有效的邮箱' });
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    // 无论是否存在都返回相同消息，防止邮箱枚举
    if (user) {
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      db.prepare(
        'INSERT INTO verification_tokens (id, user_id, token, type, expires_at) VALUES (?, ?, ?, ?, ?)'
      ).run(uuidv4(), user.id, resetToken, 'password_reset', expiresAt);

      const resetUrl = `${config.clientOrigin}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    res.json({ message: '如果该邮箱已注册，密码重置链接已发送' });
  } catch (err) {
    console.error('[ForgotPassword]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/auth/reset-password
 * 重置密码
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const pwdCheck = validatePassword(password);
    if (!pwdCheck.valid) return res.status(400).json({ error: pwdCheck.message });

    const record = db.prepare(
      "SELECT * FROM verification_tokens WHERE token = ? AND type = 'password_reset' AND used = 0"
    ).get(token);

    if (!record) return res.status(400).json({ error: '重置链接无效或已使用' });
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: '重置链接已过期' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const tx = db.transaction(() => {
      db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .run(passwordHash, record.user_id);
      db.prepare('UPDATE verification_tokens SET used = 1 WHERE id = ?').run(record.id);
    });
    tx();

    res.json({ message: '密码重置成功，请重新登录' });
  } catch (err) {
    console.error('[ResetPassword]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/auth/me
 * 获取当前用户信息
 */
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, email, avatar, is_admin, is_verified, created_at FROM users WHERE id = ?')
    .get(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    isAdmin: !!user.is_admin,
    isVerified: !!user.is_verified,
    createdAt: user.created_at,
  });
});

export default router;
