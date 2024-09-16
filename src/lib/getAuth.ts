import { getCookie, deleteCookie } from "cookies-next";
import { verify } from "@everipedia/web3-signer";

const USER_TOKEN = "x-auth-token";

export const getAuth = async () => {
	const token = getCookie(USER_TOKEN) as string | undefined;
	let isValid = false;
	let address: string | null = null;

	if (token) {
		const result = await verify(token);
		address = result.address;
		isValid = !!(address && result.body);
	}

	if (!isValid) {
		deleteCookie(USER_TOKEN);
		return null;
	}

	return {
		token,
		address,
	};
};
