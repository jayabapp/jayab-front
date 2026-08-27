"use client";

import { userReservationsOptions } from "../api/reservation.options";
import { useQuery } from "@tanstack/react-query";

export const useUserReservations = (type = "active", enabled = true) =>
  useQuery({ ...userReservationsOptions(type), enabled });
