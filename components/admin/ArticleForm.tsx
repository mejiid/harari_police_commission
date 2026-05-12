"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import { 
  Globe, 
  Settings, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle2, 
  Save, 
  Send, 
  Trash2,
  Info
} from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "har", label: "ሐረሪ" },
  { code: "orm", label: "Oromoo" },
] as const;

type Language = (typeof LANGUAGES)[number]["code"];

type Translation = {
  language: Language;
  title: string;
  summary: string;
  content: string;
};

type ArticleData = {
  id: string;
  slug: string;
  images: string[];
  isPublished: boolean;
  translations: { language: string; title: string; summary: string; content: string }[];
};

type Props = { article?: ArticleData };

export default function ArticleForm({ article }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Language>("en");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [images, setImages] = useState<string[]>(article?.images ?? []);
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [translations, setTranslations] = useState<Record<Language, Translation>>(
    () => {
      const defaults: Record<Language, Translation> = {
        en: { language: "en", title: "", summary: "", content: "" },
        am: { language: "am", title: "", summary: "", content: "" },
        har: { language: "har", title: "", summary: "", content: "" },
        orm: { language: "orm", title: "", summary: "", content: "" },
      };
      if (article) {
        article.translations.forEach((t) => {
          const lang = t.language as Language;
          if (defaults[lang]) {
            defaults[lang] = { language: lang, title: t.title, summary: t.summary, content: t.content };
          }
        });
      }
      return defaults;
    }
  );

  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")     // Replace spaces with -
      .replace(/[^\w-]+/g, "")    // Remove all non-word chars
      .replace(/--+/g, "-");    // Replace multiple - with single -
  }

  function updateTranslation(lang: Language, field: keyof Omit<Translation, "language">, value: string) {
    setTranslations((prev) => {
      const next = {
        ...prev,
        [lang]: { ...prev[lang], [field]: value },
      };
      
      // Auto-generate slug from English title if slug is empty or was auto-generated
      if (lang === "en" && field === "title" && (!slug || slug === slugify(prev.en.title))) {
        setSlug(slugify(value));
      }
      
      return next;
    });
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      slug,
      images,
      isPublished: publish,
      translations: Object.values(translations),
    };

    const url = article ? `/api/admin/articles/${article.id}` : "/api/admin/articles";
    const method = article ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save article. Please try again.");
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  async function handleDelete() {
    if (!article || !confirm("Delete this article? This cannot be undone.")) return;
    await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  }

  const current = translations[activeTab];

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        <div className="bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
          {/* Language Tabs */}
          <div className="bg-surface-container-low flex border-b border-outline-variant/30 overflow-x-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveTab(lang.code)}
                className={`flex items-center gap-3 px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all relative shrink-0 ${
                  activeTab === lang.code
                    ? "bg-white text-primary"
                    : "text-on-surface-variant/40 hover:text-primary hover:bg-white/50"
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${activeTab === lang.code ? 'text-accent' : ''}`} />
                {lang.label}
                {activeTab === lang.code && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-accent" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                Article Title <span className="text-accent">*</span>
              </label>
              <input
                value={current.title}
                onChange={(e) => updateTranslation(activeTab, "title", e.target.value)}
                placeholder={`Enter title in ${translations[activeTab].language}...`}
                className="w-full bg-surface-container-low border border-outline-variant/30 px-6 py-4 text-primary font-display font-bold text-xl focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all placeholder:text-on-surface-variant/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                Executive Summary
              </label>
              <textarea
                value={current.summary}
                onChange={(e) => updateTranslation(activeTab, "summary", e.target.value)}
                placeholder="Brief abstract for the article listing..."
                rows={4}
                className="w-full bg-surface-container-low border border-outline-variant/30 px-6 py-4 text-sm text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all resize-none placeholder:text-on-surface-variant/20"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                Editorial Content
              </label>
              <div className="prose prose-sm max-w-none">
                <RichTextEditor
                  content={current.content}
                  onChange={(val) => updateTranslation(activeTab, "content", val)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Settings */}
      <div className="w-full lg:w-96 space-y-8">
        <div className="bg-white border border-outline-variant/30 shadow-sm p-8 space-y-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-outline-variant/30 pb-4 flex items-center gap-3">
            <Settings className="w-4 h-4 text-accent" />
            Publication Settings
          </h3>

          <div className="space-y-6">
            {/* Slug */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" />
                URL Slug
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="commission-annual-report"
                className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 text-xs font-medium text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:bg-white transition-all"
              />
            </div>

            {/* Gallery Upload */}
            <ImageUploader 
              value={images} 
              onChange={setImages} 
              label="Article Gallery" 
            />

            {/* Status Information */}
            <div className="bg-surface-container-low p-6 border-l-4 border-accent space-y-4">
               <div className="flex items-center gap-3 text-primary">
                 <Info className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Document Status</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${isPublished ? 'bg-green-600 animate-pulse' : 'bg-orange-600'}`} />
                 <span className="text-xs font-bold text-primary">{isPublished ? 'Live on Portal' : 'Drafting Stage'}</span>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-outline-variant/30 space-y-4">
             {error && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{error}</p>}
             
             <button
               onClick={() => handleSave(true)}
               disabled={saving}
               className="w-full bg-primary text-white flex items-center justify-center gap-3 py-5 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
             >
               <Send className="w-4 h-4" />
               {saving ? "Processing..." : "Commit & Publish"}
             </button>

             <button
               onClick={() => handleSave(false)}
               disabled={saving}
               className="w-full bg-white border border-outline-variant/50 text-primary flex items-center justify-center gap-3 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-low transition-all disabled:opacity-50"
             >
               <Save className="w-4 h-4 text-accent" />
               Save to Drafts
             </button>

             {article && (
               <button
                 onClick={handleDelete}
                 className="w-full text-red-600/40 hover:text-red-600 flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all"
               >
                 <Trash2 className="w-3.5 h-3.5" />
                 Permanently Delete
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
