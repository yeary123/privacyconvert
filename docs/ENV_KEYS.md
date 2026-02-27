# Environment Variables & Keys

Keys to configure in `.env.local` (or your hosting platform’s environment variables) for deploy or local run. If not set, the site still runs but the related features are disabled or use defaults.

---

## 0. 域名说明

| 环境 | 域名 | 说明 |
|------|------|------|
| **开发** | `https://privacyconvert-five.vercel.app/` | Vercel 部署，当前使用此域名。 |
| **正式** | `https://www.privacyconvert.online` | 正式生产站。 |

配置 `NEXT_PUBLIC_SITE_URL` 时：当前用开发站则设为开发域名；上线正式站时改为正式域名（用于邮件回调、sitemap、分享链接等）。

---

## 1. Site basics

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site root URL (sharing, sitemap, robots, SEO, auth redirect) | Recommended | 正式站 `https://www.privacyconvert.online`；**当前用开发站时设为** `https://privacyconvert-five.vercel.app` |

---

## 2. Supabase (auth / users / server)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Required when using login/sync |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, e.g. sync-profile) | Required when using server features |

---

## 3. PayPal (payments / subscriptions)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Client ID (frontend SDK) | Required when enabling PayPal |
| `PAYPAL_CLIENT_ID` | Same, for server (can match above) | When calling PayPal from server |
| `PAYPAL_SECRET` | PayPal Secret | When calling from server |
| `PAYPAL_SANDBOX` | `"true"` = sandbox | Optional |
| `PAYPAL_WEBHOOK_ID` | PayPal Webhook ID (payment callback verification) | Required when using Webhook |
| `NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY` | Monthly subscription Plan ID | Only for monthly subscription |
| `NEXT_PUBLIC_PAYPAL_PLAN_YEARLY` | Yearly subscription Plan ID | Only for yearly subscription |

Current pricing page is “Lifetime Pro” one-time purchase. You mainly need: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`; add `PAYPAL_WEBHOOK_ID` if using Webhook.

**从沙盒切到正式环境：**

1. 登录 [PayPal Developer](https://developer.paypal.com/dashboard/) → 顶部切换为 **Live**（不要用 Sandbox）。
2. 在 Live 下使用已有应用或新建应用，获取 **Live** 的 Client ID 和 Secret（与沙盒的完全不同）。
3. 在 `.env.local` 中：把 `NEXT_PUBLIC_PAYPAL_CLIENT_ID`、`PAYPAL_CLIENT_ID`、`PAYPAL_SECRET` 全部换成上述 **Live** 应用的值；将 `PAYPAL_SANDBOX=true` 改为 `PAYPAL_SANDBOX=false`，或删除该行（不设为 `"true"` 即走正式 API）。
4. 若使用 Webhook：在 Live 应用下配置 Webhook（URL 用正式站地址），把新的 Webhook ID 填入 `PAYPAL_WEBHOOK_ID`。
5. 重新部署或重启本地服务，使环境变量生效。

---

## 4. Newsletter

Use any one of the following.

**Option A: Brevo** (free tier ~100k contacts, 300 emails/day)

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo API Key (SMTP & API → API Keys) |
| `BREVO_LIST_ID` | List ID (Contacts → Lists; optional, create a Newsletter list and set this) |

**Option B: ConvertKit**

| Variable | Description |
|----------|-------------|
| `CONVERTKIT_API_KEY` | ConvertKit API Key |
| `CONVERTKIT_FORM_ID` | Subscribe form ID |

**Option C: Buttondown**

| Variable | Description |
|----------|-------------|
| `BUTTONDOWN_API_KEY` | Buttondown API token |

If none are set, the subscribe API still returns success (placeholder behavior) for testing.

---

## 5. Google Analytics

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (e.g. `G-XXXXXXXXXX`) | Optional; leave unset to disable GA |

---

## Summary by platform

| Platform | Variables | Purpose |
|----------|------------|---------|
| **Site** | `NEXT_PUBLIC_SITE_URL` | Site URL, sharing, SEO |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Auth, users, server |
| **PayPal** | `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_WEBHOOK_ID` (optional), `PAYPAL_SANDBOX` (optional), `NEXT_PUBLIC_PAYPAL_PLAN_*` (subscription only) | Payments & Webhook |
| **Newsletter** | `BREVO_API_KEY` (+ `BREVO_LIST_ID`) or ConvertKit/Buttondown | Email subscription |
| **Google** | `NEXT_PUBLIC_GA_ID` | GA4 analytics |

---

## Example `.env.local` (reference only; do not commit real keys)

```bash
# Site（当前用开发域名；正式上线时改为 https://www.privacyconvert.online）
NEXT_PUBLIC_SITE_URL=https://privacyconvert-five.vercel.app

# Supabase (as needed)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# PayPal
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=
# PAYPAL_CLIENT_ID=
# PAYPAL_SECRET=
# PAYPAL_WEBHOOK_ID=
# PAYPAL_SANDBOX=true

# Newsletter (choose one)
# BREVO_API_KEY=
# BREVO_LIST_ID=
# CONVERTKIT_API_KEY=
# CONVERTKIT_FORM_ID=
# BUTTONDOWN_API_KEY=

# Google Analytics
# NEXT_PUBLIC_GA_ID=
```
