"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";

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
  imageUrl: string | null;
  isPublished: boolean;
  translations: { language: string; title: string; summary: string; content: string }[];
};

type Props = { article?: ArticleData };

export default function ArticleForm({ article }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Language>("en");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? "");
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

  function updateTranslation(lang: Language, field: keyof Omit<Translation, "language">, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      slug,
      imageUrl,
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
      setError("Failed to save article. Please try again.");
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
    <div className="max-w-4xl space-y-6">
      {/* Slug + Image */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Slug (URL)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. commission-annual-report-2025"
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Image URL (optional)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ik.imagekit.io/..."
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-border">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveTab(lang.code)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === lang.code
                  ? "border-b-2 border-accent text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title</label>
            <input
              value={current.title}
              onChange={(e) => updateTranslation(activeTab, "title", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Summary</label>
            <textarea
              value={current.summary}
              onChange={(e) => updateTranslation(activeTab, "summary", e.target.value)}
              rows={3}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Content</label>
            <RichTextEditor
              content={current.content}
              onChange={(val) => updateTranslation(activeTab, "content", val)}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="bg-white border border-border text-text text-sm font-medium px-5 py-2.5 rounded hover:bg-surface transition-colors disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Publish"}
        </button>
        {article && (
          <button
            onClick={handleDelete}
            className="ml-auto text-error text-sm hover:underline"
          >
            Delete Article
          </button>
        )}
      </div>
    </div>
  );
}
