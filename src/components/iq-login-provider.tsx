import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";
import { iqTestnet } from "../lib/data/iq-testnet";
import { iqWikiTheme } from "../lib/data/rainbow-kit-theme";
import {
	rainbowWeb3AuthConnector,
	createWeb3AuthInstance,
} from "../lib/integrations/web3-auth-connector";
import { structuralSharing } from "@wagmi/core/query";
import { Web3AuthProvider } from "./web3-auth-provider";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
	throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set");
}
if (!process.env.NEXT_PUBLIC_IS_PRODUCTION) {
	console.log("NEXT_PUBLIC_IS_PRODUCTION is not set");
}

const chain =
	process.env.NEXT_PUBLIC_IS_PRODUCTION === "true" ? polygon : iqTestnet;
const web3AuthInstance = createWeb3AuthInstance(chain);

export const defaultConfig = getDefaultConfig({
	appName: "IQ.wiki",
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
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

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
				structuralSharing,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient();
	}
	// Browser: make a new query client if we don't already have one
	// This is very important so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export function IqLoginProvider({
	children,
	cookie,
}: {
	children: React.ReactNode;
	cookie?: string;
}) {
	const queryClient = getQueryClient();
	const initialStates = cookieToInitialState(defaultConfig, cookie);

	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={defaultConfig} initialState={initialStates}>
				<RainbowKitProvider theme={iqWikiTheme}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</RainbowKitProvider>
			</WagmiProvider>
		</QueryClientProvider>
	);
}
