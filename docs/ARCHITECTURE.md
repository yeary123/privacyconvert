# PrivacyConvert 项目架构说明

本文档描述项目的整体架构、目录职责与数据流，便于维护与扩展。

---

## 1. 架构概览

项目采用 **分层架构**，将「转换能力」与「用户界面」分离：

| 层次 | 职责 | 位置 |
|------|------|------|
| **功能层（Function Layer）** | 所有格式转换逻辑：单文件入、单文件出，不包含 UI | `lib/conversion/`、`lib/ffmpeg.ts`、`lib/imageConversion.ts`、`lib/heicConversion.ts`、`lib/wavMp3WorkerCode.ts`、`lib/pdfConversion.ts`、`lib/documentConversion.ts` |
| **用户层（User Layer）** | 页面、上传/拖拽、进度展示、结果下载；只调用功能层 API，不实现转换 | `app/`、`components/*Converter*.tsx`、`components/ConversionUI.tsx` |

- **功能层**：对外统一入口为 `convert(slug, file, options)`（及 HEIC 的 `convertHeicToJpeg`），内部按 `slug` 分发到不同实现（Canvas、FFmpeg WASM、Worker 等）。
- **用户层**：根据路由或 `slug` 渲染对应转换器组件，组件负责交互与调用 `convert()` / `convertHeicToJpeg()`，不包含具体编解码或命令行逻辑。

---

## 2. 目录结构

```
privacyconvert/
├── app/                    # Next.js App Router（用户层：路由与页面）
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── convert/            # 转换工具页
│   │   ├── [slug]/page.tsx # 动态 slug 页（未知 slug 时 404）
│   │   ├── avif-to-png/    # 各工具静态路由（SEO/预生成）
│   │   ├── heif-to-jpg/
│   │   ├── wav-to-mp3/
│   │   ├── webp-to-png/
│   │   ├── mp4-to-webm/
│   │   ├── png-to-jpeg/
│   │   ├── ogg-to-mp3/
│   │   ├── gif-to-mp4/
│   │   └── pdf-to-images/
│   ├── tools/              # 工具列表页
│   ├── pricing/            # 定价页
│   ├── blog/                # 博客
│   ├── login/, profile/, history/, auth/
│   └── api/                 # API 路由（PayPal、Newsletter、Supabase 等）
├── components/             # React 组件（用户层：UI 与流程）
│   ├── ConversionUI.tsx    # 按 slug 选择具体转换器组件
│   ├── *Converter.tsx      # 各工具 UI（拖拽、进度、结果、下载）
│   ├── ConversionResult.tsx # 结果列表与下载
│   ├── ToolCard.tsx, Navbar.tsx, Footer.tsx
│   ├── ProUnlockBanner.tsx, PayPalButtons.tsx, …
│   └── ui/                  # 通用 UI 组件
├── lib/                    # 核心逻辑（功能层 + 通用库）
│   ├── conversion/         # 转换服务（功能层入口）
│   │   ├── index.ts        # 对外导出 convert, loadFFmpeg, needsFFmpeg, HEIC 等
│   │   ├── types.ts        # ConversionOptions, ConversionResult, needsFFmpeg
│   │   └── run.ts          # 各 slug 的转换实现（registry + handlers）
│   ├── ffmpeg.ts           # FFmpeg WASM 加载与单例
│   ├── imageConversion.ts  # Canvas 图片转换（AVIF/WebP/PNG→JPEG）
│   ├── heicConversion.ts    # HEIC→JPEG（heic2any）
│   ├── wavMp3WorkerCode.ts  # WAV→MP3 Worker 内联代码（lamejs）
│   ├── pdfConversion.ts    # PDF↔图片（pdfjs-dist、jspdf）
│   ├── documentConversion.ts # HTML→PDF、PDF 合并/拆分、DOCX→HTML、生成 DOCX
│   ├── tools.ts            # TOOLS 列表与 ToolSlug 类型
│   ├── schema.ts           # SEO/结构化数据
│   ├── convertSeoContent.ts
│   ├── supabase.ts, supabase-admin.ts
│   ├── blog.ts, blog-utils.ts
│   ├── pro.ts, utils.ts
│   └── …
├── store/                  # 客户端状态（Zustand）
│   ├── useAuthStore.ts     # 登录、Pro 状态
│   └── useProStore.ts      # Pro 功能（历史、受保护计数等）
└── docs/                   # 文档
    ├── ARCHITECTURE.md     # 本文档
    ├── DOCUMENT_CONVERSION.md # 文档转换 API（HTML/PDF/DOCX）
    └── ENV_KEYS.md         # 环境变量说明
```

