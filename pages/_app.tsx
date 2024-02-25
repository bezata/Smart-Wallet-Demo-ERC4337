import type { AppProps } from "next/app";
import "../styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId="619252691dc2f6e9455011db2b2614fe"
      activeChain={activeChain}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
