import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

async function getAboutContent(locale: string) {
  return db.pageContent.findUnique({
    where: {
      pageKey_language: {
        pageKey: "about",
        language: locale as "en" | "am" | "har" | "orm",
      },
    },
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const content = await getAboutContent(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHeader />
        <AboutContent content={content?.content ?? null} />
      </main>
      <Footer />
    </>
  );
}

function AboutHeader() {
  const t = useTranslations("about");
  return (
    <section className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
    </section>
  );
}

function AboutContent({ content }: { content: string | null }) {
  if (!content) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-text-muted">
          Content coming soon.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className="prose prose-lg max-w-none text-text"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
