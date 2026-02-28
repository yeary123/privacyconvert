import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import {
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildFAQSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
} from "@/lib/schema";
import { HOW_IT_WORKS_HEADING, HOW_IT_WORKS_SHORT } from "@/components/HowItWorksPrivacy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ConvertPageLayoutTool = {
  name: string;
  description: string;
  slug: string;
  /** For breadcrumb and related tools; e.g. "image", "audio" */
  category?: string;
};

export type ConvertPageLayoutProps = {
  /** 工具信息，来自 TOOLS 或静态页常量 */
  tool: ConvertPageLayoutTool;
  /** 转换器 UI（如 <ConversionUI slug={slug} /> 或具体 Converter） */
  converter: React.ReactNode;
  /** FAQ 列表，可选；有则输出 FAQ Schema + 手风琴 */
  faq?: { q: string; a: string }[];
  /** FAQ 区块标题，默认 "{tool.name} FAQ" */
  faqTitle?: string;
  /** HowTo 步骤，可选；有则输出 HowTo Schema */
  howToSteps?: { name: string; text: string }[];
  /** 正文 SEO 长文，可选；无则仅显示 FAQ（若有） */
  seoContent?: string;
  /** 同分类的其它工具，用于底部「Related tools」区块与内部链接 */
  relatedTools?: { slug: string; name: string }[];
};

const CATEGORY_LABELS: Record<string, string> = {
  image: "Image",
  audio: "Audio",
  video: "Video",
  document: "Document",
  units: "Units",
  data: "Data",
  size: "Size",
  number: "Number",
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.privacyconvert.online";

/**
 * 转换工具页通用布局：左侧/上方为转换区 + Pro 横幅，右侧/下方为教程 + FAQ。
 * 自动输出 FAQ / HowTo / SoftwareApplication 的 JSON-LD。
 * 新增转换工具时统一使用此布局，保证页面结构一致。
 */
export function ConvertPageLayout({
  tool,
  converter,
  faq,
  faqTitle,
  howToSteps,
  seoContent,
  relatedTools = [],
}: ConvertPageLayoutProps) {
  const faqSchema = faq?.length ? buildFAQSchema(faq) : null;
  const howToSchema =
    howToSteps?.length ?
    buildHowToSchema({
      name: `${tool.name} - No Upload, 100% Local`,
      description: tool.description,
      steps: howToSteps,
    })
    : null;
  const applicationCategory =
    tool.category === "image" || tool.category === "audio" || tool.category === "video"
      ? "MultimediaApplication"
      : "UtilitiesApplication";
  const appSchema = buildSoftwareApplicationSchema({
    name: `${tool.name} - No Upload 2026`,
    description: `${tool.description}. 100% local browser converter. No upload, privacy first.`,
    url: `${BASE_URL}/convert/${tool.slug}`,
    applicationCategory,
    operatingSystem: "Any (Web Browser)",
    browserRequirements: "Requires HTML5 and WebAssembly support",
    offers: { price: "0", priceCurrency: "USD" },
    featureList: [
      "Local conversion (FFmpeg.wasm or client-side library)",
      "No file upload required",
      "Batch processing (Pro)",
      "Works in browser; no server upload",
    ],
  });

  const articleSchema =
    seoContent?.trim() ?
    buildArticleSchema({
      name: `${tool.name} – No Upload, 100% Local Tutorial 2026`,
      description: tool.description,
      url: `${BASE_URL}/convert/${tool.slug}`,
      articleBody: seoContent.trim(),
    })
    : null;

  const breadcrumbItems = [
    { name: "Home", url: BASE_URL },
    { name: "Tools", url: `${BASE_URL}/tools` },
    ...(tool.category ?
      [{ name: CATEGORY_LABELS[tool.category] ?? tool.category, url: `${BASE_URL}/tools?category=${tool.category}` }]
    : []),
    { name: tool.name, url: `${BASE_URL}/convert/${tool.slug}` },
  ];
  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbItems);

  const sectionTitle = (faqTitle ?? `${tool.name} FAQ`).trim();

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container py-8">
        <div className="mb-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {" · "}
            <Link href="/tools" className="hover:underline">
              Tools
            </Link>
            {tool.category && (
              <>
                {" · "}
                <Link href={`/tools?category=${tool.category}`} className="hover:underline">
                  {CATEGORY_LABELS[tool.category] ?? tool.category}
                </Link>
              </>
            )}
            {" · "}
            <span className="text-foreground">{tool.name}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px),1fr]">
          <div className="xl:sticky xl:top-24 xl:self-start order-1 lg:order-1">
            <ProUnlockBanner />
            {converter}
          </div>
          <aside className="min-w-0 order-2 lg:order-2">
            {seoContent && (
              <div className="space-y-6 whitespace-pre-wrap text-sm text-muted-foreground">
                {seoContent}
              </div>
            )}
            {faq && faq.length > 0 && (
              <div className={seoContent ? "mt-8" : ""}>
                <h3 className="mb-4 font-semibold">{sectionTitle}</h3>
                <Accordion type="single" collapsible>
                  {faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${tool.slug}-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            <div className="mt-6">
              <h3 className="mb-2 font-semibold text-sm">{HOW_IT_WORKS_HEADING}</h3>
              {HOW_IT_WORKS_SHORT}
            </div>
            <div className="mt-6">
              <h3 className="mb-2 font-semibold text-sm">PrivacyConvert vs cloud converters</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[32%] text-muted-foreground"> </TableHead>
                    <TableHead className="text-muted-foreground">PrivacyConvert (Local)</TableHead>
                    <TableHead className="text-muted-foreground">Cloud converters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Privacy</TableCell>
                    <TableCell>File never leaves your device</TableCell>
                    <TableCell>File uploaded to their servers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Data location</TableCell>
                    <TableCell>100% in your browser</TableCell>
                    <TableCell>Processed on remote servers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Speed</TableCell>
                    <TableCell>Depends on your device; no upload wait</TableCell>
                    <TableCell>Upload + server processing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Security</TableCell>
                    <TableCell>No server copy; you control the file</TableCell>
                    <TableCell>You rely on their storage and policies</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {relatedTools.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-semibold">Related tools</h3>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {relatedTools.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/convert/${t.slug}`}
                        className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!seoContent && !faq?.length && relatedTools.length === 0 && (
              <p className="text-muted-foreground">
                This tool is available. <Link href="/tools" className="underline">Browse all tools</Link>.
              </p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
