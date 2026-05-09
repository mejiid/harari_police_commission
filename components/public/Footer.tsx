import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-primary text-white mt-auto overflow-hidden relative">
      {/* Decorative gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-container opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-bold text-white text-sm border border-white/20">
                HPP
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight leading-none">
                  HARARI PRISON
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/50">
                  Police Commission
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Establishing excellence in correctional services through professional integrity, 
              transparency, and unwavering institutional stability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href={`/${locale}/news`} className="text-white/70 hover:text-white transition-colors">{t("news")}</Link></li>
              <li><Link href={`/${locale}/reports`} className="text-white/70 hover:text-white transition-colors">{t("reports")}</Link></li>
              <li><Link href={`/${locale}/about`} className="text-white/70 hover:text-white transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-white/70 hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Office
            </h3>
            <div className="text-sm text-white/70 space-y-4">
              <p>Harar, Ethiopia<br />Administrative District</p>
              <p className="font-bold text-white">harariprisonpolice@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/30 font-bold">
          <div>© {new Date().getFullYear()} Prison Police Commission</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
