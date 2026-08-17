export function humanizeConnectError(error: Error): string {
	const raw = `${error.message ?? ""}`;
	if (/must has at least one account/i.test(raw)) {
		return "Your wallet didn't provide an account. Unlock the extension, and if you run several wallet extensions, disable the extras or set a default.";
	}

	if (/user rejected|user denied/i.test(raw)) {
		return "Request declined in the wallet. Try again when you're ready.";
	}

	// EIP-1193 -32002: a previous request is still open in the extension
	if (/already pending|already processing|request of type/i.test(raw)) {
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

	// viem errors carry a one-line shortMessage above the details dump
	const short = (error as { shortMessage?: string }).shortMessage;
	return short ?? raw.split("\n")[0] ?? "Connection failed. Please try again.";
}
