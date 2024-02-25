import { createConfig, configureChains } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
  alchemyProvider({ apiKey: "eVC-zQXm_pLvhIE_rc58-w2156KgDsxA" })
);

export const configSetter = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});
