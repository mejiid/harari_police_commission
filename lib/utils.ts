export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export const LOCALES = ["en", "am", "har", "orm"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  am: "አማርኛ",
  har: "ሐረሪ",
  orm: "Oromoo",
};

export const DEFAULT_LOCALE: Locale = "en";
