"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const LANG_LABELS: Record<string, string> = {
  en: "English", am: "አማርኛ", har: "ሐረሪ", orm: "Oromoo",
};

type Props = {
  pageKey: string;
  languages: string[];
  initialContents: Record<string, string>;
};

export default function PageEditor({ pageKey, languages, initialContents }: Props) {
  const [activeTab, setActiveTab] = useState(languages[0]);
  const [contents, setContents] = useState<Record<string, string>>(initialContents);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey, contents }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex border-b border-border">
        {languages.map((lang) => (
          <button key={lang} onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === lang ? "border-b-2 border-accent text-primary" : "text-text-muted hover:text-text"
            }`}>
            {LANG_LABELS[lang] ?? lang}
          </button>
        ))}
      </div>

      <RichTextEditor
        content={contents[activeTab] ?? ""}
        onChange={(val) => setContents((prev) => ({ ...prev, [activeTab]: val }))}
      />

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-success text-sm">Saved!</span>}
      </div>
    </div>
  );
}
