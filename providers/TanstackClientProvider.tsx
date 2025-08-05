"use client";
import { getQueryClient } from "@/lib/getQueryClient";
import { DehydratedState, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRef } from "react";

const TanstackQueryProvider = ({
  children,
  dehydratedState
}: {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}) => {

  const queryClient = useRef(getQueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default TanstackQueryProvider;