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
	projectName: string;
	cookie?: string | null;
}

export const ProjectContext = createContext<{
	projectName: string;
	disableAuth: boolean;
}>({ projectName: "", disableAuth: false });

export function IqLoginProvider({
	children,
	cookie,
	projectName,
	disableAuth = false,
}: React.PropsWithChildren<IqLoginProviderProps & { disableAuth?: boolean }>) {
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

	const initialState = cookieToInitialState(wagmiConfig, cookie);

	return (
		<ProjectContext.Provider value={{ projectName, disableAuth }}>
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
