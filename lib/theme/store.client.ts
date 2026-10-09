import type { ThemeChoice, ThemeSnapshot } from "@/types/theme";

import {
  THEME_CHANNEL,
  THEME_COOKIE,
  THEME_ENABLED,
  parseThemeChoice,
  readCookieChoice,
  resolveTheme,
} from "./config";

const initial: ThemeSnapshot = {
  choice: THEME_ENABLED ? "system" : "light",
  resolved: "light",
  ready: false,
  enabled: THEME_ENABLED,
};

let snapshot = initial;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

const publish = (next: ThemeSnapshot) => {
  if (
    next.choice === snapshot.choice &&
    next.resolved === snapshot.resolved &&
    next.ready === snapshot.ready
  )
    return;
  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getSnapshot = () => snapshot;
export const getServerSnapshot = () => initial;

const darkQuery = () => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)");
  } catch {
    return null;
  }
};

const syncMeta = () => {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue("--c-surface")
    .trim();
  if (!channels) return;
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = `rgb(${channels.split(/\s+/).join(", ")})`;
};

const apply = (choice: ThemeChoice) => {
  const resolved = resolveTheme(choice, !!darkQuery()?.matches);
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
  syncMeta();
  publish({ ...snapshot, choice, resolved, ready: true });
};

const persist = (choice: ThemeChoice) => {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${THEME_COOKIE}=${choice}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  } catch {}
};

export const setThemeChoice = (value: ThemeChoice) => {
  const choice = parseThemeChoice(value);
  if (!THEME_ENABLED || !choice) return;
  apply(choice);
  persist(choice);
  try {
    channel?.postMessage(choice);
  } catch {}
};

export const startThemeSync = () => {
  if (!THEME_ENABLED) {
    publish({ ...snapshot, ready: true });
    return () => {};
  }
  apply(readCookieChoice(document.cookie) ?? "system");
  const query = darkQuery();
  const onOsChange = () => {
    if (snapshot.choice === "system") apply("system");
  };
  const resync = () => {
    const stored = readCookieChoice(document.cookie);
    if (stored && stored !== snapshot.choice) apply(stored);
  };

  query?.addEventListener("change", onOsChange);
  window.addEventListener("focus", resync);
  document.addEventListener("visibilitychange", resync);
  try {
    channel = new BroadcastChannel(THEME_CHANNEL);
    channel.onmessage = (event) => {
      const received = parseThemeChoice(event.data);
      if (received && received !== snapshot.choice) apply(received);
    };
  } catch {}

  return () => {
    query?.removeEventListener("change", onOsChange);
    window.removeEventListener("focus", resync);
    document.removeEventListener("visibilitychange", resync);
    channel?.close();
    channel = null;
  };
};
