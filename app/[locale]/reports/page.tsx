import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reports" });
  return { title: t("title") };
}

async function getReports(locale: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const [reports, total] = await Promise.all([
    db.report.findMany({
      where: { isPublished: true },
      include: {
        translations: { where: { language: locale as "en" | "am" | "har" | "orm" } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    db.report.count({ where: { isPublished: true } }),
  ]);
  return { reports, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function ReportsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const { reports, totalPages } = await getReports(locale, page);

  return (
    <>
      <Header />
      <main className="flex-1">
        <ReportsHeader />
        <ReportsList reports={reports} locale={locale} page={page} totalPages={totalPages} />
      </main>
      <Footer />
    </>
  );
}

function ReportsHeader() {
  const t = useTranslations("reports");
  return (
    <section className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
    </section>
  );
}

function ReportsList({
  reports,
  locale,
  page,
  totalPages,
}: {
  reports: Awaited<ReturnType<typeof getReports>>["reports"];
  locale: string;
  page: number;
  totalPages: number;
}) {
  const t = useTranslations("reports");

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {reports.length === 0 ? (
          <p className="text-text-muted">No reports available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {reports.map((report) => {
                const translation = report.translations[0];
                if (!translation) return null;
                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* PDF icon */}
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <h2 className="font-semibold text-primary mb-2 line-clamp-2 flex-1">
                      {translation.title}
                    </h2>
                    <p className="text-sm text-text-muted line-clamp-3 mb-4">
                      {translation.description}
                    </p>

                    {report.publishedAt && (
                      <p className="text-xs text-text-muted mb-4">
                        {report.publishedAt.toLocaleDateString(locale)}
                      </p>
                    )}

                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded hover:bg-primary-dark transition-colors mt-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t("download")}
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/${locale}/reports?page=${p}`}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-text hover:bg-surface"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
