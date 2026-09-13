import { Router } from 'express';
import db from '../db/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/admin/stats
 * 统计数据
 */
router.get('/stats', authenticate, requireAdmin, (req, res) => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const gameCount = db.prepare('SELECT COUNT(*) as count FROM games').get().count;
  const commentCount = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
  const pendingComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE is_pending = 1').get().count;

  res.json({ userCount, gameCount, commentCount, pendingComments });
});

/**
 * GET /api/admin/users
 * 用户列表
 */
router.get('/users', authenticate, requireAdmin, (req, res) => {
  const rows = db.prepare(
    'SELECT id, username, email, avatar, is_admin, is_verified, oauth_provider, created_at FROM users ORDER BY created_at DESC'
  ).all();
  res.json(rows);
});

/**
 * PUT /api/admin/users/:id
 * 更新用户（管理员）
 */
router.put('/users/:id', authenticate, requireAdmin, (req, res) => {
  const { isAdmin, isActive } = req.body;
  const updates = [];
  const params = [];

  if (isAdmin !== undefined) { updates.push('is_admin = ?'); params.push(isAdmin ? 1 : 0); }
  if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }

  if (updates.length === 0) return res.status(400).json({ error: '没有需要更新的字段' });

  params.push(req.params.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  res.json({ message: '用户更新成功' });
});

/**
 * DELETE /api/admin/users/:id
 * 删除用户
 */
router.delete('/users/:id', authenticate, requireAdmin, (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ error: '不能删除自己' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: '用户已删除' });
});

/**
 * GET /api/admin/comments/pending
 * 待审核评论
 */
router.get('/comments/pending', authenticate, requireAdmin, (req, res) => {
  const rows = db.prepare(
    `SELECT c.*, u.username, u.avatar, g.name as game_name FROM comments c
     JOIN users u ON c.user_id = u.id
     JOIN games g ON c.game_id = g.id
     WHERE c.is_pending = 1 ORDER BY c.created_at DESC`
  ).all();
  res.json(rows);
});

/**
 * PUT /api/admin/comments/:id/approve
 * 审核通过评论
 */
router.put('/comments/:id/approve', authenticate, requireAdmin, (req, res) => {
  db.prepare('UPDATE comments SET is_pending = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: '评论已通过' });
});

/**
 * DELETE /api/admin/comments/:id
 * 删除评论
 */
router.delete('/comments/:id', authenticate, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ message: '评论已删除' });
});

export default router;
