import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Files, Inbox, Users } from "lucide-react";

async function getStats() {
  const [articles, reports, contacts, users] = await Promise.all([
    db.article.count(),
    db.report.count(),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.user.count({ where: { isActive: true } }),
  ]);
  return { articles, reports, contacts, users };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Articles", value: stats.articles, icon: <FileText className="w-6 h-6" />, href: "/admin/articles", color: "bg-blue-50 text-blue-600" },
    { label: "Total Reports", value: stats.reports, icon: <Files className="w-6 h-6" />, href: "/admin/reports", color: "bg-purple-50 text-purple-600" },
    { label: "Unread Messages", value: stats.contacts, icon: <Inbox className="w-6 h-6" />, href: "/admin/contact", color: "bg-orange-50 text-orange-600" },
    { label: "Active Users", value: stats.users, icon: <Users className="w-6 h-6" />, href: "/admin/users", color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Banner */}
      <div className="relative bg-primary p-10 lg:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-24 -mt-24 rounded-full" />
        <div className="relative z-10">
          <h1 className="display-sm text-white mb-3">Welcome, Administrator.</h1>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-bold">
            Harari Prison Police Commission Portal
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="group bg-white p-8 border border-outline-variant/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`w-12 h-12 ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div className="text-3xl font-display font-extrabold text-primary mb-1">
              {card.value}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {card.label}
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 border border-outline-variant/30 shadow-sm">
           <h2 className="headline-sm text-primary mb-8 uppercase tracking-widest text-xs border-b border-outline-variant/30 pb-4">Recent Updates</h2>
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-outline-variant/10 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-primary">System maintenance scheduled for weekend</div>
                    <div className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-1">Institutional Alert • 2 hours ago</div>
                  </div>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-surface-container-low p-10 border-l-4 border-accent">
           <h2 className="headline-sm text-primary mb-6 uppercase tracking-widest text-xs">Admin Actions</h2>
           <div className="space-y-4">
              <Link href="/admin/articles/new" className="block w-full bg-primary text-white text-center py-4 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                Create New Article
              </Link>
              <Link href="/admin/reports/new" className="block w-full bg-white border border-outline-variant/50 text-primary text-center py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white/50 transition-all">
                Upload New Report
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
