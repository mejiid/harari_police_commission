"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  Inbox, 
  FileCode, 
  Users, 
  LogOut,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/reports", label: "Reports", icon: Files },
  { href: "/admin/contact", label: "Inquiries", icon: Inbox },
  { href: "/admin/pages", label: "Site Pages", icon: FileCode },
  { href: "/admin/users", label: "System Users", icon: Users },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }: { 
  mobileOpen?: boolean; 
  setMobileOpen?: (open: boolean) => void 
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Brand */}
      <div className="px-6 py-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
             <img src="/logo.png" alt="Harari Police Logo" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <p className="font-display font-bold text-sm tracking-tight leading-none">ADMIN PORTAL</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Harari Prison Commission</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all group ${
                active
                  ? "bg-accent text-white shadow-lg shadow-accent/10"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign out */}
      <div className="px-4 py-6 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-accent hover:bg-accent/5 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
