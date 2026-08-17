import { Wallet } from "lucide-react";
import React from "react";
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

const dataUriIconCache = new Map<
	string,
	React.ComponentType<{ className?: string }>
>();

function dataUriIcon(
	uri: string,
	name: string,
): React.ComponentType<{ className?: string }> {
	// keyed by name too: connectors sharing an icon URI must not share
	// the first connector's alt text and displayName
	const key = `${name}-${uri}`;
	let cached = dataUriIconCache.get(key);
	if (!cached) {
		cached = ({ className }: { className?: string }) =>
			React.createElement("img", {
				src: uri,
				alt: `${name} logo`,
				className,
			});
		cached.displayName = `${name}Icon`;
		dataUriIconCache.set(key, cached);
	}
	return cached;
}

export function resolveConnectorMeta(
	name: string,
	overrides?: Record<string, ConnectorMeta>,
	/** the connector's own icon (EIP-6963 data URI), if it announced one */
	connectorIcon?: string,
): ResolvedConnectorMeta {
	const base = DEFAULT_CONNECTOR_META[name];
	const override = overrides?.[name];
	return {
		label: override?.label ?? base?.label ?? name,
		description:
			override?.description ??
			base?.description ??
			`Connect using your ${name} wallet`,
		icon:
			override?.icon ??
			(connectorIcon ? dataUriIcon(connectorIcon, name) : undefined) ??
			base?.icon ??
			Wallet,
	};
}
