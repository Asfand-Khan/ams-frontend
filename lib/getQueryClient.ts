import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 mins: avoid refetching too often
        gcTime: 1000 * 60 * 10, // 10 mins: unused data stays cached
        retry: 2, // retry 2 times on failure
        refetchOnWindowFocus: true, // auto-refetch on tab focus
        refetchOnReconnect: true, // auto-refetch after internet disconnect
        refetchIntervalInBackground: false, // don’t poll in background tabs
      },
      mutations: {
        retry: 1, // retry once on mutation failure
        onError: (error) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });
};
