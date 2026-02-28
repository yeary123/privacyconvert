# 新增转换工具开发模板

新增转换工具时按以下步骤和模板开发，保证与现有转换页结构一致。

---

## 1. 页面结构（统一布局）

所有转换页使用 **`ConvertPageLayout`** 组件，包含：

- 左侧/上方：Pro 横幅 + 转换器 UI（拖拽区、进度、结果下载）
- 右侧/下方：SEO 长文 + FAQ 手风琴
- 自动输出：FAQ / HowTo / SoftwareApplication 的 JSON-LD

**入口**：所有工具统一走 `/convert/[slug]`（`app/convert/[slug]/page.tsx`）。构建时通过 `generateStaticParams` 为每个 slug 预生成静态 HTML，无需单独建页面文件。

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

### 2.4 UI 路由

无需新建页面文件。在 `TOOLS` 中注册后，`ConversionUI` 会对 `hasConvertHandler(slug)` 为 true 的工具渲染 `GenericConverter`，访问 `/convert/xxx-to-yyy` 即可；该页在构建时随 `generateStaticParams` 预生成。

### 2.5（可选）SEO 长文

在 `lib/convertSeoContent.ts` 的 `getConvertSeoContent(slug)` 中为该 slug 增加长文内容，转换页会使用此处内容。

### 2.6（可选）FAQ / HowTo

若希望该工具页显示 FAQ 或 HowTo，在 `app/convert/[slug]/page.tsx` 中：

- 在 `FAQ_MAP` 中增加 `"xxx-to-yyy": YOUR_FAQ_ARRAY`；
- 在 `HOWTO_STEPS` 中增加 `"xxx-to-yyy": YOUR_STEPS_ARRAY`。

---

## 3. 转换页逻辑说明

所有转换页由 `app/convert/[slug]/page.tsx` 统一渲染：从 `TOOLS` 取当前 slug 的 name/description/category，从 `FAQ_MAP`、`HOWTO_STEPS` 取可选 FAQ/HowTo，从 `getConvertSeoContent(slug)` 取 SEO 长文；metadata 由 `getConvertMetadata(tool.name)` 生成。无需再为单个工具新建 `app/convert/{slug}/page.tsx`。新增工具时只需在 `TOOLS` 中注册，并在需要时在 `FAQ_MAP`、`HOWTO_STEPS`、`getConvertSeoContent` 中补充内容。示例（FAQ_MAP / HOWTO_STEPS）：

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
| `app/convert/[slug]/page.tsx` | 所有转换页入口；ConvertPageLayout + FAQ_MAP + HOWTO_STEPS；构建时按 TOOLS 预生成静态页 |
| `docs/ARCHITECTURE.md` | 项目架构与功能层说明 |

新增转换只需在 `lib/tools.ts` 的 TOOLS 中增加一项并实现对应 handler/UI，即可与现有工具保持一致体验和 SEO 结构。
