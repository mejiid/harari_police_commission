import { db } from "@/lib/db";
import MarkReadButton from "@/components/admin/MarkReadButton";
import { Inbox, Mail, Calendar, User, MessageSquare, ShieldCheck } from "lucide-react";

async function getSubmissions() {
  return db.contactSubmission.findMany({ orderBy: { submittedAt: "desc" } });
}

export default async function ContactInboxPage() {
  const submissions = await getSubmissions();
  const unreadCount = submissions.filter((s) => !s.isRead).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-sm text-primary">Inquiry Inbox</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2 font-bold flex items-center gap-2">
            <Inbox className="w-3 h-3 text-accent" />
            Manage Public Communications
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-accent/10 border border-accent/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {unreadCount} Unread Messages
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <div className="bg-white border border-outline-variant/30 p-20 text-center text-on-surface-variant italic">
            Your inquiry inbox is currently empty.
          </div>
        ) : (
          submissions.map((s) => (
            <div
              key={s.id}
              className={`bg-white border transition-all ${
                s.isRead 
                  ? "border-outline-variant/30 opacity-75 hover:opacity-100 shadow-sm" 
                  : "border-accent/40 shadow-xl ring-1 ring-accent/5"
              }`}
            >
              <div className="flex flex-col md:flex-row items-start justify-between">
                {/* Message Content */}
                <div className="flex-1 p-8 min-w-0 space-y-4">
                  <div className="flex items-center gap-3">
                    {!s.isRead && <span className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />}
                    <h3 className={`font-display font-bold text-primary truncate ${s.isRead ? 'text-base' : 'text-lg tracking-tight'}`}>
                      {s.subject}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-accent" />
                      {s.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-accent" />
                      <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors">{s.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-accent" />
                      {s.submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6 border-l-2 border-outline-variant/30 mt-6">
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-medium">
                      {s.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto p-8 md:border-l border-outline-variant/10 flex md:flex-col items-center justify-between md:justify-start gap-4">
                  {!s.isRead ? (
                    <MarkReadButton id={s.id} />
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 py-2">
                      <ShieldCheck className="w-3 h-3" />
                      Archived
                    </div>
                  )}
                  <button className="p-3 bg-surface-container-low text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
