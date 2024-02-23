import { createConfig, configureChains } from "wagmi";
import {
  bsc,
  bscTestnet,
  polygon,
  avalanche,
  sepolia,
  arbitrum,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc, polygon, avalanche, arbitrum, bscTestnet, sepolia],
  [publicProvider()]
);
export const { connectors } = getDefaultWallets({
  appName: "Tulia",
  projectId: "b42b62d44f5b24e2c4e8ace22ae786ee",
  chains,
});
export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});
