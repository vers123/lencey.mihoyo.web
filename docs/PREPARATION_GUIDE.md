# 实施前准备指南

> 本文档列出项目实施前需要您完成的所有准备工作，按优先级排序。

---

## 一、域名 DNS 配置（linglan.xin）

### 1.1 Render 部署后获取域名

在 Render.com 部署 Node 后端服务后，Render 会提供一个 `onrender.com` 子域名（如 `vers123-game-nav.onrender.com`）。

### 1.2 配置 DNS 解析

登录您的域名注册商（如阿里云、腾讯云、GoDaddy 等），进入 linglan.xin 的 DNS 管理页面，添加以下记录：

| 记录类型 | 主机记录 | 记录值 | 说明 |
|----------|----------|--------|------|
| CNAME | @ | vers123-game-nav.onrender.com | 根域名指向 Render |
| CNAME | www | vers123-game-nav.onrender.com | www 子域名指向 Render |

> 注意：部分域名注册商不支持根域名 CNAME，可改用 A 记录指向 Render 提供的 IP 地址。

### 1.3 在 Render 中绑定自定义域名

1. 进入 Render 后台 → 你的服务 → Settings → Custom Domains
2. 添加 `linglan.xin`
3. Render 会自动签发免费 SSL 证书（Let's Encrypt）
4. 等待 DNS 生效（通常 10 分钟 - 24 小时）

---

## 二、QQ邮箱 SMTP 授权码

### 2.1 开启 SMTP 服务

1. 登录 QQ 邮箱：https://mail.qq.com
2. 点击顶部「设置」→「账户」
3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启「SMTP服务」（如下图所示位置）
5. 点击「生成授权码」，按提示用绑定手机发送短信验证

### 2.2 获取授权码

- 授权码是一串 16 位英文字母（如 `abcdefghijklmnop`）
- **此授权码不是邮箱密码**，是专门用于 SMTP 发送邮件的
- 将授权码保存好，后续填入后端环境变量 `SMTP_PASS`

### 2.3 环境变量配置

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ号@qq.com
SMTP_PASS=你的16位授权码
```

---

## 三、GitHub OAuth App 创建

### 3.1 创建 OAuth App

1. 登录 GitHub，进入：https://github.com/settings/developers
2. 点击「OAuth Apps」→「New OAuth App」
3. 填写信息：

| 字段 | 值 |
|------|-----|
| Application name | Vers123 Game Navigation |
| Homepage URL | https://linglan.xin |
| Application description | 游戏导航站 - GitHub 登录 |
| Authorization callback URL | https://linglan.xin/api/auth/oauth/github/callback |

4. 点击「Register application」

### 3.2 获取 Client ID 和 Secret

- 创建后页面会显示 **Client ID**（如 `Iv1.xxxxxxxxxxxxxxxx`）
- 点击「Generate a new client secret」生成 **Client Secret**
- 保存这两个值

### 3.3 环境变量配置

```env
GITHUB_CLIENT_ID=你的Client_ID
GITHUB_CLIENT_SECRET=你的Client_Secret
```

---

## 四、Google OAuth 凭证创建

### 4.1 创建 Google Cloud 项目

1. 登录 Google Cloud Console：https://console.cloud.google.com/
2. 点击顶部项目选择器 →「新建项目」
3. 项目名称：`Vers123 Game Nav`，点击创建

### 4.2 配置 OAuth 同意屏幕

1. 左侧菜单 →「API 和服务」→「OAuth 同意屏幕」
2. User Type 选择「External」（外部）
3. 填写应用名称：`Vers123 Game Navigation`
4. 用户支持邮箱：你的邮箱
5. 开发者联系信息：你的邮箱
6. 保存并继续

### 4.3 创建 OAuth 客户端 ID

1. 左侧菜单 →「API 和服务」→「凭据」
2. 点击「创建凭据」→「OAuth 客户端 ID」
3. 应用类型选择「Web 应用」
4. 名称：`Vers123 Game Nav Web`
5. 已获授权的重定向 URI 添加：
   ```
   https://linglan.xin/api/auth/oauth/google/callback
   ```
6. 点击创建

### 4.4 获取 Client ID 和 Secret

- 创建后弹窗会显示 **客户端 ID** 和 **客户端密钥**
- 保存这两个值

### 4.5 环境变量配置

```env
GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的客户端密钥
```

---

## 五、Render.com 注册与部署

### 5.1 注册 Render 账号

1. 访问 https://render.com
2. 点击「Get Started」
3. 用 GitHub 账号登录（推荐，方便自动部署）

### 5.2 部署 Node.js 后端服务

1. 点击「New +」→「Web Service」
2. 连接你的 GitHub 仓库
3. 配置：

| 字段 | 值 |
|------|-----|
| Name | vers123-game-nav |
| Region | Singapore（新加坡，离国内近） |
| Branch | main |
| Root Directory | server |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node src/app.js` |
| Instance Type | Free（免费） |

