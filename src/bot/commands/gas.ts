import axios from "axios";

export async function getGas() {
	const {data} = await axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`);
	return {
		"safeGas": data.result.SafeGasPrice,
		"proposeGas": data.result.ProposeGasPrice,
		"fastGas": data.result.FastGasPrice,
		"latestBlock": data.result.LastBlock
	};
}