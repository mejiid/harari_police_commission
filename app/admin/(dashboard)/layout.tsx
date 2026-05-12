"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Public+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans antialiased">
        <div className="flex min-h-screen bg-surface">
          {/* Sidebar Overlay for Mobile */}
          {mobileOpen && (
            <div 
              className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 bg-primary text-white flex items-center justify-between px-6 sticky top-0 z-30 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-xs uppercase tracking-widest">Admin Portal</span>
              </div>
              <button 
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 -mr-2 text-white/70 hover:text-white"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </header>

            <main className="flex-1 p-6 lg:p-10 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
