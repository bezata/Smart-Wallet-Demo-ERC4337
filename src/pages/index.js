"use client";
import { useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  useNetwork,
  useBalance,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import ParticleAuth from "../utils/particleConnector";
import abi from "./api/nft.abi.json";
import Link from "next/link";
import BiconomyAuth from "../utils/biconomyAuth.tsx";
import { useBiconomy } from "../context/BiconomyContext";


export default function Home() {
  const { saAddress, userBalance } = useBiconomy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nftABI = abi;
  const { address, connector: activeConnector, isConnected } = useAccount();

  const { data } = useBalance({
    address: address,
  });

  const { chain } = useNetwork();
  const { config: nft, error } = usePrepareContractWrite({
    address: "0xC41D690A47a8D71cdf7b644C6879d3492B486dde",
    abi: nftABI,
    functionName: "mint",
    args: [1],
  });

  const { data: hash, write: mintNFT, isSuccess } = useContractWrite(nft);

  return (
    <div
      className="bg-blue-100 min-h-screen flex flex-col items-center justify-center ]"
      style={{
        backgroundImage: `url(/bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="fixed flex items-center gap-5 right-7  top-0">
        <BiconomyAuth></BiconomyAuth>

        <button
          className="m-2 px-4 py-3 text-black bg-white  font-bold border-l-gray-800 shadow-md shadow-black"
          onClick={() => setIsModalOpen(true)}
        >
          {" "}
          {address?.toString() ? "Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* BIOS User Info Window */}
      <div className="bg-white p-8 border-2 border-l-gray-800 shadow-xl  text-black">
        <h2 className="text-lg font-bold mb-3 text-center shadow-black shadow-md border-l-gray-800">
          User Info
        </h2>
        <p>
          Address:{" "}
          {address
            ? address?.toString()
            : saAddress?.toString() || "Not Connected"}
        </p>

        <p>
          Chain:{" "}
          {chain?.formatted
            ? chain?.formatted.toString()
            : "Sepolia" || "Not Connected"}
        </p>

        <p>
          Balance:{" "}
          {data
            ? `${data?.formatted.toString()} ${data?.symbol.toString()}`
            : `${userBalance?.formatted.toString()} ${userBalance?.symbol.toString()}` ||
              "Not Connected"}
        </p>

        <div className="flex justify-center mt-2">
          <button
            className="px-4 py-2 bg-white text-black border-l-black font-bold shadow-md shadow-black"
            onClick={() => mintNFT?.()}
          >
            Mint NFT
          </button>
        </div>
        <div className="flex justify-center mt-2">
          {isSuccess ? (
            <Link
              className="text-sm"
              href={`https://sepolia.etherscan.io/tx/${hash?.hash}`}
            >
              {hash?.hash.toString()}
            </Link>
          ) : (
            <p></p>
          )}
        </div>
      </div>
      {/* Modal Window */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white gap-3 text-black p-4 border-2 border-l-gray-800 shadow-lg">
            <DynamicWidget />
            <ParticleAuth />

            <div className="flex justify-center mt-2">
              <button
                className="px-4 py-2 bg-white text-black border-l-black font-bold shadow-md shadow-black"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
