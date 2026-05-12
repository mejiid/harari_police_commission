import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, Edit2, Files, Download } from "lucide-react";

async function getReports() {
  return db.report.findMany({
    include: {
      translations: { where: { language: "en" } },
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ReportsAdminPage() {
  const reports = await getReports();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="display-sm text-primary">Reports</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold">
            Official Institutional Records & Directives
          </p>
        </div>
        <Link
          href="/admin/reports/new"
          className="inline-flex items-center justify-center gap-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary-container transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Upload New Report
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Report Title (EN)</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Author</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant italic text-sm">
                    No reports archived yet.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const title = report.translations[0]?.title ?? "(No English translation)";
                  return (
                    <tr key={report.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Files className="w-4 h-4" />
                          </div>
                          <span className="font-display font-bold text-primary group-hover:text-accent transition-colors uppercase tracking-tight">
                            {title}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          report.isPublished
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-orange-50 text-orange-700 border border-orange-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${report.isPublished ? 'bg-green-600 animate-pulse' : 'bg-orange-600'}`} />
                          {report.isPublished ? "Published" : "Draft"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-on-surface-variant font-medium">
                        {report.createdBy.name}
                      </td>
                      <td className="px-8 py-6 text-xs text-on-surface-variant">
                        {report.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right space-x-3">
                        <a 
                          href={report.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/admin/reports/${report.id}`}
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
