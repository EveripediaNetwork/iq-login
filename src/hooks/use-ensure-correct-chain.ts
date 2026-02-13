"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";

export type ChainStatus = "idle" | "correct" | "wrong-network" | "switching";

export interface UseEnsureCorrectChainOptions {
	/** The chain ID the app requires */
	requiredChainId: number;
	/** Called when status transitions (e.g. to open/close a modal) */
	onStatusChange?: (status: ChainStatus, targetChainName?: string) => void;
}

export interface UseEnsureCorrectChainReturn {
	/** Current chain-matching status */
	status: ChainStatus;
	/** Dismiss the wrong-network state (user chose to stay) */
	dismiss: () => void;
	/** Attempt to programmatically switch to the required chain */
	switchToCorrectChain: () => Promise<void>;
	/** The target chain object from the wagmi config, if found */
	targetChain: ReturnType<typeof useSwitchChain>["chains"][number] | undefined;
	/** Whether the wallet is connected */
	isConnected: boolean;
}

export const useEnsureCorrectChain = ({
	requiredChainId,
	onStatusChange,
}: UseEnsureCorrectChainOptions): UseEnsureCorrectChainReturn => {
	const { chainId, isConnected } = useAccount();
	const { switchChainAsync, chains } = useSwitchChain();
	const [status, setStatus] = useState<ChainStatus>("idle");

	const targetChain = chains.find((c) => c.id === requiredChainId);

	const transition = useCallback(
		(next: ChainStatus) => {
			setStatus(next);
			onStatusChange?.(next, targetChain?.name);
		},
		[onStatusChange, targetChain?.name],
	);

	useEffect(() => {
		if (!isConnected || !chainId) {
			transition("idle");
			return;
		}

		transition(chainId === requiredChainId ? "correct" : "wrong-network");
	}, [chainId, isConnected, requiredChainId, transition]);

	const switchToCorrectChain = useCallback(async () => {
		if (!isConnected) {
			console.error("Cannot switch chain, wallet not connected.");
			return;
		}

		if (chainId === requiredChainId) return;

		if (!targetChain) {
			console.error(
				`Cannot switch chain, target chain with ID ${requiredChainId} is not configured.`,
			);
			return;
		}

		try {
			transition("switching");
			await switchChainAsync({ chainId: requiredChainId });
		} catch (error) {
			console.error("Failed to switch network:", error);
			transition("wrong-network");
		}
	}, [
		isConnected,
		chainId,
		requiredChainId,
		targetChain,
		switchChainAsync,
		transition,
	]);

	const dismiss = useCallback(() => transition("idle"), [transition]);

	return {
		status,
		dismiss,
		switchToCorrectChain,
		targetChain,
		isConnected,
	};
};
