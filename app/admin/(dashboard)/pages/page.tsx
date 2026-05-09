import { db } from "@/lib/db";
import PageEditor from "@/components/admin/PageEditor";

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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">Static Pages</h1>
      <div className="space-y-8">
        {PAGE_KEYS.map((pageKey) => (
          <div key={pageKey} className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface">
              <h2 className="font-semibold text-text capitalize">{pageKey} Page</h2>
            </div>
            <div className="p-6">
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