4. 点击「Create Web Service」

### 5.3 配置环境变量

在 Render 服务的「Environment」选项中添加：

```env
NODE_ENV=production
PORT=10000
DB_PATH=./data/app.db
JWT_SECRET=你的JWT密钥
ADMIN_EMAIL=admin@linglan.xin
ADMIN_PASSWORD=你的管理员密码
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ号@qq.com
SMTP_PASS=你的QQ邮箱授权码
CLIENT_URL=https://linglan.xin
GITHUB_CLIENT_ID=你的GitHub_Client_ID
GITHUB_CLIENT_SECRET=你的GitHub_Client_Secret
GOOGLE_CLIENT_ID=你的Google_Client_ID
GOOGLE_CLIENT_SECRET=你的Google_Client_Secret
```

### 5.4 部署 Python FastAPI 微服务

1. 点击「New +」→「Web Service」
2. 连接同一个 GitHub 仓库
3. 配置：

| 字段 | 值 |
|------|-----|
| Name | vers123-mihoyo-toolkit |
| Region | Singapore |
| Branch | main |
| Root Directory | python-service |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt && playwright install chromium` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free |

4. 点击「Create Web Service」

> 注意：Render 免费实例闲置 15 分钟会休眠，首次访问有冷启动延迟（约 30-50 秒）。

---

## 六、JWT 密钥生成

JWT_SECRET 用于签名用户令牌，需要一个足够随机的字符串。

### 生成方式

在终端执行（任选其一）：

```bash
# 方式1：openssl
openssl rand -hex 32

# 方式2：node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方式3：python
python -c "import secrets; print(secrets.token_hex(32))"
```

将生成的 64 位十六进制字符串填入 `JWT_SECRET`。

---

## 七、管理员账号

管理员账号通过环境变量初始化，首次启动时自动创建。

```env
ADMIN_EMAIL=admin@linglan.xin
ADMIN_PASSWORD=请设置一个强密码（12位以上，含大小写字母、数字、特殊符号）
```

> 管理员邮箱 `admin@linglan.xin` 仅作为登录账号使用，无需真实邮箱。

---

## 八、本地开发环境

### 8.1 Node.js

确保已安装 Node.js 18+：

```bash
node --version
```

如未安装，访问 https://nodejs.org 下载安装。

### 8.2 Python

您已有 Python 3.13.15，满足要求（需要 3.8+）。

### 8.3 Playwright 浏览器

```bash
pip install playwright
playwright install chromium
```

---

## 九、准备清单总览

| 序号 | 准备项 | 状态 | 备注 |
|------|--------|------|------|
| 1 | 域名 DNS 配置 | ⬜ 待完成 | 需 Render 部署后配置 |
| 2 | QQ 邮箱授权码 | ⬜ 待完成 | 见第二节 |
| 3 | GitHub OAuth | ⬜ 待完成 | 见第三节 |
| 4 | Google OAuth | ⬜ 待完成 | 见第四节 |
| 5 | Render 账号注册 | ⬜ 待完成 | 见第五节 |
| 6 | JWT 密钥 | ⬜ 待完成 | 见第六节 |
| 7 | 管理员密码 | ⬜ 待完成 | 自行设置强密码 |
| 8 | 本地 Node.js | ✅ 需确认 | 需 18+ |
| 9 | 本地 Python | ✅ 已就绪 | 3.13.15 |
| 10 | Playwright 浏览器 | ⬜ 待完成 | 见第八节 |

---

## 十、注意事项

1. **所有密钥和密码不要提交到 Git 仓库**，通过环境变量配置
2. Render 免费实例有冷启动延迟，如需避免可升级付费版（约 $7/月）
3. QQ 邮箱 SMTP 有发送限额（约 100 封/天），如需更大额度可考虑 Resend
4. Google OAuth 在未发布前，只有测试用户可以登录，需在 OAuth 同意屏幕中添加测试用户
5. 域名 DNS 生效需要时间，建议提前配置
