"use client";

import { propertyQuoteOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

import type { QuoteStay } from "@features/properties/api/property.options";

export const usePropertyQuote = (id: number | string, stay: QuoteStay) =>
  useQuery(propertyQuoteOptions(id, stay));
