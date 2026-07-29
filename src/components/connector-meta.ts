import { Wallet } from "lucide-react";
import type React from "react";
import { Injected } from "../icons/injected";
import { Social } from "../icons/social";
import { WalletConnect } from "../icons/wallet-connect";

export interface ConnectorMeta {
	label?: string;
	description?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export type ResolvedConnectorMeta = Required<ConnectorMeta>;

const DEFAULT_CONNECTOR_META: Record<string, ConnectorMeta> = {
	Web3Auth: { label: "Social Login", icon: Social },
	Injected: { label: "Browser Wallet", icon: Injected },
	WalletConnect: { label: "Wallet Connect", icon: WalletConnect },
};

export function resolveConnectorMeta(
	name: string,
	overrides?: Record<string, ConnectorMeta>,
): ResolvedConnectorMeta {
	const base = DEFAULT_CONNECTOR_META[name];
	const override = overrides?.[name];
	return {
		label: override?.label ?? base?.label ?? name,
		description:
			override?.description ??
			base?.description ??
			`Connect using your ${name} wallet`,
		icon: override?.icon ?? base?.icon ?? Wallet,
	};
}
