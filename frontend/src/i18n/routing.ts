import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

// OpenGraph locale mapping for SEO metadata
export const OG_LOCALES: Record<string, string> = {
  en: "en_US", // English
};

export function getOgLocale(locale: string): string {
  return OG_LOCALES[locale] || "en_US";
}

export function getAlternateOgLocales(currentLocale: string): string[] {
  return routing.locales
    .filter((loc) => loc !== currentLocale)
    .map((loc) => OG_LOCALES[loc] || "en_US");
}
