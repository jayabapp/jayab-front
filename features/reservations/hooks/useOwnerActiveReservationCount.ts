"use client";

import { ownerActiveReservationCountOptions } from "../api/reservation.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerActiveReservationCount = (enabled = true) =>
  useQuery(ownerActiveReservationCountOptions(enabled));