---

## 3. 功能层（lib/conversion）

### 3.1 职责

- 提供 **唯一转换入口**：`convert(slug, file, options?)`，返回 `{ blob, suggestedName }`。
- 对需要 FFmpeg 的工具，提供 `loadFFmpeg(onProgress?)`、`getFFmpeg()`；UI 通过 `needsFFmpeg(slug)` 在用户点击开始转换时按需加载，并以 loading 状态展示。
- HEIC 仍通过 `convertHeicToJpeg()` 使用（返回 `{ name, dataUrl }[]`），由 `lib/conversion` 从 `lib/heicConversion` 再导出，保持功能层入口统一。

### 3.2 主要 API

| API | 说明 |
|-----|------|
| `convert(slug, file, options?)` | 单文件转换，返回 `Promise<{ blob, suggestedName }>`；无对应 handler 时抛错。 |
| `loadFFmpeg(onProgress?)` | 加载 FFmpeg WASM（单例），可选进度回调。 |
| `getFFmpeg()` | 获取已加载的 FFmpeg 实例，未加载时为 `null`。 |
| `needsFFmpeg(slug)` | 该工具是否依赖 FFmpeg（ogg-to-mp3, mp4-to-webm, gif-to-mp4）。 |
| `convertHeicToJpeg(blob, baseName, quality?)` | HEIC→JPEG，返回 `Promise<{ name, dataUrl }[]>`。 |
| `hasConvertHandler(slug)` | 是否有 blob 型转换实现（不含 HEIC/PDF）。 |

### 3.3 实现分布（run.ts）

- **avif-to-png / webp-to-png / png-to-jpeg**：`lib/imageConversion.convertImageFile()`（Canvas）。
- **wav-to-mp3**：Worker + `lib/wavMp3WorkerCode.ts`（lamejs）。
- **ogg-to-mp3 / mp4-to-webm / gif-to-mp4**：`lib/ffmpeg` + 对应 FFmpeg 命令；虚拟文件名带随机 id，避免批量时冲突。
- **heif-to-jpg**：不经过 `convert()`，由组件直接调用 `convertHeicToJpeg()`（同上，由 conversion 再导出）。
- **pdf-to-images**：当前仅占位（Pro 功能），无 handler。

---

## 4. 用户层

### 4.1 路由与页面

- **工具列表**：`/tools` 使用 `lib/tools.TOOLS` 渲染卡片，链接到 `/convert/{slug}`。
- **转换页**：  
  - 静态路由：`/convert/avif-to-png`、`/convert/wav-to-mp3` 等（SEO、预生成）。  
  - 动态路由：`/convert/[slug]/page.tsx`，根据 `slug` 渲染同一套布局，内容区为 `<ConversionUI slug={slug} />`；若 `slug` 不在 `TOOLS` 中则 404。

### 4.2 组件分工

- **ConversionUI**：根据 `slug` 渲染对应 `*Converter` 组件（如 `WavToMp3Converter`、`Mp4ToWebmConverter`），不包含任何转换逻辑。
- **各 *Converter 组件**：  
  - 进入页面即展示**直接可转换状态**（拖拽区/选文件），不区分是否依赖 FFmpeg。  
  - 文件选择（拖拽/点击）、批量数量限制（Free/Pro）。  
  - 如需 FFmpeg：在用户**点击开始转换**（选文件并触发转换）时再加载，加载过程以 **loading 状态**展示（如「Loading converter… X%」），加载完成后自动进入转换进度。  
  - 调用 `convert(slug, file, { onProgress })` 或 `convertHeicToJpeg()`，展示进度与结果。  
  - 使用 `ConversionResult` 展示结果列表与下载。  
