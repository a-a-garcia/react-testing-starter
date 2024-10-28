import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../src/providers/CartProvider";

const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        // we dont want to retry the queries in the tests
        retry: false,
      },
    },
  });
  // organize from back to front
  // start with data layers, then to UI layers
  return (
    <QueryClientProvider client={client}>
      <CartProvider>
        <Theme>{children}</Theme>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default AllProviders;
