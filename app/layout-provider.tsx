"use client";
import { useStoreQuery } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
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
            gcTime: 0,
            staleTime: 0,
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
