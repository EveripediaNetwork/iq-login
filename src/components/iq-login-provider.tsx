"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import { createContext, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import {
	getWagmiConfig,
	web3AuthInstance,
} from "../lib/integrations/wagmi.config";
import { Web3AuthProvider } from "./web3-auth-provider";

interface IqLoginProviderProps {
	children: React.ReactNode;
	projectName: string;
	initialState?: State;
}

export const ProjectContext = createContext<string>("");

export function IqLoginProvider({
	children,
	initialState,
	projectName,
}: IqLoginProviderProps) {
	const [wagmiConfig] = useState(() => getWagmiConfig());
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						structuralSharing,
					},
				},
			}),
	);

	return (
		<ProjectContext.Provider value={projectName}>
			<WagmiProvider config={wagmiConfig} initialState={initialState}>
				<QueryClientProvider client={queryClient}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ProjectContext.Provider>
	);
}
