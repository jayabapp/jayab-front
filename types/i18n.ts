import type { Locale } from "@/i18n/config";
import type fa from "@/messages/fa.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof fa;
  }
}

// For pure helpers that receive a translator. Keys are plain strings here; the
// namespaces script flags any "ns.key" literal that does not exist in messages.
export type Translate = {
  bivarianceHack(key: string, values?: Record<string, string | number>): string;
}["bivarianceHack"];
