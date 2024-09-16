import { getCookie, deleteCookie } from "cookies-next";
import { verify } from "@everipedia/web3-signer";
import { AUTH_TOKEN_KEY } from "./constants";

export const getAuth = async () => {
	const token = getCookie(AUTH_TOKEN_KEY) as string | undefined;
	let address: string | null = null;

	if (token) {
		try {
			const result = await verify(token);
			address = result.address;
		} catch (error) {
			console.error("Error verifying token:", error);
			deleteCookie(AUTH_TOKEN_KEY);
		}
	}

	return {
		token,
		address,
	};
};
