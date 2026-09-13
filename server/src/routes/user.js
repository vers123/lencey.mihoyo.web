import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { escapeHtml } from '../utils/validators.js';

const router = Router();

/**
 * GET /api/user/profile
 * 获取个人资料
 */
router.get('/profile', authenticate, (req, res) => {
  const user = db.prepare(
    'SELECT id, username, email, avatar, is_verified, created_at FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json(user);
});

/**
 * PUT /api/user/profile
 * 更新个人资料
 */
router.put('/profile', authenticate, (req, res) => {
  const { username, avatar } = req.body;
  const updates = [];
  const params = [];

  if (username) {
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: '用户名长度 3-20 位' });
    }
    updates.push('username = ?');
    params.push(escapeHtml(username));
  }

  if (avatar !== undefined) {
    updates.push('avatar = ?');
    params.push(avatar);
  }

  if (updates.length === 0) return res.status(400).json({ error: '没有需要更新的字段' });

  params.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...params);

  res.json({ message: '资料更新成功' });
});

/**
 * GET /api/user/favorites
 * 获取收藏列表
 */
router.get('/favorites', authenticate, (req, res) => {
  const rows = db.prepare(
    `SELECT g.* FROM favorites f JOIN games g ON f.game_id = g.id WHERE f.user_id = ? ORDER BY f.created_at DESC`
  ).all(req.user.id);
  res.json(rows);
});

/**
 * POST /api/user/favorites/:gameId
 * 添加收藏
 */
router.post('/favorites/:gameId', authenticate, (req, res) => {
  const { gameId } = req.params;
  const game = db.prepare('SELECT id FROM games WHERE id = ?').get(gameId);
  if (!game) return res.status(404).json({ error: '游戏不存在' });

  const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND game_id = ?')
    .get(req.user.id, gameId);
  if (existing) return res.status(409).json({ error: '已收藏该游戏' });

  db.prepare('INSERT INTO favorites (id, user_id, game_id) VALUES (?, ?, ?)')
    .run(uuidv4(), req.user.id, gameId);
  res.json({ message: '收藏成功' });
});

/**
 * DELETE /api/user/favorites/:gameId
 * 取消收藏
 */
router.delete('/favorites/:gameId', authenticate, (req, res) => {
  const { gameId } = req.params;
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND game_id = ?')
    .run(req.user.id, gameId);
  res.json({ message: '已取消收藏' });
});

/**
 * GET /api/user/login-history
 * 登录历史
 */
router.get('/login-history', authenticate, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM login_history WHERE user_id = ? ORDER BY login_at DESC LIMIT 20'
  ).all(req.user.id);
  res.json(rows);
});

export default router;
