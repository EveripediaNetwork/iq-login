import * as Web3AuthBase from "@web3auth/base";
import * as Web3AuthEthereumProvider from "@web3auth/ethereum-provider";
import * as Web3AuthModal from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { type Chain, fraxtal, mainnet, polygon } from "viem/chains";
import {
	type Config,
	cookieStorage,
	createConfig,
	createStorage,
	http,
} from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { iqTestnet } from "../data/iq-testnet";

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) as number;
const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string;

if (!chainId) {
	throw new Error("NEXT_PUBLIC_CHAIN_ID environment variable is required");
}

if (!web3AuthClientId) {
	throw new Error(
		"NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID environment variable is required",
	);
}

export let chain: Chain;
switch (chainId) {
	case 1:
		chain = mainnet;
		break;
	case 252:
		chain = fraxtal;
		break;
	case 137:
		chain = polygon;
		break;
	case 313_377:
		chain = iqTestnet;
		break;

	default:
		chain = mainnet;
}

const chainConfig = {
	chainNamespace: Web3AuthBase.CHAIN_NAMESPACES.EIP155,
	chainId: `0x${chain.id.toString(16)}`,
	rpcTarget: chain.rpcUrls.default.http[0],
	displayName: chain.name,
	tickerName: chain.nativeCurrency?.name,
	ticker: chain.nativeCurrency?.symbol,
	blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
};

export const web3AuthInstance = new Web3AuthModal.Web3Auth({
	clientId: web3AuthClientId,
	privateKeyProvider: new Web3AuthEthereumProvider.EthereumPrivateKeyProvider({
		config: { chainConfig },
	}),
	web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
});

export const wagmiConfig: Config = createConfig({
	chains: [chain],
	transports: {
		[chain.id]: http(),
	},
	connectors: [Web3AuthConnector({ web3AuthInstance }), injected(), metaMask()],
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	multiInjectedProviderDiscovery: false,
});
