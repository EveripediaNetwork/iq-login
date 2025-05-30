import { sign, verify } from "@everipedia/web3-signer";
import { useMutation } from "@tanstack/react-query";
import type { GetWalletClientReturnType } from "@wagmi/core";
import type { UserInfo } from "@web3auth/base";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";
import { useDisconnect, useWalletClient } from "wagmi";
import { create } from "zustand";
import { useWeb3Auth } from "./use-web-3-auth";
import { AUTH_TOKEN_KEY } from "../server/constants";
import { useProject } from "./use-project";

export const useTokenStore = create<{
	token: string | null;
	setToken: (token: string | null) => void;
}>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
}));

export const useAuth = () => {
	const { token, setToken } = useTokenStore((state) => state);
	const { data: walletClient } = useWalletClient();
	const { user: web3AuthUser } = useWeb3Auth();
	const { disableAuth, projectName } = useProject();

	const disconnectMutation = useDisconnect({
		mutation: {
			onSuccess: () => {
				deleteCookie(AUTH_TOKEN_KEY);
				setToken(null);
			},
		},
	});

	const signTokenMutation = useMutation({
		mutationFn: async () =>
			(await fetchStoredToken()) ??
			(await generateNewToken(projectName, walletClient)),
		onSuccess: (newToken) => {
			setToken(newToken);
		},
	});

	const reSignTokenMutation = useMutation({
		mutationFn: async () => await generateNewToken(projectName, walletClient),
		onSuccess: (newToken) => {
			setToken(newToken);
		},
	});

	useEffect(() => {
		if (!token && !disableAuth) {
			signTokenMutation.mutate();
		}
	}, [token, signTokenMutation.mutate, disableAuth]);

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
		disableAuth,
	};
};

async function generateNewToken(
	projectName: string,
	walletClient?: GetWalletClientReturnType,
) {
	if (!walletClient) {
		throw new Error("Wallet client not available");
	}
	const freshToken = await sign(
		(msg) => walletClient.signMessage({ message: msg }),
		{
			statement: `Welcome to ${projectName}! Click to sign in and accept the ${projectName} Terms of Service. This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 1 year.`,
			expires_in: "1y",
		},
	);
	setCookie(AUTH_TOKEN_KEY, freshToken, {
		maxAge: 60 * 60 * 24 * 365,
	});
	return freshToken;
}

async function fetchStoredToken() {
	const storedToken = getCookie(AUTH_TOKEN_KEY) as string;
	if (storedToken) {
		const { address, body } = await verify(storedToken);
		if (address && body) {
			return storedToken;
		}
	}
	deleteCookie(AUTH_TOKEN_KEY);
	return null;
}
