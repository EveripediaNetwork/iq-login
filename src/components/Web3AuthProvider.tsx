import type { UserInfo } from "@web3auth/base";
import type { Web3Auth } from "@web3auth/modal";
import { createContext, useContext, useEffect, useState } from "react";

const Web3AuthContext = createContext<{
	web3Auth: Web3Auth | null;
	user: Partial<UserInfo> | null;
}>({ web3Auth: null, user: null });

export function Web3AuthProvider({
	children,
	web3AuthInstance,
}: {
	children: React.ReactNode;
	web3AuthInstance: Web3Auth;
}) {
	const [user, setUser] = useState<Partial<UserInfo> | null>(null);

	useEffect(() => {
		web3AuthInstance.on("connected", async () => {
			setUser(await web3AuthInstance.getUserInfo());
		});

		web3AuthInstance.on("disconnected", () => {
			setUser(null);
		});
	}, [web3AuthInstance]);

	return (
		<Web3AuthContext.Provider value={{ web3Auth: web3AuthInstance, user }}>
			{children}
		</Web3AuthContext.Provider>
	);
}

export function useWeb3Auth() {
	return useContext(Web3AuthContext);
}
