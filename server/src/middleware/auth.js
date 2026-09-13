import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * JWT 认证中间件
 * 从 Authorization header 或 cookie 中提取 token
 */
export function authenticate(req, res, next) {
  let token = null;

  // 从 Authorization header 获取
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 从 cookie 获取
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

/**
 * 可选认证中间件（游客也能访问，但有 token 时会解析用户信息）
 */
export function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      req.user = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      // 忽略无效 token
    }
  }
  next();
}

/**
 * 管理员权限中间件
 */
export function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}
