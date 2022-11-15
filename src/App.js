import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSigner, useContract } from "wagmi";
import axios from 'axios'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract/contractDetails";

function App() {
	const [loading, setLoading] = useState(false);

	const { address } = useAccount();
	const { data } = useSigner();
	const contract = useContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		signerOrProvider: data,
	});

	console.log(contract);

	const mintNft = async () => {
		setLoading(true);
		try {
			// const mint = await contract.safeMint(address);
			const { data } = await contract.populateTransaction.safeMint(address);
			const response = await axios.post('http://localhost:9000/sendtxn', {
				data,
				address
			})
			const respData =response.data
			console.log(respData)
			// await mint.wait();
			// console.log(mint);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	// const mintDef = async () => {
	// 	const relayer = new Relayer({
	// 		apiKey: "8YfVM6sd95NNsD4cpQKESFQfG15Aws2Y",
	// 		apiSecret:
	// 			"3upJ9MsGEv9gHitxFdsNC3je9irmZuemVcTELeBsnuC1daAy6dXn9KuX7uor3sif",
	// 	});

	// 	const { data } = await contract.populateTransaction.safeMint(address);
	// 	const tx = await relayer.sendTransaction({
	// 		from: address,
	// 		to: CONTRACT_ADDRESS,
	// 		data: data,
	// 		speed: "fast",
	// 	});
	// 	try {
	// 		await tx.wait()
	// 		console.log("WAIT ", tx)
	// 	} catch(err) {
	// 		console.log(err)
	// 	}
	// 	console.log("TXN ", tx)
	// };

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="mb-2 text-4xl font-extrabold">Gasless mints biconomy</h1>
				<ConnectButton />
				{loading ? (
					<p className="text-xl font-bold">Loading...</p>
				) : (
					address && (
						<button
							onClick={mintNft}
							className="my-4 px-8 py-2.5 rounded-xl bg-white text-black font-bold transform hover:scale-105"
						>
							Mint
						</button>
					)
				)}
			</div>
		</div>
	);
}

export default App;
