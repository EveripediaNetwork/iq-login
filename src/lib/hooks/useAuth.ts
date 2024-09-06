import React, { useCallback } from "react";
import { useWalletClient, useAccount } from "wagmi";
import { sign, verify } from "@everipedia/web3-signer";
import { create } from "zustand";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { useWeb3Auth } from "../../components/Web3AuthProvider";
import type { UserInfo } from "@web3auth/base";

export const useTokenStore = create<{
	token: string | null;
	setToken: (token: string | null) => void;
}>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
}));

/**
 * A custom React hook that provides authentication functionality for a web3 application.
 *
 * This hook manages the user's authentication token, which is stored in a cookie and used to verify the user's identity. It also provides methods to generate a new token and fetch the stored token.
 *
 * The hook uses the `wagmi` library to interact with the user's wallet, and the `web3-signer` library to sign and verify the authentication token.
 *
 * @returns An object containing the following properties:
 * - `token`: The user's authentication token, or `null` if no token is available.
 * - `loading`: A boolean indicating whether the hook is currently loading or generating a new token.
 * - `reSignToken`: A function that can be called to re-sign the user's token.
 * - `error`: An error message, if an error occurred during token generation or retrieval.
 * - `web3AuthUser`: The user's information from the `web3auth` library, or `null` if no user is available.
 */
export const useAuth = () => {
	const { token, setToken } = useTokenStore((state) => state);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>();
	const [isReSignToken, reSignToken] = React.useState<boolean>(false);
	const { data: walletClient } = useWalletClient();
	const { user: web3AuthUser } = useWeb3Auth();

	const generateNewTokenAndStore = useCallback(async () => {
		if (!walletClient) return;
		const freshToken = await sign(
			(msg) => walletClient.signMessage({ message: msg }),
			{
				statement:
					"Welcome to IQ.wiki ! Click to sign in and accept the IQ.wiki Terms of Service. This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 1 year. ",
				expires_in: "1y",
			},
		);
		setCookie("USER_TOKEN", freshToken, { maxAge: 60 * 60 * 24 * 365 });
		setToken(freshToken);
	}, [setToken, walletClient]);

	const fetchStoredToken = useCallback(async () => {
		const storedToken = getCookie("USER_TOKEN") as string;
		if (storedToken) {
			const { address, body } = await verify(storedToken);
			if (address && body) {
				setToken(storedToken);
			}
		} else {
			deleteCookie("USER_TOKEN");
			throw new Error("No stored token");
		}
	}, [setToken]);

	React.useEffect(() => {
		const retrieveWeb3Token = async () => {
			if (isReSignToken) setError("");
			else reSignToken(false);

			const generateNewToken = async () => {
				setLoading(true);
				try {
					await generateNewTokenAndStore();
				} catch (e) {
					setError(e as string);
				}
				setLoading(false);
			};

			try {
				await fetchStoredToken();
			} catch {
				await generateNewToken();
			}
		};
		retrieveWeb3Token();
	}, [isReSignToken, generateNewTokenAndStore, fetchStoredToken]);

	return {
		token,
		loading,
		reSignToken,
		error,
		web3AuthUser: web3AuthUser as Partial<UserInfo> | null, // For some reason, we are getting inference error from web3auth library, so we are casting explicitly
	};
};
