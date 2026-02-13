# Vers123 Game Navigation Website / Vers123 游戏导航网站

---

## 语言选择 / Language Selection

### [English Version](#english-version) | [中文版](#中文版)

---

## English Version

---

## 项目概述 / Project Overview

**Vers123 Game Navigation Website** — A clean, lightweight game navigation site that gathers official links for miHoYo games and other popular titles.

This site helps players quickly find official resources for various games, including official websites, download pages, community portals, and more.

---

## 项目特点 / Project Features

- Modern, minimal interface with smooth UI transitions
- Responsive layout for an optimal experience on desktop, tablet, and mobile
- Fast-loading pages with a compact, maintainable codebase
- Intuitive navigation and clear categorization of game resources
- Bilingual support (Chinese / English)

---

## 项目结构 / Project Structure

```
vers123.github.io/
├── index.html                      # Homepage
├── README.md                       # Project documentation
├── web/                            # Site source files (lowercase 'web' to match repository)
│   ├── mihoyo_web/
│   │   ├── miHoYo.html            # miHoYo game navigation page (bilingual)
│   │   └── mihoyo/                # images and assets for miHoYo pages
│   │       └── images/
│   └── another_game_web/
│       ├── another_games.html     # Other games navigation page (bilingual)
│       └── another_games/         # images and assets for other-games pages
```

Notes:
- Open `index.html` to get started locally. The site can also be served via GitHub Pages when published.

---

## 快速开始 / Quick Start

1. Clone or download this repository.
2. Open `index.html` in your browser to preview locally, or view the live site (if published) at `https://vers123.github.io` or `https://www.linglan.xin`.
3. Click a game card to navigate to its page.
4. Use on-page controls to access official sites, downloads, and communities.

---

## 使用说明 / Usage

### Homepage
- **miHoYo Games**: Opens the miHoYo games navigation page.
- **Other Games**: Opens the other-games navigation page.

### Game Navigation Pages
- **Official Website**: Opens the official game website in a new tab.
- **Download**: Links to the game's download or store page.
- **Community**: Opens the game's community portal or forum.
- **News**: Links to news or announcements when available.

---

## 技术栈 / Tech Stack

- **HTML5** — Semantic markup and page structure
- **Tailwind CSS** — Utility-first styling framework
- **Inline SVG icons** — Icons are embedded inline to avoid external icon dependencies
- **JavaScript** — Client-side interactivity and small utilities

---

## 游戏列表 / Game List

### miHoYo Games
1. **Genshin Impact** (原神)
2. **Honkai Impact 3rd** (崩坏3)
3. **Honkai: Star Rail** (崩坏：星穹铁道)
4. **Zenless Zone Zero** (绝区零)
5. **Tears of Themis** (未定事件簿)

### Other Games
1. **Minecraft** (我的世界)
2. More titles coming soon

---

## 开发指南 / Development Guide

### Adding New Games

1. Add the game's image to the appropriate `images` folder under `web/<site>/*`.
2. Add a game card to the corresponding HTML page.
3. Configure links (official website, downloads, community) in the card markup.

### Modifying Styles

- Prefer Tailwind CSS utility classes for layout and styling adjustments.
- For larger style changes, update the Tailwind config or add small scoped styles in the page head.

---

## SEO优化 / SEO Optimization

The site follows basic SEO best practices:

- Proper meta tags for title and description
- Semantic HTML elements
- Alt text for images
- Descriptive titles for each page

---

## 性能优化 / Performance Optimization

- Compressed images to reduce loading time
- Clean, minimal JavaScript for interactions
- Consolidated and trimmed CSS where appropriate
- Responsive images and lazy-loading applied where helpful

---

## 常见问题 / FAQ

---

## 更新日志 / Changelog

