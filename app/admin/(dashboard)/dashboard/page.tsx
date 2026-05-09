import { db } from "@/lib/db";

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
    { label: "Total Articles", value: stats.articles, icon: "📰", href: "/admin/articles" },
    { label: "Total Reports", value: stats.reports, icon: "📄", href: "/admin/reports" },
    { label: "Unread Messages", value: stats.contacts, icon: "✉️", href: "/admin/contact" },
    { label: "Active Users", value: stats.users, icon: "👥", href: "/admin/users" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="text-3xl font-bold text-primary mb-1">{card.value}</div>
            <div className="text-sm text-text-muted">{card.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
