import * as Web3AuthBase from "@web3auth/base";
import * as Web3AuthEthereumProvider from "@web3auth/ethereum-provider";
import * as Web3AuthModal from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { type Chain, mainnet } from "viem/chains";
import {
	type Config,
	cookieStorage,
	createConfig,
	createStorage,
	http,
} from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string;
const walletConnectProjectId = process.env
	.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

if (!walletConnectProjectId) {
	throw new Error(
		"NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable is required",
	);
}

if (!web3AuthClientId) {
	throw new Error(
		"NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID environment variable is required",
	);
}

// Create Web3Auth instance for a specific chain
export const createWeb3AuthInstance = (chain: Chain) => {
	const chainConfig = {
		chainNamespace: Web3AuthBase.CHAIN_NAMESPACES.EIP155,
		chainId: `0x${chain.id.toString(16)}`,
		rpcTarget: chain.rpcUrls.default.http[0],
		displayName: chain.name,
		tickerName: chain.nativeCurrency?.name,
		ticker: chain.nativeCurrency?.symbol,
		blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
	};

	return new Web3AuthModal.Web3Auth({
		clientId: web3AuthClientId,
		privateKeyProvider: new Web3AuthEthereumProvider.EthereumPrivateKeyProvider(
			{
				config: { chainConfig },
			},
		),
		web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
	});
};

// Get Wagmi config with support for multiple chains
export function getWagmiConfig(
	chains: [Chain, ...Chain[]] = [mainnet],
): Config {
	const transports: Record<number, ReturnType<typeof http>> = {};
	for (const chain of chains) {
		transports[chain.id] = http();
	}

	// Get the default chain (first in the array)
	const defaultChain = chains[0];

	// Create Web3Auth instance for the default chain
	const web3AuthInstance = createWeb3AuthInstance(defaultChain);

	return createConfig({
		chains,
		transports,
		connectors: [
			injected(),
			walletConnect({
				projectId: walletConnectProjectId,
				metadata: {
					name: "IQ Login",
					description: "IQ Login with Web3Auth and WalletConnect",
					url: "https://iq.wiki",
					icons: ["https://iq.wiki/favicon.ico"],
				},
			}),
			Web3AuthConnector({ web3AuthInstance }),
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		multiInjectedProviderDiscovery: false,
	});
}
