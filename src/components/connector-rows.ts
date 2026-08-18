import type { Connector } from "wagmi";
import {
	type ConnectorMeta,
	type ResolvedConnectorMeta,
	resolveConnectorMeta,
} from "./connector-meta";

export interface ConnectorRow {
	connector: Connector;
	meta: ResolvedConnectorMeta;
	connect: () => void;
	isPending: boolean;
	isConnecting: boolean;
	error: Error | null;
}

export const GENERIC_INJECTED_ID = "injected";

function isDiscoveredInjected(connector: Connector): boolean {
	return connector.type === "injected" && connector.id !== GENERIC_INJECTED_ID;
}

export interface BuildConnectorRowsArgs {
	connectors: readonly Connector[];
	connect: (args: { connector: Connector }) => void;
	isPending: boolean;
	error: Error | null;
	/** wagmi useConnect().variables — identifies the last attempted connector */
	variables?: { connector?: unknown };
	connectorMeta?: Record<string, ConnectorMeta>;
}

export function buildConnectorRows({
	connectors,
	connect,
	isPending,
	error,
	variables,
	connectorMeta,
}: BuildConnectorRowsArgs): ConnectorRow[] {
	const attempted =
		typeof variables?.connector === "object" && variables.connector !== null
			? (variables.connector as Connector)
			: undefined;

	const hasDiscovered = connectors.some(isDiscoveredInjected);

	const ordered = hasDiscovered
		? [
				...connectors.filter((c) => c.id !== GENERIC_INJECTED_ID),
				...connectors.filter((c) => c.id === GENERIC_INJECTED_ID),
			]
		: connectors;

	return ordered.map((connector) => {
		const meta = resolveConnectorMeta(
			connector.name,
			connectorMeta,
			connector.icon,
		);
		if (
			hasDiscovered &&
			connector.id === GENERIC_INJECTED_ID &&
			!connectorMeta?.[connector.name]
		) {
			meta.label = "Other Browser Wallet";
			meta.description = "For wallet extensions that don't announce themselves";
		}
		return {
			connector,
			meta,
			connect: () => connect({ connector }),
			isPending,
			isConnecting: isPending && attempted?.uid === connector.uid,
			error: attempted?.uid === connector.uid ? error : null,
		};
	});
}
