import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ParticleAuthConnector, ParticleOptions } from "./particleAuth";

const particleOptions: ParticleOptions = {
  projectId: "8f47dae6-7d21-48f4-a50c-9876356fe00c",
  clientKey: "ctAiHIXyKVcgoDyoy3fCE2L29pU2He1xq9ZkuAwq",
  appId: "db133078-7209-4074-884d-0f3ae4ea2e30",
};
export default function ParticleAuth() {
  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new ParticleAuthConnector({
      options: particleOptions,
    }),
  });
  const { disconnect } = useDisconnect();

  return (
    <div>
      {address ? (
        <button
          className="m-2 px-6 py-4 text-black bg-white  font-bold border-l-gray-800 shadow-md shadow-black"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      ) : (
        <button
          className="m-1 px-1 py-2  rounded-md text-black text-md bg-white  font-bold border-l-gray-800 shadow-md shadow-black"
          onClick={() => connect()}
        >
          Connect with Particle
        </button>
      )}
    </div>
  );
}
