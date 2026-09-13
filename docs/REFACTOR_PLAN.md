# Vers123 游戏导航站 — 全栈重构计划

> 版本：v1.0  
> 日期：2026-09-13  
> 分支：`plan/full-stack-refactor`

---

## 一、项目背景

当前项目为纯静态 HTML/CSS/JS 网站，部署于 GitHub Pages，存在以下核心问题：

1. **安全隐患严重**
   - 密码使用 `btoa()` 做 base64 编码（非真正加密）
   - 管理员账号 `admin/admin123` 硬编码在前端 JS 中
   - 所有用户数据存于浏览器 localStorage/IndexedDB，无服务端
   - 无输入校验，存在 XSS/SQL 注入风险

2. **代码架构混乱**
   - 每个 HTML 文件重复 Tailwind 配置、样式、header/footer
   - `templates/` 目录下的模板文件未被使用
   - 所有 JS 通过 `<script>` 标签全局加载，命名空间污染
   - `getAllGames()` 在多个文件中重复定义
   - 无构建流程，Tailwind 走 CDN

3. **功能局限**
   - 游戏数据写死在 `games.config.js`，无法在线管理
   - 仅 2 个分类、12 款游戏，"其他游戏"图片均为占位图
   - 无搜索、筛选、评论、评分等交互功能
   - 无 SEO 优化

---

## 二、重构目标

| 维度 | 目标 |
|------|------|
| 安全性 | 密码 bcrypt 加密、JWT 认证、防 XSS/SQL 注入、rate limit |
| 性能 | Lighthouse 90+，首屏加载 < 2s |
| 架构 | 前后端分离，模块化，组件化 |
| 功能 | 游戏管理后台、标签筛选、全局搜索、评论评分、PWA、资讯聚合 |
| 工程化 | ESLint + Prettier、自动化测试、CI/CD |
| SEO | sitemap、结构化数据、Open Graph |

---

## 三、技术选型

### 3.1 前端
| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架 |
| Vite | 构建工具 |
| Tailwind CSS (CLI) | 样式 |
| Vue Router | 路由 |
| Pinia | 状态管理 |
| Axios | HTTP 请求 |

### 3.2 后端
| 技术 | 用途 |
|------|------|
| Node.js + Express | 后端框架 |
| SQLite (better-sqlite3) | 数据库 |
| bcryptjs | 密码哈希 |
| jsonwebtoken | JWT 认证 |
| Nodemailer | 邮件发送（QQ邮箱 SMTP） |
| express-rate-limit | 限流 |
| helmet | 安全头 |
| cors | 跨域 |

### 3.3 工程化
| 技术 | 用途 |
|------|------|
| ESLint + Prettier | 代码规范 |
| Vitest | 单元测试 |
| Playwright | E2E 测试 |
| GitHub Actions | CI/CD |

---

## 四、项目结构

```
vers123-game-nav/
├── client/                    # 前端 Vue 应用
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json      # PWA 配置
│   ├── src/
│   │   ├── api/               # API 请求封装
│   │   ├── assets/            # 静态资源
│   │   ├── components/        # 通用组件
│   │   │   ├── GameCard.vue
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Modal.vue
│   │   │   └── ThemeToggle.vue
│   │   ├── layouts/           # 布局组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Pinia 状态
│   │   │   ├── auth.ts
│   │   │   ├── theme.ts
│   │   │   └── language.ts
│   │   ├── views/             # 页面组件
│   │   │   ├── Home.vue
│   │   │   ├── Mihoyo.vue
│   │   │   ├── OtherGames.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Account.vue
│   │   │   ├── Admin.vue
│   │   │   └── NotFound.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                    # 后端 Express 应用
│   ├── src/
│   │   ├── config/            # 配置
│   │   │   ├── database.js
│   │   │   └── email.js
│   │   ├── controllers/       # 控制器
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   ├── userController.js
│   │   │   ├── adminController.js
│   │   │   └── commentController.js
│   │   ├── middleware/        # 中间件
│   │   │   ├── auth.js
│   │   │   ├── rateLimit.js
│   │   │   └── validate.js
│   │   ├── models/            # 数据模型
│   │   │   ├── User.js
│   │   │   ├── Game.js
│   │   │   ├── Favorite.js
│   │   │   └── Comment.js
│   │   ├── routes/            # 路由
│   │   │   ├── auth.js
│   │   │   ├── games.js
│   │   │   ├── users.js
│   │   │   ├── admin.js
│   │   │   └── comments.js
│   │   ├── utils/             # 工具函数
│   │   │   ├── jwt.js
│   │   │   ├── email.js
│   │   │   └── backup.js
│   │   └── app.js
│   ├── data/                  # SQLite 数据库文件
│   ├── package.json
│   └── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   └── REFACTOR_PLAN.md
└── README.md
```

---

## 五、数据库设计

