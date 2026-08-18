"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useConnect } from "wagmi";
import {
	type ConnectorMeta,
	connectorMetaEquals,
} from "../components/connector-meta";
import {
	buildConnectorRows,
	type ConnectorRow,
	GENERIC_INJECTED_ID,
} from "../components/connector-rows";

/**
 * connectorMeta is documented as an inline object literal, so its identity
 * changes every render — key the memo on its contents instead.
 */
function useStableConnectorMeta(
	meta?: Record<string, ConnectorMeta>,
): Record<string, ConnectorMeta> | undefined {
	const ref = useRef(meta);
	if (!connectorMetaEquals(ref.current, meta)) {
		ref.current = meta;
	}
	return ref.current;
}

export function useConnectorRows(
	meta?: Record<string, ConnectorMeta>,
): ConnectorRow[] {
	const connectorMeta = useStableConnectorMeta(meta);
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
