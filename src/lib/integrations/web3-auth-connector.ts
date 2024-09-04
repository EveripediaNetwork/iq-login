import type { Wallet } from "@rainbow-me/rainbowkit";
import * as Web3AuthBase from "@web3auth/base";
import * as Web3AuthEthereumProvider from "@web3auth/ethereum-provider";
import * as Web3AuthModal from "@web3auth/modal";
import * as Web3AuthWalletServicesPlugin from "@web3auth/wallet-services-plugin";
import * as Web3AuthWagmiConnector from "@web3auth/web3auth-wagmi-connector";
import type { Chain } from "viem";
import { createConnector } from "wagmi";

if (!process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID) {
	throw new Error("NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID is not set");
}

const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID;

export const rainbowWeb3AuthConnector = ({
	chain,
}: { chain: Chain }): Wallet => {
	const name = "Web3 Auth";

	console.log({
		Web3AuthBase,
		Web3AuthEthereumProvider,
		Web3AuthModal,
		Web3AuthWalletServicesPlugin,
		Web3AuthWagmiConnector,
	});

	const chainConfig = {
		chainNamespace: Web3AuthBase.CHAIN_NAMESPACES.EIP155,
		chainId: `0x${chain.id.toString(16)}`,
		rpcTarget: chain.rpcUrls.default.http[0],
		displayName: chain.name,
		tickerName: chain.nativeCurrency?.name,
		ticker: chain.nativeCurrency?.symbol,
		blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
	};

	const privateKeyProvider =
		new Web3AuthEthereumProvider.EthereumPrivateKeyProvider({
			config: { chainConfig },
		});

	const web3AuthInstance = new Web3AuthModal.Web3Auth({
		clientId,
		chainConfig,
		privateKeyProvider,
		uiConfig: {
			appName: name,
			loginMethodsOrder: ["google", "discord", "twitter"],
			defaultLanguage: "en",
			modalZIndex: "2147483647",
			logoLight: "https://web3auth.io/images/web3authlog.png",
			logoDark: "https://web3auth.io/images/web3authlogodark.png",
			uxMode: "redirect",
			mode: "auto",
			theme: {
				primary: "#f93493",
				onPrimary: "#ffffff",
			},
		},
		web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
		enableLogging: true,
	});

	const walletServicesPlugin =
		new Web3AuthWalletServicesPlugin.WalletServicesPlugin({
			walletInitOptions: {
				whiteLabel: {
					showWidgetButton: true,
				},
			},
		});

	web3AuthInstance.addPlugin(walletServicesPlugin);

	const modalConfig = {
		[Web3AuthBase.WALLET_ADAPTERS.OPENLOGIN]: {
			label: "openlogin",
			showOnModal: true,
		},
	};

	return {
		id: "web3-auth",
		name: "Web3 Auth",
		iconUrl: "https://favicon.twenty.com/web3auth.io",
		iconBackground: "#0364ff",

		createConnector: (walletDetails) => {
			const web3AuthConnector = Web3AuthWagmiConnector.Web3AuthConnector({
				web3AuthInstance,
				modalConfig,
			});

			return createConnector((config) => ({
				...walletDetails,
				...web3AuthConnector(config),
			}));
		},
	};
};
