"use client";

import { activeReservationOptions } from "../api/reservation.options";
import { useQuery } from "@tanstack/react-query";

export const useActiveReservation = () => useQuery(activeReservationOptions());
