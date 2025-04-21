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
		clientId: WEB_3_AUTH_CLIENT_ID,
		privateKeyProvider: new Web3AuthEthereumProvider.EthereumPrivateKeyProvider(
			{
				config: { chainConfig },
			},
		),
		web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
	});
};

export function getWagmiConfig(
	chains: [Chain, ...Chain[]] = [mainnet],
): Config {
	const transports = Object.fromEntries(
		chains.map((chain) => [chain.id, http()]),
	);

	// TODO: checkout https://web3auth.io/community/t/how-to-switchchain-using-wagmi-connectors/6488
	// to implement proper chain switching to web3auth
	const web3AuthInstance = createWeb3AuthInstance(chains[0]);

	return createConfig({
		chains,
		transports,
		connectors: [
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
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		multiInjectedProviderDiscovery: false,
	});
}
