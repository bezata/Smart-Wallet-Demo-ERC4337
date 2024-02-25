import "../styles/globals.css";
import { configSetter } from "../utils/config";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { BiconomyProvider } from "../context/BiconomyContext";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={configSetter}>
        <DynamicContextProvider
          settings={{
            environmentId: "97cf9e0c-3110-4228-9c5f-868e2bf652b9",
            walletConnectors: [
              EthereumWalletConnectors,
              ZeroDevSmartWalletConnectors,
            ],
          }}
        >
          <DynamicWagmiConnector>
            <BiconomyProvider>
              <Component {...pageProps} />
            </BiconomyProvider>
          </DynamicWagmiConnector>
        </DynamicContextProvider>
      </WagmiConfig>{" "}
    </QueryClientProvider>
  );
}
