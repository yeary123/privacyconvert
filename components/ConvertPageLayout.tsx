import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProUnlockBanner } from "@/components/ProUnlockBanner";
import { buildArticleSchema, buildFAQSchema, buildHowToSchema, buildSoftwareApplicationSchema } from "@/lib/schema";

export type ConvertPageLayoutTool = {
  name: string;
  description: string;
  slug: string;
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
  const appSchema = buildSoftwareApplicationSchema({
    name: `${tool.name} - No Upload 2026`,
    description: `${tool.description}. 100% local browser converter. No upload, privacy first.`,
    url: `${BASE_URL}/convert/${tool.slug}`,
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
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/tools" className="text-sm text-muted-foreground hover:underline">
            ← All tools
          </Link>
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
            {!seoContent && !faq?.length && (
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
