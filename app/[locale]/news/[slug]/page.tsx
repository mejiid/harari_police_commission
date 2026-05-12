import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Calendar, User, ArrowLeft, Share2, BookOpen, ShieldCheck } from "lucide-react";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticle(decodedSlug, locale);
  if (!article) return { title: "Not Found" };
  const translation = article.translations.find(t => t.language === locale) || article.translations[0];
  return { title: translation?.title ?? "Article" };
}

async function getArticle(slug: string, locale: string) {
  return db.article.findFirst({
    where: { slug, isPublished: true },
    include: {
      translations: true,
      createdBy: { select: { name: true } },
    },
  });
}


export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  console.log(`[DEBUG] ArticlePage - locale: ${locale}, slug: ${slug}, decoded: ${decodedSlug}`);
  const article = await getArticle(decodedSlug, locale);
  console.log(`[DEBUG] Article found: ${!!article}`);

  if (!article) notFound();

  const translation = 
    article.translations.find(t => t.language === locale) || 
    (locale === "har" ? article.translations.find(t => t.language === "am") : null) ||
    article.translations[0];

  if (!translation) notFound();

  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Progress Bar or Top Indicator */}
        <div className="h-1.5 w-full bg-surface-container-low fixed top-0 z-[100] hidden lg:block">
           <div className="h-full bg-accent w-1/3" />
        </div>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 bg-surface-container-lowest border-b border-outline-variant/30 overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
           <div className="max-w-4xl mx-auto px-6 relative">
              <Link
                href={`/${locale}/news`}
                className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-accent transition-all mb-12"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                Back to Archive
              </Link>

              <div className="flex items-center gap-3 text-accent mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Official Publication</span>
              </div>

              <h1 className="display-sm lg:display-md text-primary leading-tight font-display">
                {translation.title}
              </h1>

              <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-outline-variant/30 pt-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                       <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60">Authorized By</span>
                       <span className="text-xs font-bold text-primary">{article.createdBy.name}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                       <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60">Release Date</span>
                       <span className="text-xs font-bold text-primary">
                         {article.publishedAt?.toLocaleDateString(locale, {
                           year: "numeric",
                           month: "long",
                           day: "numeric",
                         })}
                       </span>
                    </div>
                 </div>

                 <button className="ml-auto w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-accent hover:text-white hover:border-accent transition-all">
                    <Share2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Image Gallery */}
          {article.images && article.images.length > 0 && (
            <div className="space-y-6 mb-16">
               <div className="relative aspect-video w-full shadow-2xl overflow-hidden border border-outline-variant/30 group">
                <img
                  src={article.images[0]}
                  alt={translation.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {article.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {article.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden border border-outline-variant/20 group">
                      <img
                        src={img}
                        alt={`${translation.title} gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Abstract/Summary */}
          <div className="bg-surface-container-low p-10 lg:p-16 border-l-4 border-accent mb-16 relative">
             <BookOpen className="absolute top-8 right-8 w-12 h-12 text-accent/10" />
             <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Executive Abstract</h3>
             <p className="text-xl lg:text-2xl text-primary font-medium leading-relaxed italic">
               "{translation.summary}"
             </p>
          </div>

          {/* Content Body */}
          <div className="prose prose-lg prose-primary max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-primary prose-p:text-on-surface-variant prose-p:leading-[1.8] prose-p:text-lg">
             <div
              dangerouslySetInnerHTML={{ __html: translation.content }}
             />
          </div>

          {/* Institutional Footer Seal */}
          <div className="mt-32 pt-20 border-t border-outline-variant/30 text-center">
             <div className="inline-flex items-center gap-4 px-8 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-full">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Authenticated Document Archive</span>
             </div>
             <p className="text-on-surface-variant/40 text-[10px] uppercase tracking-[0.2em] mt-8">
                © {new Date().getFullYear()} Harari Prison Police Commission • All Rights Reserved
             </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