### 5.1 users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT (PK) | UUID |
| email | TEXT (UNIQUE) | 邮箱 |
| nickname | TEXT | 昵称 |
| password | TEXT | bcrypt 哈希 |
| avatar | TEXT | 头像 URL（可选） |
| role | TEXT | user / admin |
| email_verified | INTEGER | 邮箱是否验证（0/1） |
| security_question | TEXT | 密保问题 |
| security_answer | TEXT | 密保答案（bcrypt） |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

### 5.2 games 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT (PK) | UUID |
| name | TEXT | 中文名 |
| name_en | TEXT | 英文名 |
| category | TEXT | 分类 |
| description | TEXT | 中文描述 |
| description_en | TEXT | 英文描述 |
| link | TEXT | 官方链接 |
| image | TEXT | 图片路径 |
| tags | TEXT | 标签（JSON 数组） |
| sort_order | INTEGER | 排序 |
| created_at | TEXT | 创建时间 |

### 5.3 favorites 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT (PK) | UUID |
| user_id | TEXT (FK) | 用户 ID |
| game_id | TEXT (FK) | 游戏 ID |
| added_at | TEXT | 添加时间 |

### 5.4 comments 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT (PK) | UUID |
| user_id | TEXT (FK) | 用户 ID |
| game_id | TEXT (FK) | 游戏 ID |
| content | TEXT | 评论内容 |
| rating | INTEGER | 评分（1-5） |
| created_at | TEXT | 创建时间 |

### 5.5 login_history 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT (PK) | UUID |
| user_id | TEXT (FK) | 用户 ID |
| ip | TEXT | IP 地址 |
| user_agent | TEXT | 浏览器信息 |
| login_at | TEXT | 登录时间 |

---

## 六、API 设计

### 6.1 认证相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| POST | /api/auth/logout | 登出 |
| POST | /api/auth/forgot-password | 发送密码重置邮件 |
| POST | /api/auth/reset-password | 重置密码 |
| POST | /api/auth/verify-email | 验证邮箱 |
| GET | /api/auth/oauth/github | GitHub OAuth 登录 |
| GET | /api/auth/oauth/google | Google OAuth 登录 |

### 6.2 游戏相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/games | 获取游戏列表（支持分类/标签筛选） |
| GET | /api/games/:id | 获取游戏详情 |
| GET | /api/games/search?q= | 搜索游戏 |
| POST | /api/admin/games | 创建游戏（管理员） |
| PUT | /api/admin/games/:id | 更新游戏（管理员） |
| DELETE | /api/admin/games/:id | 删除游戏（管理员） |

### 6.3 用户相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/users/profile | 获取当前用户信息 |
| PUT | /api/users/profile | 更新用户资料 |
| PUT | /api/users/password | 修改密码 |
| GET | /api/users/favorites | 获取收藏列表 |
| POST | /api/users/favorites | 添加收藏 |
| DELETE | /api/users/favorites/:gameId | 取消收藏 |
| GET | /api/users/login-history | 获取登录历史 |

### 6.4 评论相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/games/:id/comments | 获取游戏评论 |
| POST | /api/games/:id/comments | 发表评论 |
| DELETE | /api/comments/:id | 删除评论（本人/管理员） |

### 6.5 管理后台
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/users | 用户列表 |
| DELETE | /api/admin/users/:id | 删除用户 |
| GET | /api/admin/stats | 统计数据 |
| GET | /api/admin/backup | 下载备份 |
| POST | /api/admin/backup | 手动备份 |
| GET | /api/admin/settings | 获取系统设置 |
| PUT | /api/admin/settings | 更新系统设置 |

---

## 七、实施阶段

### 阶段一：安全与后端基础（优先级：最高）

**目标**：搭建后端骨架，解决核心安全问题

**任务清单**：
1. 初始化 Express 项目结构
2. 配置 SQLite 数据库连接和表结构
3. 实现用户注册（bcrypt 加密密码）
4. 实现用户登录（JWT 签发）
5. 实现邮箱验证（Nodemailer + QQ邮箱）
6. 实现密码重置（邮件链接）
7. 实现 GitHub OAuth 登录
8. 实现 Google OAuth 登录
9. 配置 rate limit 限流中间件
10. 配置 helmet 安全头
11. 实现管理员环境变量初始化
12. 编写单元测试

**验收标准**：
- 密码不以明文存储
- 管理员账号不在代码中硬编码
- 注册/登录/登出流程正常
- 邮箱验证邮件可正常发送
- 密码重置流程正常
- rate limit 生效

---

### 阶段二：前端基础架构

**目标**：搭建 Vue 3 + Vite 前端项目

**任务清单**：
1. 初始化 Vite + Vue 3 项目
2. 配置 Tailwind CSS CLI
3. 配置 Vue Router
4. 配置 Pinia
5. 迁移现有页面为 Vue 组件
   - Home（首页）
   - Mihoyo（米哈游分类）
   - OtherGames（其他游戏）
   - Login / Register
   - Account
   - Admin
   - NotFound
