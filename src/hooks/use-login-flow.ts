import type { UserInfo } from "@web3auth/base";
import { useAccount, useConnect } from "wagmi";
import type { ConnectorMeta } from "../components/connector-meta";
import {
	buildConnectorRows,
	type ConnectorRow,
} from "../components/connector-rows";
import { useAuth } from "./use-auth";

export interface UseLoginFlowOptions {
	connectorMeta?: Record<string, ConnectorMeta>;
}

export interface UseLoginFlowReturn {
	connectors: ConnectorRow[];
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
	const { connect, connectors, isPending, error, variables } = useConnect();
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
		connectors: buildConnectorRows({
			connectors,
			connect,
			isPending,
			error,
			variables,
			connectorMeta: options?.connectorMeta,
		}),
		isConnected,
		address,
		token,
		signToken,
		reSignToken,
		signing: loading,
		signError: authError,
		logout,
		disableAuth,
		web3AuthUser,
	};
}
