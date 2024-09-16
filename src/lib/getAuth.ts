import { getCookie, deleteCookie } from "cookies-next";
import { verify } from "@everipedia/web3-signer";
import { cookiesEnum } from "./constants";

export const getAuth = async () => {
	const token = getCookie(cookiesEnum.Enum["x-auth-token"]) as
		| string
		| undefined;
	let isValid = false;
	let address: string | null = null;

	if (token) {
		try {
			const result = await verify(token);
			address = result.address;
			isValid = !!(address && result.body);
		} catch (error) {
			console.error("Error verifying token:", error);
		}
	}

	if (!isValid) {
		deleteCookie(cookiesEnum.Enum["x-auth-token"]);
		return null;
	}

	return {
		token,
		address,
	};
};
