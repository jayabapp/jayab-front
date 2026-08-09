"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { useStoreQuery } from "@/store";

import MainWrapper from "../utils/MainWrapper";

interface Layout {
  children: ReactNode;
  modal: ReactNode;
}

const LayoutProvider = (props: Layout) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: GC_TIME.DEFAULT,
            staleTime: STALE_TIME.DEFAULT,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    useStoreQuery.setState({
      client: queryClient,
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <MainWrapper>
        {props?.children}
        {props?.modal}
      </MainWrapper>
    </QueryClientProvider>
  );
};
export default LayoutProvider;