6. 抽取通用组件（Header、Footer、GameCard、Modal）
7. 实现主题切换（深色/浅色）
8. 实现语言切换（中/英）
9. 配置 ESLint + Prettier

**验收标准**：
- 所有页面可正常访问
- 深色/浅色模式切换正常
- 中英文切换正常
- 代码通过 ESLint 检查

---

### 阶段三：前后端联调

**目标**：前后端打通，核心功能可用

**任务清单**：
1. 封装 Axios 请求层
2. 实现用户注册/登录/登出（前端对接后端）
3. 实现用户资料管理
4. 实现收藏功能（增删查）
5. 实现登录历史展示
6. 实现密码修改
7. 实现密保问题修改
8. 实现数据导入导出
9. 实现管理员登录
10. 实现管理员用户管理（查看/删除）

**验收标准**：
- 用户可注册、登录、登出
- 收藏功能正常
- 管理员可管理用户
- 所有数据存储在后端数据库

---

### 阶段四：游戏管理与新功能

**目标**：实现游戏在线管理和新增功能

**任务清单**：
1. 实现游戏 CRUD API（后端）
2. 实现管理员游戏管理页面（前端）
3. 导入现有游戏数据到数据库
4. 实现标签筛选功能
5. 实现全局搜索功能
6. 实现评论/评分功能
7. 实现主题色自定义
8. 实现游戏资讯聚合（RSS）

**验收标准**：
- 管理员可在线增删改游戏
- 标签筛选正常
- 全局搜索正常
- 评论/评分正常
- 主题色可自定义

---

### 阶段五：PWA 与 SEO 优化

**目标**：提升体验和可发现性

**任务清单**：
1. 配置 PWA（manifest.json + Service Worker）
2. 实现离线访问
3. 生成 sitemap.xml
4. 配置 robots.txt
5. 添加 Open Graph 标签
6. 添加结构化数据（JSON-LD）
7. 图片懒加载优化
8. 代码分割优化

**验收标准**：
- 可安装到桌面/手机
- 离线可浏览已缓存内容
- Lighthouse SEO 分数 90+
- Lighthouse 性能分数 90+

---

### 阶段六：部署与 CI/CD

**目标**：自动化部署到生产环境

**任务清单**：
1. 配置 GitHub Actions 工作流
2. 配置 Render.com 部署
3. 绑定域名 linglan.xin
4. 配置免费 SSL
5. 配置数据库自动备份（每天）
6. 配置手动备份功能
7. 编写部署文档

**验收标准**：
- 推送到 main 自动部署
- linglan.xin 可正常访问
- HTTPS 正常
- 数据库每天自动备份

---

## 八、环境变量配置

后端 `.env` 文件：

```env
# 服务配置
PORT=3000
NODE_ENV=production

# 数据库
DB_PATH=./data/app.db

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# 管理员初始化
ADMIN_EMAIL=admin@linglan.xin
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NICKNAME=管理员

# QQ 邮箱 SMTP
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-qq@qq.com
SMTP_PASS=your-qq-authorization-code

# 前端地址
CLIENT_URL=https://linglan.xin

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 九、安全措施清单

| 措施 | 说明 |
|------|------|
| bcrypt 密码哈希 | 密码不可逆加密 |
| JWT + HttpOnly Cookie | 安全的会话管理 |
| helmet | 安全响应头 |
| CORS 白名单 | 仅允许前端域名访问 |
| express-rate-limit | 防止暴力破解 |
| 输入校验 | 防止 XSS/SQL 注入 |
| 参数化查询 | 使用 better-sqlite3 预处理语句 |
| 邮箱验证 | 防止恶意注册 |
| 验证码 | 登录失败多次后触发 |

---

## 十、风险与应对

| 风险 | 应对措施 |
|------|----------|
| Render 免费实例冷启动慢 | 接受，或升级付费版 |
| QQ 邮箱 SMTP 限额 | 监控，必要时切换 Resend |
| SQLite 并发性能 | 当前规模够用，后续可迁移 PostgreSQL |
| OAuth 配置复杂 | 分阶段实现，先自建登录 |
| 数据迁移风险 | 先备份现有数据，逐步迁移 |

---

## 十一、后续可扩展方向

- 迁移到 PostgreSQL（用户规模增长时）
- 接入 Redis 缓存
- 接入 CDN 加速静态资源
- 增加更多 OAuth 提供商
- 增加游戏数据自动同步
- 增加用户行为分析

---

## 十二、里程碑时间线

| 阶段 | 预计时间 | 交付物 |
|------|----------|--------|
| 阶段一 | 3-4 天 | 后端认证系统 + 单元测试 |
| 阶段二 | 3-4 天 | 前端项目骨架 + 页面迁移 |
| 阶段三 | 2-3 天 | 前后端联调完成 |
| 阶段四 | 4-5 天 | 游戏管理 + 新功能 |
| 阶段五 | 2-3 天 | PWA + SEO 优化 |
| 阶段六 | 1-2 天 | 部署上线 |
| **总计** | **约 15-21 天** | |
