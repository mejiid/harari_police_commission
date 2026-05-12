import { db } from "@/lib/db";
import PageEditor from "@/components/admin/PageEditor";
import { FileCode, Globe, Layout } from "lucide-react";

const PAGE_KEYS = ["home", "about"] as const;
const LANGUAGES = ["en", "am", "har", "orm"] as const;

async function getPageContents() {
  return db.pageContent.findMany({
    where: { pageKey: { in: [...PAGE_KEYS] } },
  });
}

export default async function PagesAdminPage() {
  const contents = await getPageContents();

  const contentMap = Object.fromEntries(
    contents.map((c) => [`${c.pageKey}_${c.language}`, c.content])
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div>
        <h1 className="display-sm text-primary">Static Page Management</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold flex items-center gap-2">
          <FileCode className="w-3 h-3 text-accent" />
          Edit Core Website Content
        </p>
      </div>

      <div className="space-y-12">
        {PAGE_KEYS.map((pageKey) => (
          <div key={pageKey} className="bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/30 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary/5 flex items-center justify-center text-primary">
                    <Layout className="w-5 h-5" />
                 </div>
                 <h2 className="font-display font-bold text-primary capitalize tracking-tight text-lg">
                   {pageKey} Page
                 </h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                 <Globe className="w-3 h-3" />
                 Multilingual Content
              </div>
            </div>
            <div className="p-8">
              <PageEditor
                pageKey={pageKey}
                languages={[...LANGUAGES]}
                initialContents={Object.fromEntries(
                  LANGUAGES.map((lang) => [lang, contentMap[`${pageKey}_${lang}`] ?? ""])
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
