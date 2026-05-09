import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

async function getArticles(locale: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const [articles, total] = await Promise.all([
    db.article.findMany({
      where: { isPublished: true },
      include: {
        translations: { where: { language: locale as "en" | "am" | "har" | "orm" } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.article.count({ where: { isPublished: true } }),
  ]);
  return { articles, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const { articles, totalPages } = await getArticles(locale, page);

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader locale={locale} />
        <ArticleGrid articles={articles} locale={locale} page={page} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}

function PageHeader({ locale }: { locale: string }) {
  const t = useTranslations("news");
  return (
    <section className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
    </section>
  );
}

function ArticleGrid({
  articles,
  locale,
  page,
  totalPages,
}: {
  articles: Awaited<ReturnType<typeof getArticles>>["articles"];
  locale: string;
  page: number;
  totalPages: number;
}) {
  const t = useTranslations("news");

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {articles.length === 0 ? (
          <p className="text-text-muted">No news articles available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {articles.map((article) => {
                const translation = article.translations[0];
                if (!translation) return null;
                return (
                  <article
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={translation.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-5">
                      <p className="text-xs text-text-muted mb-2">
                        {article.publishedAt?.toLocaleDateString(locale)}
                      </p>
                      <h2 className="font-semibold text-primary mb-2 line-clamp-2">
                        {translation.title}
                      </h2>
                      <p className="text-sm text-text-muted line-clamp-3 mb-4">
                        {translation.summary}
                      </p>
                      <Link
                        href={`/${locale}/news/${article.slug}`}
                        className="text-accent text-sm font-medium hover:underline"
                      >
                        {t("read_more")} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/${locale}/news?page=${p}`}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-text hover:bg-surface"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
