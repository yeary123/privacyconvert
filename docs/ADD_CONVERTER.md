# 新增转换工具开发模板

新增转换工具时按以下步骤和模板开发，保证与现有转换页结构一致。

---

## 1. 页面结构（统一布局）

所有转换页使用 **`ConvertPageLayout`** 组件，包含：

- 左侧/上方：Pro 横幅 + 转换器 UI（拖拽区、进度、结果下载）
- 右侧/下方：SEO 长文 + FAQ 手风琴
- 自动输出：FAQ / HowTo / SoftwareApplication 的 JSON-LD

**两种入口：**

| 方式 | 适用 | 路由 |
|------|------|------|
| **动态页** | 大部分工具，无需单独 SEO 时 | `/convert/[slug]`，在 `TOOLS` 中注册即可 |
| **静态页** | 需要独立 SEO、自定义 FAQ/HowTo 时 | `app/convert/{slug}/page.tsx`，使用本模板 |

---

## 2. 新增工具步骤（推荐顺序）

### 2.1 在 `lib/tools.ts` 中注册

```ts
{ slug: "xxx-to-yyy", name: "XXX to YYY", description: "…", category: "image" | "audio" | "video" | "document", proOnly: false },
```

### 2.2 功能层：实现转换逻辑

- **若用 FFmpeg**：在 `lib/conversion/run.ts` 的 `handlers` 中增加对应 handler，并在 `lib/conversion/types.ts` 的 `FFMPEG_TOOL_SLUGS` 中加入该 slug。
- **若用 Canvas 图片**：在 `lib/conversion/run.ts` 中调用 `convertImageFile(file, targetMime, quality)`，并在 `lib/imageConversion.ts` 中确认支持目标 MIME（如 `image/png` | `image/jpeg` | `image/webp`）。
- **若用 Worker 等**：在 `run.ts` 的 `handlers` 中写自定义 handler。

### 2.3 在 `lib/conversion/accept.ts` 中配置 dropzone

为 `CONVERT_ACCEPT` 增加该 slug 的 MIME/扩展名，供 `GenericConverter` 使用：

```ts
"xxx-to-yyy": { "input/mime": [".ext1", ".ext2"] },
```

### 2.4 UI 路由（二选一）

- **走动态页**：无需新建文件。`ConversionUI` 会对 `hasConvertHandler(slug)` 为 true 的工具渲染 `GenericConverter`，访问 `/convert/xxx-to-yyy` 即可。
- **走静态页**：需要独立 metadata、FAQ、HowTo 时，在 `app/convert/xxx-to-yyy/` 下新建 `page.tsx`，按下方静态页模板编写。

### 2.5（可选）SEO 长文

在 `lib/convertSeoContent.ts` 的 `getConvertSeoContent(slug)` 中为该 slug 增加长文内容，动态页和静态页都会优先使用此处内容。

### 2.6（仅动态页）FAQ / HowTo

若希望该工具在动态页中显示 FAQ 或 HowTo，需在 `app/convert/[slug]/page.tsx` 中：

- 在 `FAQ_MAP` 中增加 `"xxx-to-yyy": YOUR_FAQ_ARRAY`；
- 在 `HOWTO_STEPS` 中增加 `"xxx-to-yyy": YOUR_STEPS_ARRAY`。

---

## 3. 静态页模板（`app/convert/{slug}/page.tsx`）

复制以下模板，替换 `TOOL_SLUG`、`TOOL_NAME`、`DESCRIPTION`、FAQ、HowTo 和 Converter 组件即可。

```tsx
import type { Metadata } from "next";
import { YourConverter } from "@/components/YourConverter";  // 或 GenericConverter
import { ConvertPageLayout } from "@/components/ConvertPageLayout";
import { getConvertSeoContent } from "@/lib/convertSeoContent";

const TOOL_SLUG = "xxx-to-yyy";
const TOOL_NAME = "XXX to YYY";
const DESCRIPTION = "Convert XXX to YYY in your browser. No upload 2026, privacy first.";

const TOOL = { name: TOOL_NAME, description: DESCRIPTION, slug: TOOL_SLUG };

export const metadata: Metadata = {
  title: `${TOOL_NAME} No Upload – 100% Local Browser Converter 2026`,
  description: `${DESCRIPTION}. No upload, browser local conversion. Zero privacy risk.`,
  openGraph: {
    title: `${TOOL_NAME} – No Upload 2026 | PrivacyConvert`,
    description: DESCRIPTION,
  },
};

const FAQ = [
  { q: "Is conversion done locally?", a: "Yes. …" },
  // …
];

const HOWTO_STEPS = [
  { name: "Load FFmpeg", text: "Click 'Load FFmpeg' once (~31 MB, cached)." },
  { name: "Add files", text: "Drag and drop XXX files. Free: 1 file; Pro: batch." },
  { name: "Convert", text: "Conversion runs locally. No upload." },
  { name: "Download", text: "Download each YYY. Files never leave your device." },
];

export default async function Page() {
  const seoContent = getConvertSeoContent(TOOL_SLUG);
  return (
    <ConvertPageLayout
      tool={TOOL}
      converter={<YourConverter toolSlug={TOOL_SLUG} />}
      faq={FAQ}
      faqTitle={`${TOOL_NAME} FAQ`}
      howToSteps={HOWTO_STEPS}
      seoContent={seoContent ?? undefined}
    />
  );
}
```

- **不需要 FFmpeg** 的工具：HowTo 里可去掉 “Load FFmpeg” 步骤。
- **使用通用 UI**：`converter={<GenericConverter toolSlug={TOOL_SLUG} />}`，并确保该 slug 已在 `lib/conversion/accept.ts` 和 `handlers` 中配置。

---

## 4. 自定义 Converter 组件（可选）

若该工具需要与 `GenericConverter` 不同的交互（如 HEIC、PDF）：

1. 在 `components/` 下新建 `XxxToYyyConverter.tsx`，实现拖拽、进度、调用 `convert(slug, file)` 或专用 API、结果展示。
2. 在 `components/ConversionUI.tsx` 中为该 slug 单独分支，渲染该组件而非 `GenericConverter`。

多数工具只需在 `TOOLS` + `run.ts` + `accept.ts` 中配置即可使用 `GenericConverter`，无需新建组件。

---

## 5. 参考文件

| 文件 | 作用 |
|------|------|
| `components/ConvertPageLayout.tsx` | 转换页通用布局（标题、描述、转换区、侧栏、Schema） |
| `components/ConversionUI.tsx` | 按 slug 选择具体 Converter 或 GenericConverter |
| `components/GenericConverter.tsx` | 通用转换 UI（FFmpeg/非 FFmpeg、进度、结果） |
| `app/convert/[slug]/page.tsx` | 动态转换页，使用 ConvertPageLayout + FAQ_MAP + HOWTO_STEPS |
| `app/convert/avif-to-png/page.tsx` | 静态页示例，使用 ConvertPageLayout |
| `docs/ARCHITECTURE.md` | 项目架构与功能层说明 |

新增转换按上述模式开发即可与现有 30 个工具保持一致体验和 SEO 结构。
