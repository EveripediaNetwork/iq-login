"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { structuralSharing } from "@wagmi/core/query";
import type React from "react";
import { createContext, useMemo } from "react";
import { type Chain, mainnet } from "viem/chains";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import {
	createWeb3AuthInstance,
	getWagmiConfig,
} from "../lib/integrations/wagmi.config";
import { Web3AuthProvider } from "./web3-auth-provider";

interface IqLoginProviderProps {
	projectName: string;
	cookie?: string | null;
	chains?: [Chain, ...Chain[]];
	disableAuth?: boolean;
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
	chains = [mainnet],
}: React.PropsWithChildren<IqLoginProviderProps>) {
	const web3AuthInstance = useMemo(
		() => createWeb3AuthInstance(chains[0]),
		[chains],
	);

	const wagmiConfig = useMemo(() => getWagmiConfig(chains), [chains]);

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
