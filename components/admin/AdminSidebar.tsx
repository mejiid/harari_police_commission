"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/articles", label: "Articles", icon: "📰" },
  { href: "/admin/reports", label: "Reports", icon: "📄" },
  { href: "/admin/contact", label: "Contact Inbox", icon: "✉️" },
  { href: "/admin/pages", label: "Pages", icon: "📝" },
  { href: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-60 bg-primary text-white flex flex-col min-h-screen shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xs">
            PPC
          </div>
          <div>
            <p className="font-semibold text-sm">Admin Panel</p>
            <p className="text-xs text-white/60">Prison Police Commission</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                active
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
