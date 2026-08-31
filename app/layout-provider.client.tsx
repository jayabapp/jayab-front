"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/api_services/common/get-query-client";
import { useStoreQuery } from "@/store";

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => {
    useStoreQuery.setState({ client: queryClient });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default LayoutProvider;
