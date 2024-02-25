import { useState, useEffect } from "react";
import {
  Address,
  createWalletClient,
  custom,
  WalletClient,
  encodeFunctionData,
} from "viem";
import { baseGoerli } from "viem/chains";
import "viem/window";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { ChainId } from "@biconomy/core-types";
import { getNetwork } from "@wagmi/core";
import {
  IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { WalletClientSigner } from "@alchemy/aa-core";
import abi from "../utils/abi.json";
import { useBalance } from "wagmi";
import { useBiconomy } from "../context/BiconomyContext";

export default function BiconomyAuth() {
  const { setSmartAddress, setUserBalance } = useBiconomy();
  const [saAddress, setSaAddress] = useState<string>();
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const [smartAccount, setSmartAccount] = useState<
    BiconomySmartAccountV2 | undefined
  >();

  const bundler: IBundler = new Bundler({
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const {
    data: userBalances,
    isError,
    isLoading,
  } = useBalance({
    address: `${saAddress}`,
  });
  setUserBalance(userBalances);
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/84531/TEgx1utKj.b8e621dd-6ba8-4ab4-b9e6-877708f278c8",
  });

  const connect = async () => {
    if (!window.ethereum) return;
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const client = createWalletClient({
      account,
      chain: baseGoerli,
      transport: custom(window.ethereum),
    });
    setWalletClient(client);
  };

  const createSmartAccount = async () => {
    if (!walletClient) return;
    const signer = new WalletClientSigner(walletClient, "json-rpc");
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: signer,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
    });

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.BASE_GOERLI_TESTNET,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: ownerShipModule,
      activeValidationModule: ownerShipModule,
    });

    const address = await biconomySmartAccount.getAccountAddress();
    setSaAddress(address);
    setSmartAddress(address);
    setSmartAccount(biconomySmartAccount);
  };

  const mintNFT = async () => {
    try {
      const data = encodeFunctionData({
        abi: abi.abi,
        functionName: "safeMint",
        args: [saAddress],
      });

      const tx1 = {
        to: "0x0a7755bDfb86109D9D403005741b415765EAf1Bc",
        data: data,
      };

      let userOp = await smartAccount?.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster =
        smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };

      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount?.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {walletClient ? (
        <>
          <button
            className="m-2 px-4 py-3 text-black bg-white  font-bold border-l-gray-800 shadow-md shadow-black"
            onClick={createSmartAccount}
          >
            {saAddress ? "Smart Account Active" : "Create Smart Account"}
          </button>
        </>
      ) : (
        <button
          className="m-2 px-4 py-3 text-black bg-white  font-bold border-l-gray-800 shadow-md shadow-black"
          onClick={connect}
        >
          Smart Wallet
        </button>
      )}
    </div>
  );
}
