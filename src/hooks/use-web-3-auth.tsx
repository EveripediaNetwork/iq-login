import type { UserInfo } from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import type { Web3Auth } from "@web3auth/modal";
import { createContext, useContext, useEffect, useState } from "react";
import type { Chain } from "viem/chains";

export interface Web3AuthContextType {
	web3Auth: Web3Auth | null;
	user: Partial<UserInfo> | null;
	chains: Chain[];
}

const Web3AuthContext = createContext<Web3AuthContextType>({
	web3Auth: null,
	user: null,
	chains: [],
});

export function Web3AuthProvider({
	children,
	web3AuthInstance,
	chains,
}: {
	children: React.ReactNode;
	web3AuthInstance: Web3Auth | null;
	chains: Chain[];
}) {
	const [user, setUser] = useState<Partial<UserInfo> | null>(null);
	const [chainsAdded, setChainsAdded] = useState(false);

	useEffect(() => {
		if (!web3AuthInstance) {
			return;
		}

		web3AuthInstance.on("connected", async () => {
			setUser(await web3AuthInstance.getUserInfo());

			// Add additional chains after the wallet is connected
			if (!chainsAdded && chains.length > 1) {
				try {
					// Skip the first chain as it's already configured
					for (let i = 1; i < chains.length; i++) {
						const chain = chains[i];
						const chainConfig = {
							chainNamespace: CHAIN_NAMESPACES.EIP155,
							chainId: `0x${chain.id.toString(16)}`,
							rpcTarget: chain.rpcUrls.default.http[0],
							displayName: chain.name,
							tickerName: chain.nativeCurrency?.name,
							ticker: chain.nativeCurrency?.symbol,
							blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
						};

						await web3AuthInstance.addChain(chainConfig);
					}
					setChainsAdded(true);
				} catch (error) {
					console.error("Failed to add chains:", error);
				}
			}
		});

		web3AuthInstance.on("disconnected", () => {
			setUser(null);
		});
	}, [web3AuthInstance, chains, chainsAdded]);

	return (
		<Web3AuthContext.Provider
			value={{ web3Auth: web3AuthInstance, user, chains }}
		>
			{children}
		</Web3AuthContext.Provider>
	);
}

export function useWeb3Auth() {
	return useContext(Web3AuthContext);
}
