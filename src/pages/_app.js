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
  const environmentIds = process.env.DYNAMICENVIOREMENTID;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={configSetter}>
        <DynamicContextProvider
          settings={{
            environmentId: ` ${environmentIds}`,
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
