import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";


const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // we dont want to retry the queries in the tests
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

export default AllProviders;
