"use client";
import { useStoreQuery } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import MainWrapper from "../utils/MainWrapper";
interface Layout {
  children: ReactNode;
  modal: ReactNode;
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
    <QueryClientProvider client={client}>
      {/* <Suspense fallback={<></>}> */}
      <MainWrapper>
        {" "}
        {props?.children}
        {props?.modal}
      </MainWrapper>
      {/* </Suspense> */}
    </QueryClientProvider>
  );
};
export default LayoutProvider;
