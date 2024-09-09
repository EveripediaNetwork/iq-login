import { useDisconnect, useWalletClient } from "wagmi";
import { sign, verify } from "@everipedia/web3-signer";
import { create } from "zustand";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { useWeb3Auth } from "../../components/Web3AuthProvider";
import type { UserInfo } from "@web3auth/base";
import { useMutation } from "@tanstack/react-query";
import type { GetWalletClientReturnType } from "@wagmi/core";
import { useEffect } from "react";

export const useTokenStore = create<{
	token: string | null;
	setToken: (token: string | null) => void;
}>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
}));

const USER_TOKEN = "USER_TOKEN";

export const useAuth = () => {
	const { token, setToken } = useTokenStore((state) => state);
	const { data: walletClient } = useWalletClient();
	const { user: web3AuthUser } = useWeb3Auth();

	const disconnectMutation = useDisconnect({
		mutation: {
			onSuccess: () => {
				deleteCookie(USER_TOKEN);
				setToken(null);
			},
		},
	});

	const signTokenMutation = useMutation({
		mutationFn: async () =>
			(await fetchStoredToken()) ?? (await generateNewToken(walletClient)),
		onSuccess: (newToken) => {
			setToken(newToken);
		},
	});

	const reSignTokenMutation = useMutation({
		mutationFn: async () => await generateNewToken(walletClient),
		onSuccess: (newToken) => {
			setToken(newToken);
		},
	});

	useEffect(() => {
		if (!token) {
			signTokenMutation.mutate();
		}
	}, [token, signTokenMutation.mutate]);

	return {
		token,
		loading:
			signTokenMutation.isPending ||
			reSignTokenMutation.isPending ||
			disconnectMutation.isPending,
		error:
			signTokenMutation.error ||
			reSignTokenMutation.error ||
			disconnectMutation.error,
		web3AuthUser: web3AuthUser as Partial<UserInfo> | null,
		signToken: () => signTokenMutation.mutate(),
		reSignToken: () => reSignTokenMutation.mutate(),
		logout: () => disconnectMutation.disconnect(),
	};
};

async function generateNewToken(walletClient?: GetWalletClientReturnType) {
	if (!walletClient) {
		throw new Error("Wallet client not available");
	}
	const freshToken = await sign(
		(msg) => walletClient.signMessage({ message: msg }),
		{
			statement:
				"Welcome to IQ.wiki ! Click to sign in and accept the IQ.wiki Terms of Service. This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 1 year. ",
			expires_in: "1y",
		},
	);
	setCookie(USER_TOKEN, freshToken, { maxAge: 60 * 60 * 24 * 365 });
	return freshToken;
}

async function fetchStoredToken() {
	const storedToken = getCookie(USER_TOKEN) as string;
	if (storedToken) {
		const { address, body } = await verify(storedToken);
		if (address && body) {
			return storedToken;
		}
	}
	deleteCookie(USER_TOKEN);
	return null;
}
