import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, Edit2, FileText, Globe } from "lucide-react";

async function getArticles() {
  return db.article.findMany({
    include: {
      translations: { where: { language: "en" } },
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="display-sm text-primary">Articles</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold">
            Manage News and Official Statements
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary-container transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create New Article
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Title (English)</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Author</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Date Created</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant italic text-sm">
                    No articles found in the repository.
                  </td>
                </tr>
              ) : (
                articles.map((article) => {
                  const title = article.translations[0]?.title ?? "(No English translation)";
                  return (
                    <tr key={article.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-display font-bold text-primary group-hover:text-accent transition-colors">
                            {title}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          article.isPublished
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-orange-50 text-orange-700 border border-orange-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${article.isPublished ? 'bg-green-600 animate-pulse' : 'bg-orange-600'}`} />
                          {article.isPublished ? "Published" : "Draft"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-on-surface-variant font-medium">
                        {article.createdBy.name}
                      </td>
                      <td className="px-8 py-6 text-xs text-on-surface-variant">
                        {article.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-surface-container-low text-primary hover:bg-accent hover:text-white transition-all shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
