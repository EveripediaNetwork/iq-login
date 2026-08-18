/** EIP-1193 4001: the user (or a broken wallet) rejected the request. */
const USER_REJECTED_CODE = 4001;
/** JSON-RPC -32002 "Resource unavailable" (EIP-1474): request already open. */
const RESOURCE_UNAVAILABLE_CODE = -32002;

/**
 * Walk the error and its `cause` chain for a numeric provider/RPC code.
 * Codes are locale- and wording-independent, so they're checked before any
 * message pattern.
 */
function rpcErrorCode(error: unknown): number | undefined {
	let current: unknown = error;
	for (let depth = 0; current && depth < 5; depth++) {
		const code = (current as { code?: unknown }).code;
		if (typeof code === "number") return code;
		current = (current as { cause?: unknown }).cause;
	}
	return undefined;
}

export function humanizeConnectError(error: Error): string {
	// public /client export: JS consumers with looser types may pass null
	if (!error) return "Connection failed. Please try again.";
	const raw = `${error.message ?? ""}`;
	const code = rpcErrorCode(error);

	// MetaMask emits this as a 4001, so it must be recognized before the
	// generic rejected-request branch below.
	if (/must has at least one account/i.test(raw)) {
		return "Your wallet didn't provide an account. Unlock the extension, and if you run several wallet extensions, disable the extras or set a default.";
	}

	if (code === USER_REJECTED_CODE || /user rejected|user denied/i.test(raw)) {
		return "Request declined in the wallet. Try again when you're ready.";
	}

	if (
		code === RESOURCE_UNAVAILABLE_CODE ||
		/already pending|already processing/i.test(raw)
	) {
		return "Your wallet already has a request open — click its extension icon to finish or dismiss it, then retry.";
	}

	if (
		/provider not found|connector not found|no injected provider/i.test(raw)
	) {
		return "No browser wallet found. Install one, or connect with WalletConnect instead.";
	}

	// the WalletConnect relay is unreachable (often network/DNS filtering)
	if (/websocket connection failed|relay\.walletconnect/i.test(raw)) {
		return "Couldn't reach the WalletConnect relay — your network may be blocking it. Try another network or DNS, or use a browser wallet.";
	}

	// viem errors carry a one-line shortMessage above the details dump.
	// Blank candidates must fall through to the generic copy.
	const short = (error as { shortMessage?: string }).shortMessage;
	const shortTrim = typeof short === "string" ? short.trim() : "";
	const rawTrim = raw.trim();
	if (shortTrim.length > 0) return shortTrim;
	if (rawTrim.length > 0) {
		const firstLine =
			rawTrim.split("\n").find((l) => l.trim().length > 0) ?? "";
		if (firstLine.length > 0) return firstLine.trim();
	}
	return "Connection failed. Please try again.";
}
