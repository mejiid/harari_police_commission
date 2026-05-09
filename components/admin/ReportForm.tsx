"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "har", label: "ሐረሪ" },
  { code: "orm", label: "Oromoo" },
] as const;

type Language = (typeof LANGUAGES)[number]["code"];

type Translation = { language: Language; title: string; description: string };

type ReportData = {
  id: string;
  fileUrl: string;
  isPublished: boolean;
  translations: { language: string; title: string; description: string }[];
};

type Props = { report?: ReportData };

export default function ReportForm({ report }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Language>("en");
  const [fileUrl, setFileUrl] = useState(report?.fileUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [translations, setTranslations] = useState<Record<Language, Translation>>(() => {
    const defaults: Record<Language, Translation> = {
      en: { language: "en", title: "", description: "" },
      am: { language: "am", title: "", description: "" },
      har: { language: "har", title: "", description: "" },
      orm: { language: "orm", title: "", description: "" },
    };
    if (report) {
      report.translations.forEach((t) => {
        const lang = t.language as Language;
        if (defaults[lang]) defaults[lang] = { language: lang, title: t.title, description: t.description };
      });
    }
    return defaults;
  });

  function updateTranslation(lang: Language, field: "title" | "description", value: string) {
    setTranslations((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setFileUrl(data.url ?? "");
    setUploading(false);
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");

    const payload = { fileUrl, isPublished: publish, translations: Object.values(translations) };
    const url = report ? `/api/admin/reports/${report.id}` : "/api/admin/reports";
    const method = report ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) { setError("Failed to save. Please try again."); return; }
    router.push("/admin/reports");
    router.refresh();
  }

  async function handleDelete() {
    if (!report || !confirm("Delete this report?")) return;
    await fetch(`/api/admin/reports/${report.id}`, { method: "DELETE" });
    router.push("/admin/reports");
    router.refresh();
  }

  const current = translations[activeTab];

  return (
    <div className="max-w-3xl space-y-6">
      {/* PDF Upload */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-semibold text-text">PDF File</h2>
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="text-sm" />
        {uploading && <p className="text-sm text-text-muted">Uploading...</p>}
        {fileUrl && (
          <p className="text-sm text-success">
            File ready: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">{fileUrl}</a>
          </p>
        )}
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-border">
          {LANGUAGES.map((lang) => (
            <button key={lang.code} onClick={() => setActiveTab(lang.code)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === lang.code ? "border-b-2 border-accent text-primary" : "text-text-muted hover:text-text"
              }`}>
              {lang.label}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title</label>
            <input value={current.title} onChange={(e) => updateTranslation(activeTab, "title", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Description</label>
            <textarea value={current.description} onChange={(e) => updateTranslation(activeTab, "description", e.target.value)}
              rows={4} className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={() => handleSave(false)} disabled={saving}
          className="bg-white border border-border text-text text-sm font-medium px-5 py-2.5 rounded hover:bg-surface transition-colors disabled:opacity-60">
          Save Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-primary-dark transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Publish"}
        </button>
        {report && (
          <button onClick={handleDelete} className="ml-auto text-error text-sm hover:underline">Delete Report</button>
        )}
      </div>
    </div>
  );
}
