import * as Web3AuthBase from "@web3auth/base";
import * as Web3AuthEthereumProvider from "@web3auth/ethereum-provider";
import * as Web3AuthModal from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { type Chain, mainnet } from "viem/chains";
import {
	http,
	type Config,
	cookieStorage,
	createConfig,
	createStorage,
} from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

const WEB_3_AUTH_CLIENT_ID = process.env
	.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string;
const WALLET_CONNECT_PROJECT_ID = process.env
	.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

if (!WALLET_CONNECT_PROJECT_ID) {
	throw new Error(
		"NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable is required",
	);
}

if (!WEB_3_AUTH_CLIENT_ID) {
	throw new Error(
		"NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID environment variable is required",
	);
}

export interface IqLoginConfig {
	wagmiConfig: Config;
	web3AuthInstance: Web3AuthModal.Web3Auth;
	chains: [Chain, ...Chain[]];
}

export function createIqLoginConfig(
	chains: [Chain, ...Chain[]] = [mainnet],
): IqLoginConfig {
	const transports = Object.fromEntries(
		chains.map((chain) => [chain.id, http()]),
	);

	const web3AuthInstance = createWeb3AuthInstance(chains[0]);

	const connectors =
		typeof window !== "undefined"
			? [
					injected(),
					walletConnect({
						projectId: WALLET_CONNECT_PROJECT_ID,
						metadata: {
							name: "IQ Login",
							description: "IQ Login with Web3Auth and WalletConnect",
							url: "https://iq.wiki",
							icons: ["https://iq.wiki/favicon.ico"],
						},
					}),
					Web3AuthConnector({ web3AuthInstance }),
				]
			: [];

	const wagmiConfig = createConfig({
		chains,
		transports,
		connectors,
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		multiInjectedProviderDiscovery: false,
	});

	return {
		wagmiConfig,
		web3AuthInstance,
		chains,
	};
}

function createWeb3AuthInstance(defaultChain: Chain) {
	// Create the default chain config
	const chainConfig = {
		chainNamespace: Web3AuthBase.CHAIN_NAMESPACES.EIP155,
		chainId: `0x${defaultChain.id.toString(16)}`,
		rpcTarget: defaultChain.rpcUrls.default.http[0],
		displayName: defaultChain.name,
		tickerName: defaultChain.nativeCurrency?.name,
		ticker: defaultChain.nativeCurrency?.symbol,
		blockExplorerUrl: defaultChain.blockExplorers?.default.url[0] as string,
	};

	// Initialize Web3Auth with only the default chain
	return new Web3AuthModal.Web3Auth({
		clientId: WEB_3_AUTH_CLIENT_ID,
		privateKeyProvider: new Web3AuthEthereumProvider.EthereumPrivateKeyProvider(
			{
				config: { chainConfig },
			},
		),
		web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
	});
}
