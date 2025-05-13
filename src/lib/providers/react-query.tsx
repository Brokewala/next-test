"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
};

export default ReactQueryProvider