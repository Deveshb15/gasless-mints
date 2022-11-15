const express = require('express')
const cors = require('cors')
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');
const { Relayer } = require('defender-relay-client')
const { ethers } = require('ethers');
const bodyParser = require("body-parser");

const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('./contractDetails')

const app = express()

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post('/sendtxn', async(req, res) => {
    console.log(req.body)
    const { data, address } = req.body
    try {
        const credentials = { apiKey: "8YfVM6sd95NNsD4cpQKESFQfG15Aws2Y", apiSecret: "3upJ9MsGEv9gHitxFdsNC3je9irmZuemVcTELeBsnuC1daAy6dXn9KuX7uor3sif" };
        // const provider = new DefenderRelayProvider(credentials);
        // const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });

        // const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        // const tx = await contract.safeMint(address)
        // console.log(tx)
        const relayer = new Relayer(credentials);
        const tx = await relayer.sendTransaction({
			from: address,
			to: CONTRACT_ADDRESS,
			data: data,
            gasLimit: 1000000,
			speed: "fast",
		});
        console.log(tx)
        const mined = await tx.wait()
        console.log(mined)

        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false })
    }
})

app.listen(9000, () => {
    console.log("Server started")
})