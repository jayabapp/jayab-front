import type { SearchHistoryEntry } from "@/types/features/search";

export const SEARCH_HISTORY_STORAGE_KEY = "search_history";
const SEARCH_HISTORY_LIMIT = 5;
const EMPTY_HISTORY: SearchHistoryEntry[] = [];

const isEntry = (value: unknown): value is SearchHistoryEntry =>
  !!value &&
  typeof value === "object" &&
  typeof (value as SearchHistoryEntry).title === "string" &&
  typeof (value as SearchHistoryEntry).id === "string";

const readStoredHistory = (): SearchHistoryEntry[] => {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const stored = window.localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isEntry) : EMPTY_HISTORY;
  } catch {
    // A corrupt or unreadable entry must not break the search panel.
    return EMPTY_HISTORY;
  }
};

/*
 * Search history lives in `localStorage`, which is an external store rather than
 * React state. Exposing it through subscribe/getSnapshot lets consumers read it
 * with `useSyncExternalStore`: no setState-in-effect, no hydration mismatch, and
 * every mounted search panel sees the same list.
 */
let snapshot: SearchHistoryEntry[] | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const persist = (entries: SearchHistoryEntry[]) => {
  snapshot = entries;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Private-mode quota failures are not worth surfacing to the user.
    }
  }
  emit();
};

export const getSearchHistorySnapshot = (): SearchHistoryEntry[] => {
  if (snapshot === null) snapshot = readStoredHistory();
  return snapshot;
};

export const getServerSearchHistorySnapshot = (): SearchHistoryEntry[] => EMPTY_HISTORY;

export const subscribeSearchHistory = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== SEARCH_HISTORY_STORAGE_KEY) return;
    snapshot = readStoredHistory();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const appendSearchHistory = (title: string) => {
  const trimmed = title.trim();
  const history = getSearchHistorySnapshot();
  if (!trimmed || history.some((entry) => entry.title === trimmed)) return;

  const next = [...history, { title: trimmed, id: `${Date.now()}` }];
  persist(next.slice(Math.max(0, next.length - SEARCH_HISTORY_LIMIT)));
};

export const removeSearchHistoryEntry = (id: string) => {
  persist(getSearchHistorySnapshot().filter((entry) => entry.id !== id));
};
