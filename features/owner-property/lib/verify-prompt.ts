export const VERIFY_PROMPT_STORAGE_KEY = "VERIFY_MODAL_LIST";
const EMPTY_PROMPTED: number[] = [];

const readStoredIds = (): number[] => {
  if (typeof window === "undefined") return EMPTY_PROMPTED;
  try {
    const stored = window.localStorage.getItem(VERIFY_PROMPT_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? parsed.map(Number).filter(Number.isFinite)
      : EMPTY_PROMPTED;
  } catch {
    return EMPTY_PROMPTED;
  }
};

let snapshot: number[] | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const persist = (ids: number[]) => {
  snapshot = ids;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        VERIFY_PROMPT_STORAGE_KEY,
        JSON.stringify(ids),
      );
    } catch {
      // Private-mode quota failures are not worth surfacing to the user.
    }
  }
  emit();
};

export const getVerifyPromptSnapshot = (): number[] => {
  if (snapshot === null) snapshot = readStoredIds();
  return snapshot;
};

export const getServerVerifyPromptSnapshot = (): number[] => EMPTY_PROMPTED;

export const subscribeVerifyPrompt = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== VERIFY_PROMPT_STORAGE_KEY) return;
    snapshot = readStoredIds();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const rememberVerifyPrompt = (propertyId?: number | null) => {
  if (!propertyId) return;
  const prompted = getVerifyPromptSnapshot();
  if (prompted.includes(propertyId)) return;
  persist([...prompted, propertyId]);
};

export const acceptVerifyPrompt = (propertyId?: number | null) => {
  if (!propertyId) return;
  const next = [...getVerifyPromptSnapshot(), propertyId];
  next.shift();
  persist(next);
};
