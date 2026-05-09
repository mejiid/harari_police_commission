import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale);
  if (!article) return { title: "Not Found" };
  const translation = article.translations[0];
  return { title: translation?.title ?? "Article" };
}

async function getArticle(slug: string, locale: string) {
  return db.article.findUnique({
    where: { slug, isPublished: true },
    include: {
      translations: { where: { language: locale as "en" | "am" | "har" | "orm" } },
      createdBy: { select: { name: true } },
    },
  });
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getArticle(slug, locale);

  if (!article) notFound();

  const translation = article.translations[0];
  if (!translation) notFound();

  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          {/* Back link */}
          <Link
            href={`/${locale}/news`}
            className="text-accent text-sm font-medium hover:underline mb-6 inline-block"
          >
            ← {t("title")}
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {translation.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {article.createdBy && (
                <span>{article.createdBy.name}</span>
              )}
            </div>
          </header>

          {/* Featured image */}
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={translation.title}
              className="w-full rounded-lg mb-8 object-cover max-h-96"
            />
          )}

          {/* Summary */}
          <p className="text-lg text-text-muted mb-6 font-medium border-l-4 border-accent pl-4">
            {translation.summary}
          </p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-text"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
