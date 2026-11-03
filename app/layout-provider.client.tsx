"use client";

import { ReactNode, useEffect, useState } from "react";
import { setBrowserTranslator } from "@lib/i18n/browser-translator";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/api_services/common/get-query-client";
import { useTranslations } from "next-intl";
import { ThemeProvider } from "@layouts/ThemeProvider";
import { useStoreQuery } from "@/store";

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations();
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => {
    setBrowserTranslator((key, values) => t(key as never, values as never));
  }, [t]);

  useEffect(() => {
    useStoreQuery.setState({ client: queryClient });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

export default LayoutProvider;
