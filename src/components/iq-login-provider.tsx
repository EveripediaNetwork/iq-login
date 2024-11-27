import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import type { Chain } from "wagmi/chains";
import { iqWikiTheme } from "../lib/data/rainbow-kit-theme";
import {
	createWeb3AuthInstance,
	rainbowWeb3AuthConnector,
} from "../lib/integrations/web3-auth-connector";
import { Web3AuthProvider } from "./web3-auth-provider";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

interface IqLoginProviderProps {
	children: React.ReactNode;
	cookie?: string;
	chain: Chain;
	walletConnectProjectId: string;
	web3AuthProjectId: string;
}

export function IqLoginProvider({
	children,
	cookie,
	chain,
	walletConnectProjectId,
	web3AuthProjectId,
}: IqLoginProviderProps) {
	const queryClient = getQueryClient();
	const web3AuthInstance = createWeb3AuthInstance(chain, web3AuthProjectId);

	const config = getDefaultConfig({
		appName: "IQ.wiki",
		projectId: walletConnectProjectId,
		chains: [chain],
		wallets: [
			{
				groupName: "Recommended",
				wallets: [
					() => rainbowWeb3AuthConnector({ web3AuthInstance }),
					metaMaskWallet,
				],
			},
		],
		multiInjectedProviderDiscovery: false,
		ssr: true,
	});

	const initialStates = cookieToInitialState(config, cookie);

	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={config} initialState={initialStates}>
				<RainbowKitProvider theme={iqWikiTheme}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</RainbowKitProvider>
			</WagmiProvider>
		</QueryClientProvider>
	);
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				structuralSharing,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
