import "./App.css";
import bgImage from "./assets/bg.png";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useNetwork } from "wagmi";
import ParticleAuth from "./utils/particleConnector";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address } = useAccount();

  const { data } = useBalance({
    address: address,
  });

  const { chain } = useNetwork();

  return (
    <div
      className="bg-blue-100 min-h-screen flex flex-col items-center justify-center ]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="fixed top-0 right-40 ">
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
        <h2 className="text-lg font-bold text-center shadow-black shadow-md border-l-gray-800">
          User Info
        </h2>
        {address?.toString() ? (
          <p> Address : {address.toString()}</p>
        ) : (
          <p> Address: Not Connected</p>
        )}

        {chain?.toString() ? (
          <p> Connected Chain : {chain?.name.toString()}</p>
        ) : (
          <p> Connected Chain: Not Connected</p>
        )}
        {address?.toString() ? (
          <p>
            Balance: {data?.formatted} {data?.symbol}
          </p>
        ) : (
          <p> Balance: Not Connected</p>
        )}
      </div>
      {/* Modal Window */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-4 border-2 border-l-gray-800 shadow-lg">
            <h2 className="text-lg font-bold">Welcome,</h2>
            <ParticleAuth />
            <DynamicWidget />

            <button
              className="mt-2 px-4 py-2 right-80 bg-white text-black border-l-black font-bold shadow-md shadow-black"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
