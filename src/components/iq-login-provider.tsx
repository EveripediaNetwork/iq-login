import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import type React from "react";
import {
	cookieStorage,
	cookieToInitialState,
	createStorage,
	WagmiProvider,
	createConfig,
	http,
} from "wagmi";
import { fraxtal, type Chain } from "wagmi/chains";
import { Web3AuthProvider } from "./web3-auth-provider";
import { injected, metaMask } from "wagmi/connectors";
import { createContext } from "react";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { web3AuthInstance } from "../lib/integrations/web3-auth-connector";

interface IqLoginProviderProps {
	children: React.ReactNode;
	cookie?: string;
	projectName: string;
}

export const ProjectContext = createContext<string>("");

const queryClient = new QueryClient();

const config = createConfig({
	chains: [fraxtal],
	transports: {
		[fraxtal.id]: http(),
	},

	connectors: [Web3AuthConnector({ web3AuthInstance }), injected(), metaMask()],
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	multiInjectedProviderDiscovery: false,
});

export function IqLoginProvider({
	children,
	cookie,
	projectName,
}: IqLoginProviderProps) {
	const initialStates = cookieToInitialState(config, cookie);

	return (
		<ProjectContext.Provider value={projectName}>
			<WagmiProvider config={config} initialState={initialStates}>
				<QueryClientProvider client={queryClient}>
					<Web3AuthProvider web3AuthInstance={web3AuthInstance}>
						{children}
					</Web3AuthProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</ProjectContext.Provider>
	);
}
