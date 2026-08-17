export function humanizeConnectError(error: Error): string {
	const raw = `${error.message ?? ""}`;
	if (/must has at least one account/i.test(raw)) {
		return "Your wallet didn't provide an account. Unlock the extension, and if you run several wallet extensions, disable the extras or set a default.";
	}

	if (/user rejected|user denied/i.test(raw)) {
		return "Request declined in the wallet. Try again when you're ready.";
	}

	// JSON-RPC -32002 "Resource unavailable" (EIP-1474): a previous request
	// is still open in the extension
	if (
		/(?:already pending|already processing|\brequest\b.*\b(?:pending|processing)\b|\b(?:pending|processing)\b.*\brequest\b)/i.test(
			raw,
		)
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
