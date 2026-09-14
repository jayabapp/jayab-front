import { useCallback, useEffect, useRef } from "react";

export const useSyncedRowScroll = (rowCount: number) => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const syncingRef = useRef(false);

  const setRowRef = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      elementsRef.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    const elements = elementsRef.current.filter(
      (element): element is HTMLDivElement => !!element,
    );
    if (elements.length < 2) return;

    const cleanups = elements.map((source) => {
      const onScroll = () => {
        if (syncingRef.current) return;
        syncingRef.current = true;
        for (const target of elements) {
          if (target !== source) target.scrollLeft = source.scrollLeft;
        }
        requestAnimationFrame(() => {
          syncingRef.current = false;
        });
      };
      source.addEventListener("scroll", onScroll, { passive: true });
      return () => source.removeEventListener("scroll", onScroll);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [rowCount]);

  return setRowRef;
};