- **CanvasImageConverter**：被 AvifToPng、WebpToPng、PngToJpeg 复用，仅通过 config（含 `toolSlug`）调用 `convert(toolSlug, file)`，不包含格式逻辑。

### 4.3 状态

- **useAuthStore**：登录态、是否 Pro。
- **useProStore**：Pro 相关（如历史记录、受保护计数等）。

---

## 5. 数据流（单次转换）

1. 用户打开 `/convert/{slug}` → 服务端/静态页渲染 → 客户端挂载 `<ConversionUI slug={slug} />`。
2. ConversionUI 根据 `slug` 渲染对应 Converter 组件。
3. 用户选择/拖入文件并触发转换（若需 FFmpeg 则此时加载并显示 loading，再执行转换）。
4. 组件对每个文件调用 `convert(slug, file, { onProgress })`（或 HEIC 调用 `convertHeicToJpeg()`）。
5. 功能层在 `run.ts` 中按 `slug` 执行对应 handler，返回 `{ blob, suggestedName }`（或 HEIC 的 dataUrl 列表）。
6. 组件将结果写入 state，用 `ConversionResult` 展示并触发下载。

整条链路中，**格式与编解码细节只存在于功能层**，用户层只传 `slug` 和 `File`，不依赖具体实现。

---

## 6. 如何新增一个转换工具

1. **在 `lib/tools.ts` 的 `TOOLS` 中增加一项**（slug、name、description、category、proOnly）。
2. **若需 FFmpeg**：在 `lib/conversion/types.ts` 的 `FFMPEG_TOOL_SLUGS` 中加入该 slug。
3. **在功能层实现 handler**：在 `lib/conversion/run.ts` 的 `handlers` 中为 slug 实现 `ConversionHandler`（接收 `file`、`options`，返回 `{ blob, suggestedName }`）；若用 FFmpeg，在 `withFFmpeg` 内写命令并保证虚拟文件名唯一（如带随机 id）。
4. **在用户层挂接 UI**：  
   - 在 `ConversionUI.tsx` 的 `switch(slug)` 中增加 `case "your-slug": return <YourConverter toolSlug={slug} />`。  
   - 新增 `YourConverter.tsx`（或复用 `CanvasImageConverter`/现有组件），只做：选文件、调 `convert("your-slug", file, options)`、展示进度与结果。  
5. **（可选）** 为 SEO 增加静态路由 `app/convert/your-slug/page.tsx`，或依赖 `[slug]` 动态页；若需单独 FAQ/SEO 内容，在 `app/convert/[slug]/page.tsx` 的静态内容或 schema 中补充。

---

## 7. 外部依赖与运行环境

- **转换能力**：  
  - **FFmpeg WASM**：`@ffmpeg/ffmpeg`、`@ffmpeg/util`，用于 OGG/MP4/GIF 及部分图片（如 AVIF 解码依赖浏览器或 FFmpeg）。  
  - **Canvas**：`lib/imageConversion` 使用浏览器 Canvas API（AVIF/WebP/PNG→PNG 或 JPEG）。  
  - **HEIC**：`heic2any`，动态 import，仅浏览器端。  
  - **WAV→MP3**：`lamejs`（通过 Worker 内联脚本加载）。  
  - **PDF**：`lib/pdfConversion` 使用 `pdfjs-dist`（PDF→图）、`jspdf`（图→PDF）；`lib/documentConversion` 使用 `html2canvas`+jspdf（HTML→PDF）、`pdf-lib`（PDF 合并/拆分）、`mammoth`（DOCX→HTML）、`docx`（生成 .docx）。  
- **框架**：Next.js 16（App Router）、React 19。  
- **状态**：Zustand（`store/`）。  
- **后端/第三方**：Supabase（认证/用户）、PayPal（支付）、Newsletter（Brevo/ConvertKit/Buttondown）等，见 `docs/ENV_KEYS.md`。

---

## 8. 文档与配置

- **环境变量**：`docs/ENV_KEYS.md`。  
- **架构与扩展**：本文档 `docs/ARCHITECTURE.md`。
