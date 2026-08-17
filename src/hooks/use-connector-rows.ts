"use client";

import { useEffect, useMemo, useState } from "react";
import { useConnect } from "wagmi";
import type { ConnectorMeta } from "../components/connector-meta";
import {
	buildConnectorRows,
	type ConnectorRow,
	GENERIC_INJECTED_ID,
} from "../components/connector-rows";

export function useConnectorRows(
	connectorMeta?: Record<string, ConnectorMeta>,
): ConnectorRow[] {
	const { connect, connectors, isPending, error, variables } = useConnect();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return useMemo(
		() =>
			buildConnectorRows({
				connectors: mounted
					? connectors
					: connectors.filter((c) => c.id !== GENERIC_INJECTED_ID),
				connect,
				isPending,
				error,
				variables,
				connectorMeta,
			}),
		[mounted, connectors, connect, isPending, error, variables, connectorMeta],
	);
}
