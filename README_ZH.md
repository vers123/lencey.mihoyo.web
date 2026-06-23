# Vers123 游戏导航网站

![Logo](assets/images/common/lencey.png)

简洁轻量的游戏导航站，汇集米哈游及热门游戏官方链接

[探索文档](#项目概述) · [在线预览](https://vers123.github.io) · [提交问题](https://github.com/vers123/vers123.github.io/issues) · [功能建议](#开发计划)

[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)](https://vers123.github.io)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-blue)](https://vers123.github.io)
[![Bilingual](https://img.shields.io/badge/Language-ZH%2FEN-orange)](README.md)
[![Last Update](https://img.shields.io/badge/Last%20Update-2026--06--24-yellowgreen)](https://github.com/vers123/vers123.github.io/commits/main)

## 目录

- [项目概述](#项目概述)
- [项目特点](#项目特点)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [使用指南](#使用指南)
- [支持的游戏](#支持的游戏)
- [技术栈](#技术栈)
- [开发指南](#开发指南)
- [更新日志](#更新日志)
- [开发计划](#开发计划)
- [许可证说明](#许可证说明)
- [联系方式与支持](#联系方式与支持)

---

## 项目概述

**Vers123 游戏导航网站** 是一个简洁轻量的游戏导航平台，专注于汇集米哈游（miHoYo）及其他热门游戏的官方链接资源。

本网站旨在帮助玩家一站式获取各类游戏的官方资源，包括：

- 游戏官方网站
- 客户端下载页面
- 官方社区 / 论坛入口
- 游戏新闻与公告
- 客服支持渠道

### 核心优势

- 一站式获取官方游戏资源，无需四处查找
- 无广告、无干扰的纯净浏览体验
- 优化的资源加载策略，页面响应迅速
- 全设备适配，一致的使用体验

## 项目特点

✅ **现代界面与体验**

- 简洁清爽的视觉设计，搭配流畅地过渡动画
- 直观的导航结构和清晰的视觉层级
- 全响应式设计，适配所有屏幕尺寸

✅ **核心功能特性**

- 中英文双语界面切换
- 暗黑 / 浅色模式主题切换
- 游戏收藏功能（本地存储持久化）
- 实时搜索与筛选
- 一键直达官方资源

✅ **技术实现亮点**

- 语义化 HTML5 标记
- Tailwind 工具类优先的 CSS 方案
- 轻量级原生 JavaScript
- 优化的资源加载策略
- 友好的 SEO 实现

## 项目结构

```text
vers123.github.io/
├── .github/                    # GitHub 工作流和设置
│   └── workflows/
│       └── deploy.yml          # 自动部署配置
├── assets/                     # 静态资源
│   ├── images/                 # 图片资源
│   │   ├── mihoyo/             # 米哈游游戏图片
│   │   ├── another_games/      # 其他游戏图片
│   │   │   └── game_logo/      # 游戏 logo
│   │   └── common/             # 共享图片（logo、图标）
│   ├── js/                     # JavaScript 模块
│   │   ├── storage.js          # 存储工具（IndexedDB/localStorage）
│   │   ├── auth/               # 认证模块
│   │   │   ├── user.js         # 用户管理
│   │   │   ├── login.js        # 登录功能
│   │   │   └── register.js     # 注册功能
│   │   ├── ui/                 # UI 模块
│   │   │   ├── favorites.js     # 收藏功能
│   │   │   └── search.js       # 搜索功能
│   │   ├── admin/              # 管理员模块
│   │   │   └── dashboard.js    # 管理后台
│   │   └── common.js           # 公共功能
│   └── css/
│       └── custom.css          # 自定义样式和覆盖
├── config/                     # 配置文件
│   ├── site.config.js          # 网站配置
│   └── games.config.js         # 游戏数据配置
├── templates/                  # HTML 模板
│   ├── header.html             # 公共头部
│   ├── footer.html             # 公共底部
│   └── theme-toggle.html       # 主题切换按钮
├── pages/                      # 子页面
│   ├── auth/
│   │   ├── login.html          # 登录页面
│   │   ├── register.html       # 注册页面
│   │   └── forgot-password.html # 忘记密码页面
│   ├── account/
│   │   └── index.html          # 账户管理页面
│   ├── admin/
│   │   ├── index.html          # 管理后台
│   │   └── login.html          # 管理员登录
│   ├── mihoyo/
│   │   └── index.html          # 米哈游游戏导航
│   ├── other-games/
│   │   └── index.html          # 其他游戏导航
│   └── 404.html                # 自定义 404 页面
├── .gitignore                  # Git 忽略规则
├── index.html                  # 主首页
└── README.md                   # 项目文档
```

## 快速开始

### 环境要求

- 现代网页浏览器（Chrome、Firefox、Safari、Edge）
- 基础使用无需额外安装软件

### 本地预览

1. 克隆本仓库

   ```bash
   git clone https://github.com/vers123/vers123.github.io.git
   ```

2. 进入项目目录

   ```bash
   cd vers123.github.io
   ```

3. 在浏览器中打开 index.html
    - 直接双击文件，或
    - 使用本地网页服务器（如 VS Code Live Server 插件）

### 在线访问

- 主域名：`https://vers123.github.io`
- 备用域名：`https://www.linglan.xin`

## 使用指南

### 首页功能

- **米哈游游戏**：点击进入米哈游游戏导航页面
- **其他游戏**：点击进入其他热门游戏导航页面
- **语言切换**：在中英文界面间切换
- **主题切换**：在暗黑 / 浅色模式间切换
- **登录/注册**：访问账户系统进行用户认证

### 游戏导航页面

每个游戏卡片包含以下功能：

- **官方网站**：在新标签页打开
- **下载**：直达游戏客户端 / 下载页面
- **社区**：官方社区 / 论坛入口
- **新闻**：最新游戏更新和公告
- **收藏**：将游戏保存到个人收藏列表
- **搜索**：按名称筛选游戏（实时结果）

## 支持的游戏

### 米哈游游戏

| 游戏名称（英文）| 游戏名称（中文）| 状态 |
| ----- | ----- | ----- | ----- |
| Genshin Impact    | 原神       | ✅ 已上线 |
| Honkai Impact 3rd | 崩坏 3     | ✅ 已上线 |
| Honkai: Star Rail | 崩坏：星穹铁道  | ✅ 已上线 |
| Zenless Zone Zero | 绝区零      | ✅ 已上线 |
| Tears of Themis   | 未定事件簿    | ✅ 已上线 |

### 其他游戏

| 游戏名称（英文） | 游戏名称（中文） | 状态 |
| ----- | ----- | ----- |
| Minecraft | 我的世界 | ✅ 已上线 |
| Counter-Strike 2 | CS2 | ✅ 已上线 |
| The Legend of Zelda | 塞尔达传说 | ✅ 已上线 |
| League of Legends | 英雄联盟 | ✅ 已上线 |
| Fortnite | 堡垒之夜 | ✅ 已上线 |

## 技术栈

| 技术 | 用途 |
| ----- | ----- |
| HTML5 | 语义化页面结构 |
| Tailwind CSS v4 (CDN) | 工具类优先的样式框架（CDN 加载） |
| Vanilla JavaScript | 前端交互逻辑 |
| 内联 SVG | 图标系统（无外部依赖） |
| LocalStorage | 用户数据和偏好持久化 |
| GitHub Pages | 网站托管与部署 |

## 开发指南

### 添加新游戏

1. **准备资源**
    - 将游戏 logo / 图片添加到 `assets/images/[分类]/` 目录
    - 确保图片已优化（WebP/PNG 格式，已压缩）

2. **更新 HTML**
    - 在对应页面添加游戏卡片 (`pages/[分类]/index.html`)
    - 包含所有必要链接（官网、下载、社区）
    - 添加双语文本（中 / 英文）
    - 为收藏功能添加唯一的 `data-game-id`、`data-game-name` 和 `data-category` 属性

3. **测试验证**
    - 验证游戏卡片显示正常
    - 测试所有链接功能正常
    - 验证搜索功能能找到新添加的游戏
    - 测试收藏 / 取消收藏功能
    - 检查不同屏幕尺寸下的响应式表现

### 样式定制

- **推荐方式**：直接在 HTML 中使用 Tailwind CSS 工具类（通过 CDN 加载）
- **自定义样式**：添加到 `assets/css/custom.css`（使用唯一类名作用域）
- **主题配置**：`assets/css/tailwind.css` 中的 `@theme` 块定义了自定义主题变量
- **暗黑模式**：确保样式有对应的 `.dark` 变体

### 性能优化检查清单

- [ ] 图片已压缩并使用合适格式
- [ ] JavaScript 已压缩并延迟加载
- [ ] CSS 已合并并最小化
- [ ] 图片实现懒加载
- [ ] 无阻塞渲染的资源
- [ ] 使用语义化 HTML 提升 SEO

## 更新日志

### V3.0 (2026-06-24)

- 🔄 升级 Tailwind CSS 从 v3 到 v4
- ➕ 新增 `assets/css/tailwind.css` 使用 Tailwind v4 CSS 配置方式
- 🧹 移除 `tailwind.config.js` 和 `postcss.config.js`（项目使用 CDN 方式）
- 📦 简化 `package.json`，移除所有 tailwind 相关的 devDependencies
- 🎨 统一项目配色，所有配置统一使用 `#4A90E2`
- ➕ 新增管理员后台系统设置功能（站点信息、界面偏好、游戏分类、数据管理、系统信息）
- �📝 更新 README.md 反映最新的技术栈和项目结构

### V2.9 (2026-05-16)

- 🔄 重构 JavaScript 模块化架构，将 auth.js 拆分为 storage.js、user.js、login.js、register.js
- ➕ 新增 ui/favorites.js 和 ui/search.js 独立模块
- ➕ 新增 admin/dashboard.js 管理员模块
- ➕ 新增 config/ 配置文件目录
- ➕ 新增 templates/ HTML 模板目录
- 🐛 修复收藏按钮缺少 data-game-name 和 data-category 属性的问题
- 🐛 修复主页 index.html 缺少 auth/login.js 引用的问题
- 📝 更新 README.md 项目结构文档

### V2.8 (2026-04-19)

- 🔐 实现基于 localStorage 的本地账户系统
- 📝 新增用户注册、登录和密码重置功能
- 👤 创建账户管理页面，包含用户信息和收藏管理
- 🔒 新增密码强度验证（12+ 字符，包含大小写字母、数字和特殊符号）
- 🔄 更新所有页面的导航栏，添加登录 / 注册按钮
- 📱 实现响应式认证 UI 元素

### V2.7 (2026-04-19)

- 🚀 提取公共 JavaScript 功能到共享文件（common.js）
- 🐛 修复米哈游游戏页面重复的 data-game-id 问题
- 🎮 在"其他游戏"分类中添加 CS2、塞尔达传说、英雄联盟和堡垒之夜
- 📝 更新 README.md 添加最新游戏和文件结构变更
- 🧹 删除未使用的 main.js 文件
- 🔧 改进 404 页面的正确主页链接和共享功能

### V2.6 (2026-03-15)

- 🚀 实现所有图片懒加载（提升性能）
- 🎮 在"其他游戏"分类中添加我的世界
- 📝 更新 README.md 添加目录和额外徽章
- 🗂️ 修正项目结构以反映实际文件组织
- 📊 更新中英文版本的支持游戏表格

### V2.5 (2026-02-13)

- ✨ 用内联 SVG 替换外部 Font Awesome 图标（减少外部依赖）
- 🧹 合并和简化页面头部的 CSS 块
- 🛡️ 改进语言切换的健壮性和错误处理
- 🎨 优化主题切换和收藏图标（内联 SVG）
- 🌐 添加备用域名访问：`vers123.github.io` & `www.linglan.xin`

### V2.4 (2025-12-23)

- 🐛 修复搜索框样式（白色背景上的白色文本）
- 🐛 修复中英文内容重叠问题
- 🔧 改进语言切换逻辑和 UI 反馈

### V2.3 (2025-12-23)

- ✨ 添加收藏功能（localStorage 持久化）
- ✨ 添加实时游戏搜索 / 筛选功能
- ✨ 添加暗黑 / 浅色模式切换
- 📱 优化移动端响应式设计
- 🌐 实现单文件内双语支持

### V2.2 (2025-12-23)

- 📝 合并 README_EN.md 和 README_CN.md 为单一 README.md
- 🧹 删除冗余的语言特定文档

### V2.1 (2025-12-23)

- 🌐 添加所有页面和文档的英文版本
- 🌐 实现全站双语支持

### V2.0 (2025-12-23)

- 🎮 添加我的世界导航和"其他游戏"页面
- 🖼️ 添加微软和我世界 logo/ 资源
- 📝 更新项目文档

### V1.0 (2025-12-23)

- 🚀 发布带有基本米哈游游戏导航的初始版本
- 🎨 基本 UI 实现和核心交互
- 🌐 仅支持中文语言

## 开发计划

### 短期计划（未来 1-2 个月）

- [x] 在"其他游戏"分类中添加我的世界
- [ ] 实现高级搜索筛选（按类型 / 平台）
- [ ] 添加游戏详情页面，包含更全面的链接
- [ ] 改进动画和过渡效果

### 中期计划（未来 3-6 个月）

- [ ] 添加游戏推荐功能
- [ ] 实现用户贡献的游戏链接（审核后发布）
- [ ] 添加游戏更新通知
- [ ] 多主题支持（超越暗黑 / 浅色）

### 长期计划（未来 6 个月以上）

- [x] 用户账户系统（可选，本地实现）
- [ ] 移动端应用版本（渐进式 Web 应用）
- [ ] 游戏数据 API 集成
- [ ] 社区功能（评分、评论）

## 许可证说明

本项目仅供教育和演示目的使用。

所有游戏商标、logo 和知识产权归其各自所有者所有。本网站与米哈游、微软或任何其他游戏开发商均无关联或背书。

## 联系方式与支持

- 🐞 **问题反馈**：`GitHub Issues`
- 💡 **功能建议**：`GitHub Discussions`
- 📧 **电子邮件**：`3047493305@qq.com`（仅限重要事项）
