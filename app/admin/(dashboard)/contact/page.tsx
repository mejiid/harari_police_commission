import { db } from "@/lib/db";
import MarkReadButton from "@/components/admin/MarkReadButton";

async function getSubmissions() {
  return db.contactSubmission.findMany({ orderBy: { submittedAt: "desc" } });
}

export default async function ContactInboxPage() {
  const submissions = await getSubmissions();
  const unread = submissions.filter((s) => !s.isRead).length;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-primary">Contact Inbox</h1>
        {unread > 0 && (
          <span className="bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-text-muted">No messages yet.</p>
        ) : (
          submissions.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-lg border p-5 ${
                s.isRead ? "border-border" : "border-accent/40 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!s.isRead && (
                      <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
                    )}
                    <p className="font-semibold text-text truncate">{s.subject}</p>
                  </div>
                  <p className="text-sm text-text-muted mb-1">
                    {s.name} — <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                  </p>
                  <p className="text-sm text-text mt-2 whitespace-pre-wrap">{s.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xs text-text-muted">
                    {s.submittedAt.toLocaleDateString()}
                  </p>
                  {!s.isRead && <MarkReadButton id={s.id} />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
