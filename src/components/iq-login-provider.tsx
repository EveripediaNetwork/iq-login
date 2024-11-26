import {
	getDefaultConfig,
	getDefaultWallets,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { polygon, type Chain } from "wagmi/chains";
import { iqTestnet } from "../lib/data/iq-testnet";
import { iqWikiTheme } from "../lib/data/rainbow-kit-theme";
import {
	rainbowWeb3AuthConnector,
	createWeb3AuthInstance,
} from "../lib/integrations/web3-auth-connector";
import { structuralSharing } from "@wagmi/core/query";
import { Web3AuthProvider } from "./web3-auth-provider";

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

export function IqLoginProvider({
	children,
	cookie,
	chain,
	web3AuthProjectId,
}: {
	children: React.ReactNode;
	cookie?: string;
	chain: Chain;
	web3AuthProjectId: string;
}) {
	const queryClient = getQueryClient();
	const web3AuthInstance = createWeb3AuthInstance(chain);

	const config = getDefaultConfig({
		appName: "IQ.wiki",
		projectId: web3AuthProjectId,
		chains: [chain],
		wallets: [
			...getDefaultWallets({
				appName: "IQ.wiki",
				projectId: web3AuthProjectId,
			}).wallets,
			{
				groupName: "More",
				wallets: [() => rainbowWeb3AuthConnector({ web3AuthInstance })],
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
