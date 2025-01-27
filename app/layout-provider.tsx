"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MainWrapper from "../utils/MainWrapper";
import { useStoreQuery } from "@/store";
interface Layout {
  children: ReactNode;
  modal: ReactNode;
  params: { [key: string]: string };
}

const client = new QueryClient({
  defaultOptions: { queries: { gcTime: 0, staleTime: 0, refetchOnWindowFocus: false, retry: false } },
});

const LayoutProvider = (props: Layout) => {
  useEffect(() => {
    if (!!client) {
      useStoreQuery.setState({ client: client });
    }
  }, [client]);

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      {" "}
      <QueryClientProvider client={client}>
        <MainWrapper>
          {" "}
          <Suspense fallback={<></>}>
            {props?.children} {props?.modal}
          </Suspense>
        </MainWrapper>
      </QueryClientProvider>
    </AnimatePresence>
  );
};
export default LayoutProvider;
