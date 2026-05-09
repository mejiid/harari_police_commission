"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  am: "አማርኛ",
  har: "ሐረሪ",
  orm: "Oromoo",
};

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/news`, label: t("news") },
    { href: `/${locale}/reports`, label: t("reports") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-outline-variant/30 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name */}
          <Link href={`/${locale}`} className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary flex items-center justify-center font-bold text-white text-sm shadow-lg transition-transform group-hover:scale-105">
              HPP
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight leading-none text-primary">
                HARARI PRISON
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-variant">
                Police Commission
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors group"
              >
                <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <>
                  {/* Backdrop to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-2xl border border-outline-variant/30 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    {routing.locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc as string)}
                        className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-between ${
                          locale === loc
                            ? "bg-primary/5 text-primary"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                        }`}
                      >
                        {LOCALE_LABELS[loc as keyof typeof LOCALE_LABELS]}
                        {locale === loc && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 items-end">
                <div className={`h-0.5 bg-current transition-all ${menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
                <div className={`h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : "w-4"}`} />
                <div className={`h-0.5 bg-current transition-all ${menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-8 pt-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors border-b border-outline-variant/20 pb-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
