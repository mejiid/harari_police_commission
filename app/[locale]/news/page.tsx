import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Calendar, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

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

  const featuredArticle = page === 1 ? articles[0] : null;
  const remainingArticles = page === 1 ? articles.slice(1) : articles;

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Header />
      
      <main className="flex-1 pb-24">
        {/* Institutional Header */}
        <div className="bg-primary pt-32 pb-20 px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(white,transparent)]" />
           <div className="max-w-7xl mx-auto relative">
              <div className="flex items-center gap-3 text-accent mb-4">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Official Information Repository</span>
              </div>
              <h1 className="display-lg text-white max-w-2xl leading-[1.1]">
                News & Institutional Archive
              </h1>
              <p className="text-white/60 text-lg mt-6 max-w-xl font-medium">
                Access authenticated reports, official statements, and updates from the Harari Prison Police Commission.
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="group relative bg-white border border-outline-variant/30 shadow-2xl overflow-hidden mb-20 flex flex-col lg:flex-row min-h-[500px]">
              <div className="lg:w-3/5 relative overflow-hidden">
                {featuredArticle.images?.[0] ? (
                  <img
                    src={featuredArticle.images[0]}
                    alt={featuredArticle.translations[0]?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20">
                    <BookOpen className="w-24 h-24" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              </div>
              
              <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
                  <div className="w-8 h-[1px] bg-accent" />
                  Featured Publication
                </div>
                <h2 className="display-sm text-primary group-hover:text-accent transition-colors duration-300">
                  {featuredArticle.translations.find(t => t.language === locale)?.title || 
                   (locale === "har" ? featuredArticle.translations.find(t => t.language === "am")?.title : null) ||
                   featuredArticle.translations[0]?.title}
                </h2>
                <p className="text-on-surface-variant text-base mt-6 line-clamp-4 leading-relaxed">
                  {featuredArticle.translations.find(t => t.language === locale)?.summary || 
                   (locale === "har" ? featuredArticle.translations.find(t => t.language === "am")?.summary : null) ||
                   featuredArticle.translations[0]?.summary}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 border-t border-outline-variant/30 pt-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {featuredArticle.publishedAt?.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/news/${featuredArticle.slug}`}
                    className="group/btn inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-all"
                  >
                    Examine Full Report
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Archive Grid */}
          <div className="space-y-12">
            <div className="flex items-end justify-between border-b border-outline-variant/30 pb-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Latest Archive Updates</h3>
                <h4 className="display-xs text-primary mt-2 font-display">Recent Publications</h4>
              </div>
            </div>

            {remainingArticles.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-outline-variant/20 rounded-xl">
                 <p className="text-on-surface-variant/40 italic font-medium">No additional records found in this section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {remainingArticles.map((article) => {
                  const translation = 
                    article.translations.find(t => t.language === locale) || 
                    (locale === "har" ? article.translations.find(t => t.language === "am") : null) ||
                    article.translations[0];
                  if (!translation) return null;
                  return (
                    <Link
                      key={article.id}
                      href={`/${locale}/news/${article.slug}`}
                      className="group flex flex-col bg-white border border-outline-variant/30 hover:border-accent hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {article.images?.[0] ? (
                          <img
                            src={article.images[0]}
                            alt={translation.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/10">
                            <BookOpen className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-6 left-6">
                           <div className="bg-white/90 backdrop-blur-sm px-4 py-2 border border-outline-variant/30">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                                {article.publishedAt?.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                              </span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="p-8 flex-1 flex flex-col">
                        <h2 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                          {translation.title}
                        </h2>
                        <p className="text-sm text-on-surface-variant mt-4 line-clamp-3 leading-relaxed">
                          {translation.summary}
                        </p>
                        <div className="mt-auto pt-8 flex items-center justify-between border-t border-outline-variant/10">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Document No. {article.id.slice(-4).toUpperCase()}</span>
                           <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4" />
                           </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-20">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/${locale}/news?page=${p}`}
                    className={`w-12 h-12 flex items-center justify-center text-[10px] font-bold transition-all border ${
                      p === page
                        ? "bg-primary text-white border-primary shadow-xl"
                        : "bg-white text-primary border-outline-variant/30 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {p.toString().padStart(2, '0')}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
