"use client";
import React, { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import { useMemo } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import type { IqLoginConfig } from "../config/iq-login.config";
import { ProjectContext } from "../hooks/use-project";
import { Web3AuthProvider } from "../hooks/use-web-3-auth";

interface IqLoginProviderProps {
	projectName: string;
	cookie?: string | null;
	config: IqLoginConfig;
	disableAuth?: boolean;
}

export function IqLoginProvider({
	children,
	cookie,
	projectName,
	disableAuth = false,
	config,
}: PropsWithChildren<IqLoginProviderProps>) {
	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						structuralSharing,
					},
				},
			}),
		[],
	);

	const initialState = cookieToInitialState(config.wagmiConfig, cookie);

	return (
		<ProjectContext.Provider value={{ projectName, disableAuth }}>
			<WagmiProvider config={config.wagmiConfig} initialState={initialState}>
				<QueryClientProvider client={queryClient}>
					<Web3AuthProvider
						web3AuthInstance={config.web3AuthInstance}
						chains={config.chains}
					>
						{children}
					</Web3AuthProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ProjectContext.Provider>
	);
}
