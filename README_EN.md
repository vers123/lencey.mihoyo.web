# Vers123 Game Navigation Website

<div style="text-align: center;">
  <img src="assets/images/common/lencey.png" alt="Logo" style="width: 640px; height: 640px;">
  <p style="text-align: center;">
    A clean, lightweight game navigation platform aggregating official links for miHoYo and popular games
    <br>
    <a href="#project-overview"><strong>Explore Documentation »</strong></a>
    <br><br>
    <a href="https://vers123.github.io">Live Demo</a>
    ·
    <a href="https://github.com/vers123/vers123.github.io/issues">Report Issues</a>
    ·
    <a href="#roadmap">Feature Requests</a>
  </p>
</div>

[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)](https://vers123.github.io)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-blue)](https://vers123.github.io)
[![Bilingual](https://img.shields.io/badge/Language-ZH%2FEN-orange)](#language-selection)
[![Last Update](https://img.shields.io/badge/Last%20Update-2026--05--16-yellowgreen)](https://github.com/vers123/vers123.github.io/commits/main)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Features](#project-features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Supported Games](#supported-games)
- [Tech Stack](#technical-stack)
- [Development Guide](#development-guide)
- [Changelog](#changelog)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact & Support](#contact--support)

---

## Project Overview

**Vers123 Game Navigation Website** is a clean, lightweight game navigation platform that aggregates official links for miHoYo games and other popular titles.

This website helps players quickly access official game resources including:

- Official game websites
- Download pages
- Community portals
- News & announcements
- Customer support channels

### Key Benefits

- One-stop access to official game resources
- Ad-free and distraction-free experience
- Fast loading speeds with optimized assets
- Consistent experience across all devices

## Project Features

✅ **Modern UI/UX**

- Clean, minimal interface with smooth animations
- Intuitive navigation and clear visual hierarchy
- Responsive design for all screen sizes

✅ **Core Functionality**

- Bilingual support (Chinese / English)
- Dark/light mode toggle
- Game favorites (local storage persistence)
- Real-time search & filtering
- One-click access to official resources

✅ **Technical Excellence**

- Semantic HTML5 markup
- Utility-first CSS with Tailwind
- Lightweight vanilla JavaScript
- Optimized asset loading
- SEO-friendly implementation

## Project Structure

```
vers123.github.io/
├── .github/                    # GitHub workflows & settings
│   └── workflows/
│       └── deploy.yml          # Auto-deployment configuration
├── assets/                     # Static assets
│   ├── images/                 # Image resources
│   │   ├── mihoyo/             # miHoYo game images
│   │   ├── another_games/      # Other game images
│   │   │   └── game_logo/      # Game logos
│   │   └── common/             # Shared images (logo, icons)
│   ├── js/                     # JavaScript modules
│   │   ├── storage.js          # Storage utilities (IndexedDB/localStorage)
│   │   ├── auth/               # Authentication modules
│   │   │   ├── user.js         # User management
│   │   │   ├── login.js        # Login functionality
│   │   │   └── register.js     # Registration functionality
│   │   ├── ui/                 # UI modules
│   │   │   ├── favorites.js    # Favorites functionality
│   │   │   └── search.js       # Search functionality
│   │   ├── admin/              # Admin modules
│   │   │   └── dashboard.js    # Admin dashboard
│   │   └── common.js           # Shared functionality
│   └── css/
│       └── custom.css          # Custom styles & overrides
├── config/                     # Configuration files
│   ├── site.config.js          # Site configuration
│   └── games.config.js         # Games data configuration
├── templates/                  # HTML templates
│   ├── header.html              # Common header
│   ├── footer.html              # Common footer
│   └── theme-toggle.html       # Theme toggle button
├── pages/                      # Subpages
│   ├── auth/
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Registration page
│   │   └── forgot-password.html # Forgot password page
│   ├── account/
│   │   └── index.html          # Account management page
│   ├── admin/
│   │   ├── index.html          # Admin dashboard
│   │   └── login.html          # Admin login
│   ├── mihoyo/
│   │   └── index.html          # miHoYo games navigation
│   ├── other-games/
│   │   └── index.html          # Other games navigation
│   └── 404.html                # Custom 404 page
├── .gitignore                  # Git ignore rules
├── tailwind.config.js          # Tailwind CSS configuration
├── index.html                  # Main homepage
└── README.md                   # Project documentation
```

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required for basic usage

### Local Preview

1. Clone this repository
   ```bash
   git clone https://github.com/vers123/vers123.github.io.git
   ```

2. Navigate to the project directory
   ```bash
   cd vers123.github.io
   ```

3. Open index.html in your web browser
    - Double-click the file, or
    - Use a local web server (e.g., VS Code Live Server)

### Live Access

- Primary: https://vers123.github.io
- Alternative: https://www.linglan.xin

## Usage Guide

### Homepage

- **miHoYo Games**: Click to access miHoYo game navigation page
- **Other Games**: Click to access other popular games navigation page
- **Language Toggle**: Switch between Chinese/English interface
- **Theme Toggle**: Switch between light/dark mode
- **Login/Register**: Access account system for user authentication

### Game Navigation Pages

Each game card includes:

- **Official Website**: Opens in new tab
- **Download**: Direct link to game client/download page
- **Community**: Official community/forum access
- **News**: Latest game updates and announcements
- **Favorite**: Save games to your personal favorites list
- **Search**: Filter games by name (real-time results)

## Supported Games

### miHoYo Games

| Game Name         | Chinese Name | Status   |
|-------------------|--------------|----------|
| Genshin Impact    | 原神           | ✅ Active |
| Honkai Impact 3rd | 崩坏 3         | ✅ Active |
| Honkai: Star Rail | 崩坏：星穹铁道      | ✅ Active |
| Zenless Zone Zero | 绝区零          | ✅ Active |
| Tears of Themis   | 未定事件簿        | ✅ Active |

### Other Games

| Game Name               | Chinese Name | Status     |
|-------------------------|--------------|------------|
| Minecraft               | 我的世界         | ✅ Active   |
| Counter-Strike 2        | CS2          | ✅ Active   |
| The Legend of Zelda     | 塞尔达传说        | ✅ Active   |
| League of Legends       | 英雄联盟         | ✅ Active   |
| Fortnite                | 堡垒之夜         | ✅ Active   |

## Technical Stack

| Technology         | Purpose                                |
|--------------------|----------------------------------------|
| HTML5              | Semantic page structure                |
| Tailwind CSS v3    | Utility-first styling framework        |
| Vanilla JavaScript | Client-side interactivity              |
| Inline SVG         | Icon system (no external dependencies) |
| LocalStorage       | Persistent user data and preferences   |
| GitHub Pages       | Hosting & deployment                   |

## Development Guide

### Adding a New Game

1. **Prepare Assets**
    - Add game logo/images to `assets/images/[category]/`
    - Ensure images are optimized (WebP/PNG format, compressed)

2. **Update HTML**
    - Add game card to corresponding page (`pages/[category]/index.html`)
    - Include all required links (official site, download, community)
    - Add bilingual text (Chinese/English)
    - Add unique `data-game-id`, `data-game-name`, and `data-category` attributes for favorites functionality

3. **Test Implementation**
    - Verify game card displays correctly
    - Test all links work as expected
    - Verify search functionality finds the new game
    - Test favorite/unfavorite functionality
    - Check responsive design on different screen sizes

### Customizing Styles

- **Preferred**: Use Tailwind CSS utility classes directly in HTML
- **Global Changes**: Modify `tailwind.config.js` for theme changes
- **Custom Styles**: Add to `assets/css/custom.css` (scoped with unique classes)
- **Dark Mode**: Ensure styles have corresponding `.dark` variants

### Performance Optimization Checklist

- [ ] Images are compressed and use appropriate formats
- [ ] JavaScript is minified and deferred
- [ ] CSS is consolidated and minimized
- [ ] Lazy loading implemented for images
- [ ] No render-blocking resources
- [ ] Semantic HTML for better SEO

## Changelog

### V2.9 (2026-05-16)

- 🔄 Refactored JavaScript modular architecture, split auth.js into storage.js, user.js, login.js, register.js
- ➕ Added ui/favorites.js and ui/search.js independent modules
- ➕ Added admin/dashboard.js admin module
- ➕ Added config/ configuration directory
- ➕ Added templates/ HTML template directory
- 🐛 Fixed missing data-game-name and data-category attributes on favorite buttons
- 🐛 Fixed missing auth/login.js reference on homepage index.html
- 📝 Updated README.md project structure documentation

### V2.8 (2026-04-19)

- 🔐 Implemented local account system with localStorage persistence
- 📝 Added user registration, login, and password reset functionality
- 👤 Created account management page with user information and favorites management
- 🔒 Added password strength validation (12+ characters, mixed case, numbers, symbols)
- 🔄 Updated navigation bars across all pages with login/register buttons
- 📱 Implemented responsive auth UI elements

### V2.7 (2026-04-19)

- 🚀 Extracted common JavaScript functionality to shared file (common.js)
- 🐛 Fixed duplicate data-game-id issue in miHoYo games page
- 🎮 Added Counter-Strike 2, The Legend of Zelda, League of Legends, and Fortnite to "Other Games" category
- 📝 Updated README.md with latest game additions and file structure changes
- 🧹 Removed unused main.js file
- 🔧 Improved 404 page with correct home link and shared functionality

### V2.6 (2026-03-15)

- 🚀 Implemented lazy loading for all images across the site (improved performance)
- 🎮 Added Minecraft games to "Other Games" category
- 📝 Updated README.md with Table of Contents and additional badges
- 🗂️ Corrected project structure to reflect actual file organization
- 📊 Updated supported games tables in both English and Chinese versions

### V2.5 (2026-02-13)

- ✨ Replaced external Font Awesome icons with inline SVG (reduced external dependencies)
- 🧹 Consolidated and simplified CSS blocks in page headers
- 🛡️ Improved language toggle robustness with error handling
- 🎨 Optimized theme toggle and favorite icons (inline SVG)
- 🌐 Added alternate domain access: vers123.GitHub.io & www.linglan.xin

### V2.4 (2025-12-23)

- 🐛 Fixed search box styling (white text on white background)
- 🐛 Fixed overlapping Chinese/English content issue
- 🔧 Improved language switching logic and UI feedback

### V2.3 (2025-12-23)

- ✨ Added favorites feature with localStorage persistence
- ✨ Added real-time game search/filter functionality
- ✨ Added dark/light mode toggle
- 📱 Optimized mobile responsive design
- 🌐 Implemented bilingual support in single files (removed language-specific files)

### V2.2 (2025-12-23)

- 📝 Merged README_EN.md and README_CN.md into single README.md
- 🧹 Removed redundant language-specific documentation

### V2.1 (2025-12-23)

- 🌐 Added English versions of all pages and documentation
- 🌐 Implemented full-site bilingual support

### V2.0 (2025-12-23)

- 🎮 Added Minecraft navigation and "Other Games" page
- 🖼️ Added Microsoft and Minecraft logos/assets
- 📝 Updated project documentation

### V1.0 (2025-12-23)

- 🚀 Initial release with basic miHoYo game navigation
- 🎨 Basic UI implementation and core interactions
- 🌐 Chinese language support only

## Roadmap

### Short-term (Next 1-2 months)

- [x] Add Minecraft games to "Other Games" category
- [ ] Implement advanced search filters (by genre/platform)
- [ ] Add game detail pages with more comprehensive links
- [ ] Improve animation and transition effects

### Midterm (Next 3-6 months)

- [ ] Add game recommendation feature
- [ ] Implement user-contributed game links (moderated)
- [ ] Add game update notifications
- [ ] Multi-theme support (beyond dark/light)

### Long-term (Next 6+ months)

- [x] User account system (optional, local implementation)
- [ ] Mobile app version (Progressive Web App)
- [ ] API integration for game data
- [ ] Community features (ratings, comments)

## License

This project is provided for educational and demonstration purposes only.

All game trademarks, logos, and intellectual property belong to their respective owners. This website is not affiliated with or endorsed by miHoYo, Microsoft, or any other game developers.

## Contact & Support

- 🐞 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions
- 📧 **Email**: contact@linglan.xin (for important matters only)
