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

function ContactHeader() {
  const t = useTranslations("contact");
  return (
    <section className="relative py-24 flex items-center overflow-hidden bg-primary">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Institutional Connect
          </div>
          <h1 className="display-md text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Ensuring transparent communication between the Harari Prison Police Commission 
            and the community we serve.
          </p>
        </div>
      </div>
    </section>
  );
}

function SupportChannels() {
  const channels = [
    { title: "General Inquiries", detail: "harariprisonpolice@gmail.com", icon: "📧" },
    { title: "Administrative Office", detail: "+251 (0) 25 666 XXXX", icon: "📞" },
    { title: "Physical Address", detail: "Harar, Ethiopia | Admin District", icon: "📍" },
    { title: "Visiting Hours", detail: "Mon - Fri | 09:00 - 17:00", icon: "🕒" },
  ];

  return (
    <section className="py-24 bg-surface-container-low border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant/20 overflow-hidden shadow-sm">
          {channels.map((c, i) => (
            <div key={i} className="bg-white p-10 hover:bg-surface-container-low transition-colors group">
              <div className="text-2xl mb-6 grayscale group-hover:grayscale-0 transition-all">{c.icon}</div>
              <h3 className="font-display font-bold text-primary mb-2 uppercase tracking-widest text-[10px]">{c.title}</h3>
              <p className="text-sm font-bold text-on-surface leading-relaxed break-words">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-32 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2">
           <div className="mb-12">
             <h2 className="headline-sm text-primary uppercase tracking-[0.2em] mb-4">Official Inquiry Form</h2>
             <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
               Please use the form below for official administrative inquiries, report submissions, 
               or to request information regarding correctional services.
             </p>
           </div>
           <ContactForm />
        </div>
        <div className="space-y-12">
           <div className="bg-surface-container-low p-10 border-l-4 border-primary">
              <h4 className="font-display font-bold text-primary uppercase tracking-widest text-xs mb-6">Security Notice</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                All communications sent via this portal are recorded for security and quality purposes. 
                Please do not submit sensitive personal inmate information through this public form.
              </p>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 p-3 text-center border border-primary/10">
                Official Government Portal
              </div>
           </div>
           <div className="aspect-video w-full bg-surface-container-low flex items-center justify-center border border-outline-variant/30 relative overflow-hidden grayscale contrast-125">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                alt="Location Map"
              />
              <div className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-primary/40 text-center px-8">
                Official Location Map<br />Harar Regional Administrative District
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export default async function ContactPage({ params }: Props) {
  await params; // ensure locale is resolved
  return (
    <>
      <Header />
      <main className="flex-1">
        <ContactHeader />
        <SupportChannels />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
