import rateLimit from 'express-rate-limit';

// 通用 API 限流：每分钟 60 次
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' },
});

// 登录限流：15 分钟内最多 5 次（防暴力破解）
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '登录尝试次数过多，请 15 分钟后再试' },
});

// 注册限流：1 小时内最多 3 次
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '注册过于频繁，请稍后再试' },
});
