import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import ContactForm from "@/components/public/ContactForm";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: Props) {
  await params; // ensure locale is resolved
  return (
    <>
      <Header />
      <main className="flex-1">
        <ContactHeader />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

function ContactHeader() {
  const t = useTranslations("contact");
  return (
    <section className="bg-primary text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <ContactForm />
      </div>
    </section>
  );
}
