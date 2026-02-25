# 文档转换 API 说明

除 `lib/pdfConversion.ts` 的 PDF↔图片外，项目提供以下文档转换能力（均在 `lib/documentConversion.ts` 中，按需动态加载）。

## 1. HTML → PDF

- **函数**：`convertHtmlToPdf(element, options?)`
- **依赖**：html2canvas、jspdf
- **说明**：将页面上的一个 DOM 元素渲染为单页 PDF。
- **参数**：`element: HTMLElement`；`options?: { filename?: string; scale?: number }`（scale 默认 2）
- **返回**：`Promise<Blob>`

```ts
import { convertHtmlToPdf } from "@/lib/documentConversion";
const blob = await convertHtmlToPdf(document.getElementById("content")!);
```

## 2. PDF 合并

- **函数**：`mergePdfs(files: File[])`
- **依赖**：pdf-lib
- **说明**：将多份 PDF 按顺序合并为一份。
- **返回**：`Promise<Blob>`

## 3. PDF 拆分

- **函数**：`splitPdfToPdfs(file: File)`
- **依赖**：pdf-lib
- **说明**：将一份 PDF 按页拆成多个单页 PDF 文件。
- **返回**：`Promise<SplitPdfResult>`，即 `{ name: string; blob: Blob }[]`

## 4. DOCX → HTML

- **函数**：`convertDocxToHtml(file: File)`
- **依赖**：mammoth
- **说明**：将 .docx 转为 HTML 字符串，可用于展示或再导出。
- **返回**：`Promise<DocxToHtmlResult>`，即 `{ html: string; messages: Array<{ type: string; message: string }> }`

## 5. 生成 .docx

- **函数**：`generateSimpleDocx(title: string, paragraphs: string[])`
- **依赖**：docx
- **说明**：根据标题和段落文本生成简单 .docx 并返回 Blob。复杂排版请直接使用 `docx` 包构建 Document 后 `Packer.toBlob(doc)`。
- **返回**：`Promise<Blob>`

---

以上 API 均在浏览器端运行，库通过 dynamic import 在首次使用时加载，无需用户单独下载（与 FFmpeg WASM 不同）。
