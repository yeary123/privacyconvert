# 环境变量与 Key 清单

部署或本地运行时需要在 `.env.local`（或托管平台的环境变量）中配置的 key，按平台整理如下。未配置时，站点仍可运行，但对应功能不可用或使用默认值。

---

## 一、站点基础

| 变量名 | 说明 | 必填 | 默认 |
|--------|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站点根 URL（分享链接、sitemap、robots、SEO） | 建议 | `https://www.privacyconvert.online` |

---

## 二、Supabase（登录 / 用户 / 服务端）

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 使用登录/同步时必填 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名公钥 | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key（服务端用，如 sync-profile） | 使用服务端能力时必填 |

---

## 三、PayPal（支付 / 订阅）

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Client ID（前端 SDK） | 启用 PayPal 时必填 |
| `PAYPAL_CLIENT_ID` | 同上，服务端用（可与上面一致） | 服务端调用时必填 |
| `PAYPAL_SECRET` | PayPal Secret | 服务端调用时必填 |
| `PAYPAL_SANDBOX` | `"true"` = 沙箱环境 | 可选 |
| `PAYPAL_WEBHOOK_ID` | PayPal Webhook ID（支付回调校验） | 使用 Webhook 时必填 |
| `NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY` | 月付订阅 Plan ID | 仅订阅月付时需要 |
| `NEXT_PUBLIC_PAYPAL_PLAN_YEARLY` | 年付订阅 Plan ID | 仅订阅年付时需要 |

当前定价页为「Lifetime Pro」一次性购买，主要需要：`NEXT_PUBLIC_PAYPAL_CLIENT_ID`、`PAYPAL_CLIENT_ID`、`PAYPAL_SECRET`；若配置了 Webhook 则还需 `PAYPAL_WEBHOOK_ID`。

---

## 四、邮件订阅（Newsletter）

任选其一即可。

**方案 A：Brevo**（免费约 10 万联系人、300 封/天）

| 变量名 | 说明 |
|--------|------|
| `BREVO_API_KEY` | Brevo API Key（SMTP & API → API Keys） |
| `BREVO_LIST_ID` | 订阅列表 ID（Contacts → Lists，可选，建议建一个 Newsletter 列表后填） |

**方案 B：ConvertKit**

| 变量名 | 说明 |
|--------|------|
| `CONVERTKIT_API_KEY` | ConvertKit API Key |
| `CONVERTKIT_FORM_ID` | 订阅表单 ID |

**方案 C：Buttondown**

| 变量名 | 说明 |
|--------|------|
| `BUTTONDOWN_API_KEY` | Buttondown API Token |

都不配置时，订阅接口仍返回成功（占位行为），便于测试。

---

## 五、Google Analytics（统计）

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `NEXT_PUBLIC_GA_ID` | GA4 测量 ID（如 `G-XXXXXXXXXX`） | 可选，不设则不加载 GA |

---

## 按平台汇总（你需要处理的）

| 平台 | 变量 | 用途 |
|------|------|------|
| **站点** | `NEXT_PUBLIC_SITE_URL` | 站点 URL、分享、SEO |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY` | 登录、用户、服务端 |
| **PayPal** | `NEXT_PUBLIC_PAYPAL_CLIENT_ID`、`PAYPAL_CLIENT_ID`、`PAYPAL_SECRET`、`PAYPAL_WEBHOOK_ID`（可选）、`PAYPAL_SANDBOX`（可选）、`NEXT_PUBLIC_PAYPAL_PLAN_*`（仅订阅需要） | 支付与 Webhook |
| **Newsletter** | `BREVO_API_KEY`（+ `BREVO_LIST_ID`）或 ConvertKit/Buttondown | 邮件订阅 |
| **Google** | `NEXT_PUBLIC_GA_ID` | GA4 统计 |

---

## 示例 `.env.local`（仅作参考，勿提交真实 key）

```bash
# 站点
NEXT_PUBLIC_SITE_URL=https://www.privacyconvert.online

# Supabase（按需）
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# PayPal
# NEXT_PUBLIC_PAYPAL_CLIENT_ID=
# PAYPAL_CLIENT_ID=
# PAYPAL_SECRET=
# PAYPAL_WEBHOOK_ID=
# PAYPAL_SANDBOX=true

# Newsletter（任选其一）
# BREVO_API_KEY=
# BREVO_LIST_ID=
# CONVERTKIT_API_KEY=
# CONVERTKIT_FORM_ID=
# BUTTONDOWN_API_KEY=

# Google Analytics
# NEXT_PUBLIC_GA_ID=
```
