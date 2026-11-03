type MetrixSdk = any;

let ready: Promise<MetrixSdk | null> | null = null;

const whenIdle = () =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") return resolve();
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === "function") ric(() => resolve(), { timeout: 3000 });
    else setTimeout(resolve, 1);
  });

export const initMetrix = (): Promise<MetrixSdk | null> => {
  if (ready) return ready;
  ready = (async () => {
    const appId = process.env.NEXT_PUBLIC_METRIX_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_METRIX_APP_KEY;
    if (!appId || !appKey) {
      console.warn("Metrix SDK: Missing credentials", {
        appId: !!appId,
        appKey: !!appKey,
      });
      return null;
    }

    try {
      await whenIdle();
      // @ts-ignore
      const sdk = await import("@metrixorg/websdk");
      sdk.init(appId, appKey);
      return sdk;
    } catch (error) {
      console.error("Metrix SDK initialization error:", error);
      return null;
    }
  })();

  return ready;
};

export const withMetrix = async (fn: (sdk: MetrixSdk) => void) => {
  const sdk = await initMetrix();
  if (!sdk) return;
  try {
    fn(sdk);
  } catch (error) {
    console.error("Metrix SDK call failed:", error);
  }
};
