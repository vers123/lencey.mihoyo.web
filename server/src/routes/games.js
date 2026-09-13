import { Router } from 'express';
import db from '../db/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { escapeHtml } from '../utils/validators.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * GET /api/games
 * 获取游戏列表（支持分类、标签、搜索）
 */
router.get('/', (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let sql = 'SELECT * FROM games WHERE is_active = 1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR name_en LIKE ? OR description LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    sql += ' ORDER BY created_at DESC';
    let games = db.prepare(sql).all(...params);

    // 标签筛选
    if (tag) {
      games = games.filter((g) => {
        const tags = JSON.parse(g.tags || '[]');
        return tags.includes(tag);
      });
    }

    // 解析 tags JSON
    games = games.map((g) => ({
      ...g,
      tags: JSON.parse(g.tags || '[]'),
    }));

    res.json(games);
  } catch (err) {
    console.error('[GetGames]', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * GET /api/games/categories
 * 获取分类列表
 */
router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM games WHERE is_active = 1').all();
  res.json(rows.map((r) => r.category));
});

/**
 * GET /api/games/tags
 * 获取所有标签
 */
router.get('/tags', (req, res) => {
  const rows = db.prepare('SELECT tags FROM games WHERE is_active = 1').all();
  const tagSet = new Set();
  rows.forEach((r) => {
    JSON.parse(r.tags || '[]').forEach((t) => tagSet.add(t));
  });
  res.json([...tagSet]);
});

/**
 * GET /api/games/:id
 * 获取单个游戏详情
 */
router.get('/:id', (req, res) => {
  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
  if (!game) return res.status(404).json({ error: '游戏不存在' });
  game.tags = JSON.parse(game.tags || '[]');
  res.json(game);
});

/**
 * GET /api/games/:id/comments
 * 获取游戏评论
 */
router.get('/:id/comments', (req, res) => {
  const rows = db.prepare(
    `SELECT c.*, u.username, u.avatar FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.game_id = ? AND c.is_pending = 0
     ORDER BY c.created_at DESC`
  ).all(req.params.id);
  res.json(rows);
});

/**
 * POST /api/games/:id/comments
 * 发表评论
 */
router.post('/:id/comments', authenticate, (req, res) => {
  const { content, rating } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: '评论内容不能为空' });
  }
  if (rating && (rating < 1 || rating > 10)) {
    return res.status(400).json({ error: '评分必须在 1-10 之间' });
  }

  const game = db.prepare('SELECT id FROM games WHERE id = ?').get(req.params.id);
  if (!game) return res.status(404).json({ error: '游戏不存在' });

  db.prepare(
    'INSERT INTO comments (id, user_id, game_id, content, rating, is_pending) VALUES (?, ?, ?, ?, ?, 0)'
  ).run(uuidv4(), req.user.id, req.params.id, escapeHtml(content), rating || null);

  res.status(201).json({ message: '评论成功' });
});

// ========== 管理员接口 ==========

/**
 * POST /api/games
 * 新增游戏（管理员）
 */
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, nameEn, category, description, descriptionEn, link, image, tags } = req.body;
  if (!name || !category || !link) {
    return res.status(400).json({ error: '名称、分类、链接不能为空' });
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO games (id, name, name_en, category, description, description_en, link, image, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    escapeHtml(name),
    escapeHtml(nameEn || ''),
    escapeHtml(category),
    escapeHtml(description || ''),
    escapeHtml(descriptionEn || ''),
    link,
    image || '',
    JSON.stringify(tags || [])
  );

  res.status(201).json({ message: '游戏添加成功', id });
});

/**
 * PUT /api/games/:id
 * 更新游戏（管理员）
 */
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const game = db.prepare('SELECT id FROM games WHERE id = ?').get(req.params.id);
  if (!game) return res.status(404).json({ error: '游戏不存在' });

  const { name, nameEn, category, description, descriptionEn, link, image, tags, isActive } = req.body;
  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(escapeHtml(name)); }
  if (nameEn !== undefined) { updates.push('name_en = ?'); params.push(escapeHtml(nameEn)); }
  if (category !== undefined) { updates.push('category = ?'); params.push(escapeHtml(category)); }
  if (description !== undefined) { updates.push('description = ?'); params.push(escapeHtml(description)); }
  if (descriptionEn !== undefined) { updates.push('description_en = ?'); params.push(escapeHtml(descriptionEn)); }
  if (link !== undefined) { updates.push('link = ?'); params.push(link); }
  if (image !== undefined) { updates.push('image = ?'); params.push(image); }
  if (tags !== undefined) { updates.push('tags = ?'); params.push(JSON.stringify(tags)); }
  if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }

  if (updates.length === 0) return res.status(400).json({ error: '没有需要更新的字段' });

  params.push(req.params.id);
  db.prepare(`UPDATE games SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...params);
  res.json({ message: '游戏更新成功' });
});

/**
 * DELETE /api/games/:id
 * 删除游戏（管理员）
 */
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
  res.json({ message: '游戏已删除' });
});

export default router;
