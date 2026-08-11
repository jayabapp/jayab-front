"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/api_services/common/get-query-client";
import { useStoreQuery } from "@/store";

import MainWrapper from "../utils/MainWrapper";

interface Layout {
  children: ReactNode;
  modal: ReactNode;
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
      <MainWrapper>
        {props?.children}
        {props?.modal}
      </MainWrapper>
    </QueryClientProvider>
  );
};
export default LayoutProvider;