### V2.5 (2026-02-13)
- Replaced external Font Awesome icons with inline SVG icons to remove the external dependency (updated files: `index.html`, `web/mihoyo_web/miHoYo.html`, `web/another_game_web/another_games.html`).
- Consolidated and simplified CSS blocks in page heads to reduce duplication and improve maintainability.
- Improved language toggle robustness by adding safety guards; language toggling now avoids runtime errors if elements are missing.
- Converted theme toggle and favorite icons to use inline SVGs and updated related JS to swap SVG visibility/classes for consistent behavior.
- Added an alternate access domain: the site can be visited at `vers123.github.io` and `www.linglan.xin`.

### V2.4 (2025-12-23)
- Fixed search box style issue (white text on white background).
- Fixed content duplication issue (overlapping Chinese/English elements).
- Improved language switching functionality (implemented full English/Chinese toggle logic).
- Updated language toggle to switch between complete language modes.

### V2.3 (2025-12-23)
- Added user favorites feature with local storage persistence.
- Added search functionality for game name filtering.
- Added dark mode theme with toggle button.
- Optimized mobile experience and responsive design.
- Integrated bilingual support into single files (removed _CN and _EN suffixes).
- Added language switching functionality.

### V2.2 (2025-12-23)
- Integrated README_EN.md and README_CN.md into README.md.
- Deleted redundant language-specific README files.
- Unified documentation structure for better maintainability.

### V2.1 (2025-12-23)
- Added English versions of pages and README documentation.
- Added bilingual support across the site.

### V2.0 (2025-12-23)
- Added Minecraft game navigation and updated other-games page.
- Added Microsoft and Minecraft logos.
- Updated project documentation.

### V1.0 (2025-12-23)
- Initial release: basic miHoYo navigation, UI and interactions.

---

## 未来计划 / Future Plans

- [ ] Add more game categories
- [ ] Implement advanced search filters
- [ ] Add a simple game recommendation feature
- [ ] Further polish UX and animations

---

## 许可证 / License

This project is provided for learning and demonstration purposes. Please respect the intellectual property rights of game developers.

---

## 联系方式 / Contact

If you have questions, suggestions, or issues, please open an issue in the repository or contact the maintainer.

---

---

## 中文版

---

## 项目概述

**Vers123 游戏导航网站** — 一个简洁轻量的游戏导航站，汇集了米哈游以及其他热门游戏的官方链接。

本网站旨在帮助玩家快速找到各种游戏的官方资源，包括官网、游戏下载、社区入口等。

---

## 项目特点

- 现代简洁的界面与流畅的交互过渡
- 响应式布局，兼顾桌面、平板和移动端体验
- 精简且易维护的前端实现，加载速度快
- 清晰的资源分类和直观的导航
- 支持中英文双语显示

---

## 项目结构

```
vers123.github.io/
├── index.html                      # 首页
├── README.md                       # 项目文档
├── web/                            # 网站源码（小写 'web' 与仓库保持一致）
│   ├── mihoyo_web/
│   │   ├── miHoYo.html            # 米哈游游戏导航页面（双语）
│   │   └── mihoyo/                # miHoYo 页面相关的图片与资源
│   │       └── images/
│   └── another_game_web/
│       ├── another_games.html     # 其他游戏导航页面（双语）
│       └── another_games/         # 其他游戏页面的图片与资源
```

---

## 快速开始

1. 克隆或下载本代码库。
2. 在浏览器中打开 `index.html` 进行本地预览；发布后也可通过 `https://vers123.github.io` 或 `https://www.linglan.xin` 访问。
3. 点击游戏卡片进入相应页面。
4. 使用页面上的控件访问游戏官网、下载或社区入口。

---

## 使用说明

### 首页
- **米哈游游戏**：打开米哈游游戏导航页面。
- **其他游戏**：打开其他游戏导航页面。

### 游戏导航页面
- **官方网站**：在新标签页打开游戏官网。
- **下载**：跳转到游戏下载或商店页面。
- **社区**：打开游戏官网社区或论坛入口。
- **新闻**：如有可用的新闻或公告，将提供链接。

