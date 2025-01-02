"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import { createContext, useState } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import {
	getWagmiConfig,
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

	const initialStates = cookieToInitialState(wagmiConfig, cookie);

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
