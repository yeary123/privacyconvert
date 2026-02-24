# Supabase 邮件品牌与登录链接配置

为了让登录/注册确认邮件体现 **PrivacyConvert** 网站，并确保点击邮件中的链接能正确进入已登录状态，需要在本项目代码之外完成以下 Supabase 控制台配置。

---

## 1. 邮件体现 PrivacyConvert 网站

当前邮件由 Supabase 发送，发件人显示为 “Supabase Auth”。要体现 PrivacyConvert：

### 1.1 修改邮件模板（必做）

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选择项目 → **Authentication** → **Email Templates**。
2. 编辑以下模板，在主题和正文中加入 **PrivacyConvert** 和站点信息：

**Confirm signup（确认注册）**

- **Subject** 示例：`Confirm your signup – PrivacyConvert` 或 `PrivacyConvert：请确认您的注册`
- **Body** 示例（保留 `{{ .ConfirmationURL }}` 等变量）：

```html
<h2>Confirm your signup – PrivacyConvert</h2>
<p>You signed up at <strong>PrivacyConvert</strong>. Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you didn't sign up at privacyconvert.online, you can ignore this email.</p>
```

**Magic Link（魔法链接登录）**

- **Subject** 示例：`Your PrivacyConvert sign-in link`
- **Body** 示例：

```html
<h2>Sign in to PrivacyConvert</h2>
<p>Click the link below to sign in to your account. No password needed.</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to PrivacyConvert</a></p>
```

保存后，新发出的邮件会带有 PrivacyConvert 品牌。

### 1.2 自定义发件人名称（可选）

若希望发件人显示为 “PrivacyConvert” 而不是 “Supabase Auth”：

- **Authentication** → **Providers** → **Email** → **SMTP Settings** 中配置自定义 SMTP（如 Brevo、SendGrid 等），并设置 **Sender name** 为 `PrivacyConvert`，发件地址使用你的域名（例如 `noreply@privacyconvert.online`）。
- 若使用 Supabase 默认邮件服务，发件人名称和地址由 Supabase 固定，无法改为 PrivacyConvert，只能通过上面修改邮件正文和主题来体现品牌。

---

## 2. 点击跳转链接进入已登录网站

本项目已做两件事：

1. **Auth callback 同时支持两种回调方式**  
   - URL 带 `?code=...`（PKCE）：会 `exchangeCodeForSession` 后写 session并同步 profile，再跳转首页。  
   - URL 带 `#access_token=...`（hash）：会 `setSession` 后同步 profile，再跳转首页。  
   无论 Supabase 用哪种方式重定向，用户点击邮件链接后都会进入已登录状态并跳转到首页。

2. **登录时使用的重定向地址**  
   - 若配置了 `NEXT_PUBLIC_SITE_URL`（例如 `https://www.privacyconvert.online`），邮件中的链接会指向该站点的 `/auth/callback`，保证生产环境始终跳回正式站。

你需要在 Supabase 中把该回调地址加入白名单，否则会被拒绝：

1. **Authentication** → **URL Configuration**。
2. 在 **Redirect URLs** 中加入：
   - 生产：`https://www.privacyconvert.online/auth/callback`（或你的实际站点根 URL + `/auth/callback`）。
   - 本地开发：`http://localhost:3000/auth/callback`。
3. **Site URL** 建议设为生产站根 URL，例如：`https://www.privacyconvert.online`。

这样邮件里的确认/登录链接会跳转到你的站点 `/auth/callback`，由本项目的 callback 逻辑完成登录并进入已登录的网站。

---

## 3. 环境变量

确保生产环境配置：

```bash
NEXT_PUBLIC_SITE_URL=https://www.privacyconvert.online
```

这样登录页请求 magic link 时会使用该 URL 作为 `emailRedirectTo` 的基础，邮件中的链接会指向生产站而非当前访问的域名。

---

## 4. 小结

| 目标 | 操作 |
|------|------|
| 邮件内容体现 PrivacyConvert | 在 Supabase Email Templates 中修改 Confirm signup / Magic Link 的主题和正文，加入 “PrivacyConvert” 和站点说明。 |
| 发件人显示为 PrivacyConvert | 配置自定义 SMTP，并设置 Sender name 为 PrivacyConvert（可选）。 |
| 点击链接进入已登录网站 | 在 Redirect URLs 中加入 `https://www.privacyconvert.online/auth/callback` 与本地 URL；设置 Site URL；项目已支持 code 与 hash 两种回调。 |
| 生产环境链接指向正式站 | 设置 `NEXT_PUBLIC_SITE_URL` 为生产站根 URL。 |
