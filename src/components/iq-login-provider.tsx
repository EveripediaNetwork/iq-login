import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import {
	cookieStorage,
	cookieToInitialState,
	createStorage,
	WagmiProvider,
	createConfig,
	http,
} from "wagmi";
import type { Chain } from "wagmi/chains";
import { createWeb3AuthInstance } from "../lib/integrations/web3-auth-connector";
import { Web3AuthProvider } from "./web3-auth-provider";
import { injected, metaMask } from "wagmi/connectors";
import { createContext } from "react";

interface IqLoginProviderProps {
	children: React.ReactNode;
	cookie?: string;
	chain: Chain;
	walletConnectProjectId: string;
	web3AuthProjectId: string;
	projectName: string;
}

export const ProjectContext = createContext<string>("");

export function IqLoginProvider({
	children,
	cookie,
	chain,
	web3AuthProjectId,
	projectName,
}: IqLoginProviderProps) {
	const queryClient = getQueryClient();
	const web3AuthInstance = createWeb3AuthInstance(chain, web3AuthProjectId);

	const config = createConfig({
		chains: [chain],
		transports: {
			[chain.id]: http(),
		},
		connectors: [
			Web3AuthConnector({ web3AuthInstance }),
			injected(),
			metaMask(),
		],
		storage: createStorage({
			key: `wagmi-store-${projectName}`,
			storage: cookieStorage,
		}),
	});

	const initialStates = cookieToInitialState(config, cookie);

	return (
		<ProjectContext.Provider value={projectName}>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config} initialState={initialStates}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</WagmiProvider>
			</QueryClientProvider>
		</ProjectContext.Provider>
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