---

## 技术栈

- **HTML5**：页面结构
- **Tailwind CSS**：样式框架
- **内联 SVG 图标**：图标使用内联 SVG，避免外部图标依赖
- **JavaScript**：前端交互功能

---

## 游戏列表

### 米哈游游戏
1. **原神** (Genshin Impact)
2. **崩坏3** (Honkai Impact 3rd)
3. **崩坏：星穹铁道** (Honkai: Star Rail)
4. **绝区零** (Zenless Zone Zero)
5. **未定事件簿** (Tears of Themis)

### 其他游戏
1. **我的世界** (Minecraft)
2. 更多游戏将陆续添加

---

## 开发指南

### 添加新游戏

1. 在对应的 `images` 文件夹中添加游戏图片。
2. 在相应的 HTML 页面中添加游戏卡片。
3. 在卡片中配置游戏官网、下载和社区链接。

### 修改样式

- 优先使用 Tailwind CSS 的工具类进行布局和样式调整。
- 如需更大范围的样式修改，可在页面 head 中调整 Tailwind 配置或添加小范围样式。

---

## SEO 优化

该站点遵循基本的 SEO 最佳实践：

- 合理的 meta 信息（标题、描述）
- 语义化的 HTML 标签
- 图片使用 alt 文本
- 每页均有描述性的标题

---

## 性能优化

- 图片进行了压缩以减少加载成本
- 交互逻辑采用轻量 JavaScript 实现
- 合理合并与精简 CSS，按需延迟加载图片

---

## 更新日志

### V2.5 (2026-02-13)
- 将外部 Font Awesome 图标替换为内联 SVG，以移除外部依赖（更新文件：`index.html`、`web/mihoyo_web/miHoYo.html`、`web/another_game_web/another_games.html`）。
- 合并并精简了页面 head 中的 CSS 区块，减少重复并提高可维护性。
- 增强了语言切换健壮性，添加了容错保护，避免因缺失元素导致运行错误。
- 主题切换和收藏图标改为内联 SVG，并更新相关 JavaScript 用于切换 SVG 可见性/类名。
- 新增备用访问域名：站点已可通过 `vers123.github.io` 与 `www.linglan.xin` 访问。

### V2.4 (2025-12-23)
- 修复了搜索框样式问题（白色背景上的白色文字）。
- 修复了中英文内容重复显示问题。
- 改进了语言切换功能（实现完整的中/英切换逻辑）。
- 更新了语言切换按钮的行为以支持完整切换。

### V2.3 (2025-12-23)
- 添加了用户收藏功能并使用本地存储保存。
- 增加了按游戏名称搜索的功能。
- 添加了暗黑模式主题及切换按钮。
- 优化移动端体验，支持响应式布局。
- 将双语支持整合到单文件中（移除 _CN 与 _EN 后缀）。
- 添加语言切换功能。

### V2.2 (2025-12-23)
- 将 README_EN.md 与 README_CN.md 合并至 README.md。
- 删除冗余的语言专用 README 文件。
- 统一文档结构以提高可维护性。

### V2.1 (2025-12-23)
- 添加页面与 README 的英文版本。
- 为全站添加双语支持。

### V2.0 (2025-12-23)
- 添加 Minecraft 游戏导航并更新其他游戏页面。
- 添加微软与 Minecraft 的 logo。
- 更新项目文档。

### V1.0 (2025-12-23)
- 初始发布：米哈游导航基础功能与 UI/交互。

---

## 未来计划

- [ ] 添加更多游戏分类
- [ ] 实现进阶搜索筛选
- [ ] 增加简单的游戏推荐功能
- [ ] 持续优化用户体验与动效

---

## 许可证

本项目供学习与演示使用，请尊重游戏开发者的知识产权。

---

## 联系方式

如有问题、建议或需要帮助，请在仓库中打开 issue 或联系维护者。

---
