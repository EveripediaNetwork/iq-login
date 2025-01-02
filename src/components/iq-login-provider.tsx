import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import { createContext } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import {
	wagmiConfig,
	web3AuthInstance,
} from "../lib/integrations/wagmi.config";
import { Web3AuthProvider } from "./web3-auth-provider";

interface IqLoginProviderProps {
	children: React.ReactNode;
	cookie?: string;
	projectName: string;
}

export const ProjectContext = createContext<string>("");

export function IqLoginProvider({
	children,
	cookie,
	projectName,
}: IqLoginProviderProps) {
	const initialStates = cookieToInitialState(wagmiConfig, cookie);
	const queryClient = getQueryClient();

	return (
		<ProjectContext.Provider value={projectName}>
			<WagmiProvider config={wagmiConfig} initialState={initialStates}>
				<QueryClientProvider client={queryClient}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</QueryClientProvider>
			</WagmiProvider>
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
