"use client";

import { dirOf, resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useDir = () => dirOf(resolveLocale(useLocale()));
