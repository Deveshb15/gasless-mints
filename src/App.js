import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSigner, useContract } from "wagmi";
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract/contractDetails";

function App() {
	const [biconomy, setBiconomy] = useState(null);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);

	const { address } = useAccount();

	const initBiconomy = async (ethereum) => {
		const biconomy = new Biconomy(ethereum, {
			apiKey: process.env.REACT_APP_BICONOMY_API_KEY,
			debug: true,
			contractAddresses: [CONTRACT_ADDRESS],
		});
		await biconomy.init();
		setBiconomy(biconomy);
	};

	useEffect(() => {
		let { ethereum } = window;
		if (ethereum) {
			initBiconomy(ethereum);
		}
	}, []);

	// console.log("BICONOMY ", biconomy);

	const mintNft = async () => {
		setLoading(true);
		try {
			if (biconomy) {
				let provider = await biconomy.provider;
				const contractInstance = new ethers.Contract(
					CONTRACT_ADDRESS,
					CONTRACT_ABI,
					biconomy.ethersProvider
				);
				//   console.log("CONTRACT ", contractInstance)
				const { data } = await contractInstance.populateTransaction.safeMint(
					address
				);
				const txParams = {
					from: address,
					to: CONTRACT_ADDRESS,
					data: data,
					signatureType: "EIP712_SIGN",
				};

				let txHash = await provider.send("eth_sendTransaction", [txParams]);
				console.log("Txn Hash ", txHash)
				
				biconomy.on("txMined", async (data) => {
					console.log(data);
					console.log(`tx mined ${data.hash}`);
					let receipt = data?.receipt;
					let logs = receipt?.logs;
					let topics = logs[0]?.topics;
					let bigToken = topics[topics?.length - 1];
					let tokenId = ethers.BigNumber.from(bigToken.toString());
					console.log(tokenId.toString());
					setToken(tokenId.toString());
					setLoading(false);
				});
			}
			// const mint = await contract.safeMint(address)
			// await mint.wait()
			// console.log(mint)
		} catch (error) {
			console.log(error);
		}
	};

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
				{token && (
					<a
						href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${token}`}
						target="_blank"
						rel="noreferrer"
						className="text-lg font-bold text-gray-400"
					>
						Checkout on Opensea
					</a>
				)}
			</div>
		</div>
	);
}

export default App;
