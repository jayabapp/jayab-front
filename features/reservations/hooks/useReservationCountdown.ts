"use client";

import { invalidateReservationCaches } from "@features/reservations/hooks/reservation-invalidation";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import moment from "moment-jalaali";

const ZERO = { minutes: "00", seconds: "00" };
const REFRESH_AFTER_EXPIRY_MS = 4000;

export const useReservationCountdown = (
  ttlSeconds: number | undefined,
  enabled: boolean,
) => {
  const client = useQueryClient();
  const [deadline] = useState(() =>
    moment()
      .add(ttlSeconds ?? 0, "seconds")
      .toString(),
  );
  const [timeLeft, setTimeLeft] = useState(ZERO);

  useEffect(() => {
    if (!enabled) return;

    let refreshTimer = 0;
    const interval = window.setInterval(() => {
      const next = calculateTimeLeft(deadline);
      setTimeLeft({ minutes: next.minutes, seconds: next.seconds });
      if (next.minutes !== "00" || next.seconds !== "00") return;
      window.clearInterval(interval);
      refreshTimer = window.setTimeout(
        () => void invalidateReservationCaches(client),
        REFRESH_AFTER_EXPIRY_MS,
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(refreshTimer);
    };
  }, [client, deadline, enabled]);

  return timeLeft;
};
