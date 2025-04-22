import { type Chain, fraxtal, mainnet } from "viem/chains";
import { iqTestnet } from "./iq-testnet";

export const getChainConfig = (chainId: number): Chain => {
	switch (chainId) {
		case 1:
			return mainnet;
		case 252:
			return fraxtal;
		case 313377:
			return iqTestnet;
		default:
			return mainnet;
	}
};

export const createChainConfig = (chain: Chain) => ({
	chainNamespace: "eip155",
	chainId: `0x${chain.id.toString(16)}`,
	rpcTarget: chain.rpcUrls.default.http[0],
	displayName: chain.name,
	tickerName: chain.nativeCurrency?.name,
	ticker: chain.nativeCurrency?.symbol,
	blockExplorerUrl: chain.blockExplorers?.default.url[0],
});
