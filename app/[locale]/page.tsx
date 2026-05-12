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
      translations: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

async function getLatestReports(locale: string) {
  return db.report.findMany({
    where: { isPublished: true },
    include: {
      translations: true,
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
        <QuickAccessSection locale={locale} />
        <NewsSection articles={articles} locale={locale} />
        <StatisticsSection />
        <MissionSection />
        <ReportsSection reports={reports} locale={locale} />
      </main>
      <Footer />
    </>
  );
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("home");
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dee93?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30"
          alt="Institutional Authority"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom duration-500">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Official Portal
          </div>
          <h1 className="display-lg text-white mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100 leading-[1.1]">
            {t("hero_title")}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link
              href={`/${locale}/news`}
              className="bg-accent text-white font-bold px-10 py-5 text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl"
            >
              {t("latest_updates")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-10 py-5 text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              {t("contact_commission")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickAccessSection({ locale }: { locale: string }) {
  const t = useTranslations("home.services");
  const services = [
    { title: t("visitation"), desc: t("visitation_desc"), icon: "👥" },
    { title: t("legal"), desc: t("legal_desc"), icon: "⚖️" },
    { title: t("locator"), desc: t("locator_desc"), icon: "🔍" },
    { title: t("careers"), desc: t("careers_desc"), icon: "🛡️" },
  ];

  return (
    <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant/30 shadow-2xl border border-outline-variant/30 overflow-hidden">
        {services.map((service, i) => (
          <div key={i} className="bg-white p-10 hover:bg-surface-container-low transition-colors group cursor-pointer">
            <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">
              {service.icon}
            </div>
            <h3 className="text-sm font-display font-extrabold text-primary uppercase tracking-widest mb-3">
              {service.title}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatisticsSection() {
  const t = useTranslations("home.stats");
  const stats = [
    { label: t("staff"), value: "1,200+" },
    { label: t("rehab"), value: "84%" },
    { label: t("capacity"), value: "100%" },
    { label: t("service"), value: "25+" },
  ];

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="display-sm text-accent">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  const t = useTranslations("home.mission");
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative aspect-square">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop" 
            className="w-full h-full object-cover shadow-2xl"
            alt="Leadership"
          />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent/10 -z-10" />
        </div>
        <div className="space-y-8">
          <h2 className="headline-md text-primary leading-tight">
            {t("title")}
          </h2>
          <div className="space-y-6 text-on-surface-variant leading-relaxed">
            <p>
              {t("p1")}
            </p>
            <p className="font-bold text-primary italic border-l-4 border-accent pl-6">
              "{t("quote")}"
            </p>
          </div>
          <div className="pt-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-primary-container rounded-full" />
            <div>
              <div className="font-display font-bold text-primary">{t("leadership")}</div>
              <div className="text-xs uppercase tracking-widest text-on-surface-variant">{t("leadership_sub")}</div>
            </div>
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
              const translation = 
                article.translations.find(t => t.language === locale) ||
                (locale === "har" ? article.translations.find(t => t.language === "am") : null) ||
                article.translations[0];
              if (!translation) return null;
              return (
                <article key={article.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-6 aspect-[16/10]">
                    {article.images?.[0] ? (
                      <img 
                        src={article.images[0]} 
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
              const translation = 
                report.translations.find(t => t.language === locale) ||
                (locale === "har" ? report.translations.find(t => t.language === "am") : null) ||
                report.translations[0];
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
