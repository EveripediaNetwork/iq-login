import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
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

const queryClient = new QueryClient();

export function IqLoginProvider({
	children,
	cookie,
	chain,
	web3AuthProjectId,
	projectName,
}: IqLoginProviderProps) {
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
		ssr: true,
		multiInjectedProviderDiscovery: false,
	});

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
