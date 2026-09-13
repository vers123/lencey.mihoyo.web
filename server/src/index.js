import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { apiLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import userRoutes from './routes/user.js';
import gamesRoutes from './routes/games.js';
import adminRoutes from './routes/admin.js';
import { initAdmin } from './scripts/init-admin.js';
import { seedGames } from './scripts/seed-games.js';

const app = express();

// 安全中间件
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: config.clientOrigin,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 通用限流
app.use('/api/', apiLimiter);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/auth/oauth', oauthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动
async function start() {
  await initAdmin();
  await seedGames();

  app.listen(config.port, () => {
    console.log(`[Server] 运行在 http://localhost:${config.port}`);
    console.log(`[Server] 环境: ${config.nodeEnv}`);
  });
}

start();
