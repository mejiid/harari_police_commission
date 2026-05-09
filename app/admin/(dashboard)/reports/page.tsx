import Link from "next/link";
import { db } from "@/lib/db";

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <Link
          href="/admin/reports/new"
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          + New Report
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Title (EN)</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Author</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">No reports yet.</td>
              </tr>
            ) : (
              reports.map((report) => {
                const title = report.translations[0]?.title ?? "(No English translation)";
                return (
                  <tr key={report.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 font-medium text-text">{title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        report.isPublished ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>
                        {report.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{report.createdBy.name}</td>
                    <td className="px-4 py-3 text-text-muted">{report.createdAt.toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/reports/${report.id}`} className="text-accent text-sm hover:underline">Edit</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
