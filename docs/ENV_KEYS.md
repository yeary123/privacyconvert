# Environment Variables & Keys

Keys to configure in `.env.local` (or your hosting platform’s environment variables) for deploy or local run. If not set, the site still runs but the related features are disabled or use defaults.

---

## 1. Site basics

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site root URL (sharing, sitemap, robots, SEO) | Recommended | `https://www.privacyconvert.online` |

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
# Site
NEXT_PUBLIC_SITE_URL=https://www.privacyconvert.online

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
