"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserReservations } from "@features/reservations/hooks/useUserReservations";

export const useHomeActiveReserves = (isLogin: boolean) => {
  const query = useUserReservations("active", isLogin);
  const [now, setNow] = useState(() => Date.now());
  const activeReserves = useMemo(
    () =>
      (query.data ?? []).filter(
        (item) =>
          !item?.is_answer_deadline_passed &&
          query.dataUpdatedAt + (item?.ttl_seconds ?? 0) * 1000 > now,
      ),
    [now, query.data, query.dataUpdatedAt],
  );

  useEffect(() => {
    if (activeReserves.length === 0) return;
    const nextDeadline = Math.min(
      ...activeReserves.map(
        (item) => query.dataUpdatedAt + (item?.ttl_seconds ?? 0) * 1000,
      ),
    );
    const timer = setTimeout(
      () => setNow(Date.now()),
      Math.max(nextDeadline - Date.now(), 0) + 100,
    );
    return () => clearTimeout(timer);
  }, [activeReserves, query.dataUpdatedAt]);

  return { ...query, activeReserves };
};
