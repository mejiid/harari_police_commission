import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("hero_title") };
}

async function getLatestArticles(locale: string) {
  return db.article.findMany({
    where: { isPublished: true },
    include: {
      translations: { where: { language: locale as "en" | "am" | "har" | "orm" } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

async function getLatestReports(locale: string) {
  return db.report.findMany({
    where: { isPublished: true },
    include: {
      translations: { where: { language: locale as "en" | "am" | "har" | "orm" } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const [articles, reports] = await Promise.all([
    getLatestArticles(locale),
    getLatestReports(locale),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection locale={locale} />
        <NewsSection articles={articles} locale={locale} />
        <ReportsSection reports={reports} locale={locale} />
      </main>
      <Footer />
    </>
  );
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-primary">
      {/* Editorial Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,var(--color-primary-container)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,var(--color-primary-container)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 editorial-grid py-20">
        <div className="editorial-content">
          <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom duration-500">
            Institutional Transparency
          </div>
          <h1 className="display-lg text-white mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            {t("hero_title")}
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link
              href={`/${locale}/news`}
              className="bg-white text-primary font-bold px-8 py-4 text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl"
            >
              {t("latest_news")}
            </Link>
            <Link
              href={`/${locale}/reports`}
              className="border border-white/20 text-white font-bold px-8 py-4 text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              {t("latest_reports")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSection({
  articles,
  locale,
}: {
  articles: Awaited<ReturnType<typeof getLatestArticles>>;
  locale: string;
}) {
  const t = useTranslations("home");
  const tNews = useTranslations("news");

  return (
    <section className="py-32 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="headline-sm text-primary uppercase tracking-[0.2em] mb-4">
              {t("latest_news")}
            </h2>
            <div className="h-1 w-20 bg-accent" />
          </div>
          <Link href={`/${locale}/news`} className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            {t("view_all")} <span className="text-accent">→</span>
          </Link>
        </div>
        
        {articles.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center text-on-surface-variant">
            No news available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.map((article) => {
              const translation = article.translations[0];
              if (!translation) return null;
              return (
                <article key={article.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-6 aspect-[16/10]">
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={translation.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-container flex items-center justify-center text-white/20 font-display font-bold">
                        HPP
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                      {article.publishedAt?.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                      {translation.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {translation.summary}
                    </p>
                    <Link
                      href={`/${locale}/news/${article.slug}`}
                      className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors pt-2"
                    >
                      {tNews("read_more")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ReportsSection({
  reports,
  locale,
}: {
  reports: Awaited<ReturnType<typeof getLatestReports>>;
  locale: string;
}) {
  const t = useTranslations("home");
  const tReports = useTranslations("reports");

  return (
    <section className="py-32 px-4 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="headline-sm text-primary uppercase tracking-[0.2em] mb-4">
              {t("latest_reports")}
            </h2>
            <div className="h-1 w-20 bg-accent" />
          </div>
          <Link href={`/${locale}/reports`} className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            {t("view_all")} <span className="text-accent">→</span>
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant italic">
            No reports available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => {
              const translation = report.translations[0];
              if (!translation) return null;
              return (
                <div key={report.id} className="bg-white p-8 shadow-sm hover:shadow-xl transition-all border-l-4 border-primary group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary-container/5 flex items-center justify-center text-primary font-bold text-xs">
                      DOC
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                      Official Record
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-primary mb-3 line-clamp-2 leading-snug">
                    {translation.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-8 leading-relaxed">
                    {translation.description}
                  </p>
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors"
                  >
                    <span>{tReports("download")}</span>
                    <span className="w-8 h-px bg-current opacity-30" />
                    <span className="text-xs">↓</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
