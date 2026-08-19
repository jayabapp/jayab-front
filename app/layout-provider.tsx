"use client";

import {
  DehydratedState,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { makeQueryClient } from "@/api_services/common/get-query-client";
import { useStoreQuery } from "@/store";

import MainWrapper from "../utils/MainWrapper";

interface Layout {
  modal: ReactNode;
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

const LayoutProvider = (props: Layout) => {
  const [queryClient] = useState(makeQueryClient);

  useEffect(() => {
    useStoreQuery.setState({
      client: queryClient,
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={props?.dehydratedState}>
        <MainWrapper>
          {props?.children}
          {props?.modal}
        </MainWrapper>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};
export default LayoutProvider;
