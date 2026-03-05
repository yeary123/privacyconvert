# 开源前检查清单 (Open Source Pre-Release Checklist)

本文档列出将本项目开源前已检查的风险点与建议。

---

## 一、已确认安全 / 已处理

### 1. 环境变量与密钥
- **`.env*` 已在 `.gitignore` 中**：`.env.local` 等不会被提交。
- **Git 历史中无 `.env` 文件**：未发现曾提交过敏感 env 文件。
- **密钥均通过 `process.env` 读取**：Supabase、PayPal、Brevo 等未在源码中硬编码。
- **已添加 `.env.example`**：仅含占位说明，无真实密钥，便于贡献者配置本地环境。

### 2. Google Analytics
- **已修复**：`components/GoogleAnalytics.tsx` 中原先硬编码的 GA 测量 ID (`G-C6ZE3ZF599`) 已改为默认空字符串；仅当设置 `NEXT_PUBLIC_GA_ID` 时才启用 GA，避免他人 clone 后把数据发到你的 GA。

---

## 二、已完成的修复（本次）

- **app/layout.tsx**：`metadataBase` 已改为使用 `process.env.NEXT_PUBLIC_SITE_URL`。
- **app/login/page.tsx**：`EMAIL_CALLBACK_BASE` 已改为使用 `process.env.NEXT_PUBLIC_SITE_URL`。
- **components/ContactEmail.tsx**：联系邮箱域名已改为 `process.env.NEXT_PUBLIC_CONTACT_DOMAIN`，fork 方可配置自己的域名。
- **LICENSE**：已添加 MIT 许可证；`package.json` 已增加 `"license": "MIT"`。
- **.env.example**：已补充 `NEXT_PUBLIC_CONTACT_DOMAIN` 说明。
- **docs/ENV_KEYS.md**、**docs/SUPABASE_EMAIL_BRANDING.md**：文档中的具体 URL 已改为通用占位符（如 `your-domain.com`、`your-preview.vercel.app`）。
- **README.md**：已改为项目说明、本地运行步骤（含 `.env.example` 与 `docs/ENV_KEYS.md` 链接）、许可证说明。
- **docs/promotion-materials.md**：已增加 Fork 说明（替换链接与品牌）。
- **docs/SUPABASE_EMAIL_BRANDING.md**：已增加 Fork 说明（品牌名与域名可替换）。

### 可选后续
- **依赖与安全**：运行 `npm audit` 修复已知漏洞；如有私有 npm 包需在 README 说明或移除。
- **敏感文件**：再次确认未提交 `.env.local` 或密钥；若历史中曾误提交，需用 `git filter-branch` 或 BFG 清理并轮换密钥。

---

## 三、风险等级小结

| 类型 | 状态 | 说明 |
|------|------|------|
| 密钥/API Key 泄露 | 已规避 | 仅存于 .env.local，未提交；代码中已去除 GA 硬编码 |
| 生产域名/联系邮箱 | 已修复 | 已改为从 env 读取；文档已使用通用占位符 |
| LICENSE | 已添加 | 已添加 MIT 许可证，package.json 已设 "license": "MIT" |
| 文档/README | 已更新 | README 已改为项目说明与运行指南；各 doc 已适合开源/Fork |

完成上述项后，即可将仓库设为公开并对外开源。

---

## 四、文档开源适用性检查（已做）

| 文档 | 结论 | 说明 |
|------|------|------|
| **README.md** | ✅ 已更新 | 已改为项目简介、运行步骤、env 说明、文档索引、MIT 许可证。 |
| **docs/ENV_KEYS.md** | ✅ 适用 | 通用占位符（your-domain.com、localhost）；无真实密钥或内部 URL。 |
| **docs/SUPABASE_EMAIL_BRANDING.md** | ✅ 适用 | 占位域名 + Fork 说明；PrivacyConvert 作为示例品牌名保留。 |
| **docs/ARCHITECTURE.md** | ✅ 适用 | 纯技术架构与目录说明，无内部/私密信息。 |
| **docs/ADD_CONVERTER.md** | ✅ 适用 | 开发者扩展指南，通用步骤与路径。 |
| **docs/DOCUMENT_CONVERSION.md** | ✅ 适用 | API 说明，无品牌或环境相关敏感内容。 |
| **docs/promotion-materials.md** | ✅ 已加说明 | 含官方站链接（privacyconvert.com）；已加「Fork 时替换为自家 URL」说明。 |
| **public/icons/README.md** | ✅ 适用 | PWA 图标说明，通用。 |
| **OPEN_SOURCE_CHECKLIST.md** | ✅ 适用 | 本清单，供维护者自检与贡献者了解已做项。 |

---

## 五、开源前最后确认（push 前执行）

- [ ] `git status` 确认无 `.env.local`、`.env`、`*.pem` 等敏感文件被 add
- [ ] `npm run build` 通过
- [ ] `npm run lint` 通过（如有）
- [ ] 确认远程仓库为公开后，再 push 含敏感历史的提交（若曾误提交过密钥，需先清理历史）
