import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import { config } from '../config/index.js';

/**
 * 初始化管理员账号
 * 如果环境变量中配置了管理员邮箱和密码，则创建管理员
 */
export async function initAdmin() {
  if (!config.admin.email || !config.admin.password) {
    console.log('[Admin] 未配置管理员账号，跳过初始化');
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(config.admin.email);

  if (existing) {
    // 更新管理员标记
    db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(existing.id);
    console.log(`[Admin] 管理员已存在: ${config.admin.email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(config.admin.password, 10);
  const adminId = uuidv4();

  db.prepare(
    `INSERT INTO users (id, username, email, password_hash, is_admin, is_verified)
     VALUES (?, ?, ?, ?, 1, 1)`
  ).run(adminId, config.admin.username, config.admin.email, passwordHash);

  console.log(`[Admin] 管理员账号创建成功: ${config.admin.email}`);
}
