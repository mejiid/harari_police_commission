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
  const content = await db.pageContent.findUnique({
    where: {
      pageKey_language: {
        pageKey: "about",
        language: locale as "en" | "am" | "har" | "orm",
      },
    },
  });

  if (!content && locale === "har") {
    return db.pageContent.findUnique({
      where: {
        pageKey_language: {
          pageKey: "about",
          language: "am",
        },
      },
    });
  }

  return content;
}

function AboutHeader() {
  const t = useTranslations("about");
  return (
    <section className="relative py-32 flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1570126618983-31483b5ea731?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20"
          alt="Institutional Foundation"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Institutional Legacy
          </div>
          <h1 className="display-md text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            The Harari Prison Police Commission stands as a pillar of regional stability, 
            dedicated to the pursuit of justice and professional correctional excellence.
          </p>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    { title: "Integrity", desc: "Unwavering commitment to ethical conduct and honesty.", icon: "🛡️" },
    { title: "Transparency", desc: "Openness in our operations and accountability to the public.", icon: "🏛️" },
    { title: "Security", desc: "Ensuring the safety of the community and those in our care.", icon: "🔐" },
    { title: "Humanity", desc: "Treating every individual with respect and dignity.", icon: "🕊️" },
  ];

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="headline-sm text-primary uppercase tracking-[0.2em] mb-4">Our Core Values</h2>
          <div className="h-1 w-20 bg-accent mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-8 border-t-2 border-outline-variant hover:border-accent transition-all group">
              <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{v.icon}</div>
              <h3 className="font-display font-bold text-primary mb-2 uppercase tracking-widest text-xs">{v.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutContent({ content }: { content: string | null }) {
  if (!content) {
    return (
      <section className="py-24 px-4 bg-white text-center italic text-on-surface-variant">
        Historical records and mission details are being updated.
      </section>
    );
  }

  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-display prose-headings:text-primary prose-headings:uppercase prose-headings:tracking-widest
            prose-p:text-on-surface-variant prose-p:leading-relaxed
            dangerouslySetInnerHTML={{ __html: content }}"
          />
        </div>
        <div className="space-y-12">
          <div className="bg-primary p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full" />
             <h4 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-accent mb-6">Quick Stats</h4>
             <div className="space-y-6">
                <div>
                  <div className="text-2xl font-bold">25 Years</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">Of Service Excellence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4 Facilities</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">Regional Management</div>
                </div>
             </div>
          </div>
          <div className="border-l-4 border-outline-variant pl-8 space-y-4">
             <h4 className="font-display font-bold text-primary uppercase tracking-widest text-xs">Public Inquiries</h4>
             <p className="text-xs text-on-surface-variant leading-relaxed">
               For historical records or official inquiries, please contact our administrative office.
             </p>
             <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:text-primary transition-colors">
               Contact Office →
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const content = await getAboutContent(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHeader />
        <ValuesSection />
        <AboutContent content={content?.content ?? null} />
      </main>
      <Footer />
    </>
  );
}
