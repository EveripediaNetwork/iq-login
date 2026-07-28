import type { UserInfo } from "@web3auth/base";
import type { Connector } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import {
	type ConnectorMeta,
	type ResolvedConnectorMeta,
	resolveConnectorMeta,
} from "../components/connector-meta";
import { useAuth } from "./use-auth";

export interface LoginFlowConnector {
	connector: Connector;
	meta: ResolvedConnectorMeta;
	connect: () => void;
	isPending: boolean;
	error: Error | null;
}

export interface UseLoginFlowOptions {
	connectorMeta?: Record<string, ConnectorMeta>;
}

export interface UseLoginFlowReturn {
	connectors: LoginFlowConnector[];
	isConnected: boolean;
	address: `0x${string}` | undefined;
	token: string | null;
	signToken: () => void;
	reSignToken: () => void;
	signing: boolean;
	signError: Error | null;
	logout: () => void;
	disableAuth: boolean;
	web3AuthUser: Partial<UserInfo> | null;
}

/**
 * Headless login flow: all the state and actions the styled `Login`
 * component uses, with none of its markup. Build any UI on top.
 * Must be used inside `IqLoginProvider`.
 */
export function useLoginFlow(
	options?: UseLoginFlowOptions,
): UseLoginFlowReturn {
	const { connect, connectors, isPending, error } = useConnect();
	const { address, isConnected } = useAccount();
	const {
		token,
		signToken,
		reSignToken,
		loading,
		error: authError,
		logout,
		disableAuth,
		web3AuthUser,
	} = useAuth();

	return {
		connectors: connectors.map((connector) => ({
			connector,
			meta: resolveConnectorMeta(connector.name, options?.connectorMeta),
			connect: () => connect({ connector }),
			isPending,
			error: (error as Error | null) ?? null,
		})),
		isConnected,
		address,
		token,
		signToken,
		reSignToken,
		signing: loading,
		signError: (authError as Error | null) ?? null,
		logout,
		disableAuth,
		web3AuthUser,
	};
}
