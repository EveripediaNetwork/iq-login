import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useAuth } from "../lib/hooks/use-auth";

interface SignTokenButtonProps {
	handleRedirect: () => void;
	handleTokenPass?: (token: string) => Promise<void>;
}

export const SignTokenButton = ({
	handleRedirect,
	handleTokenPass,
}: SignTokenButtonProps) => {
	const { isConnected } = useAccount();
	const { token, signToken, loading, error } = useAuth();

	useEffect(() => {
		const handleEffect = async () => {
			if (token && isConnected) {
				await handleTokenPass?.(token);
				handleRedirect();
			}
		};
		handleEffect();
	}, [handleRedirect, handleTokenPass, isConnected, token]);

	return token && isConnected ? (
		<p className="w-full max-w-md w-[280px] rounded-md bg-background border border-border px-3.5 py-2 text-center text-base font-bold text-foreground">
			{error
				? "Something went wrong. Please try again."
				: loading
					? "You should get a signature request from your wallet, Approve it to continue."
					: "You are logged in 🚀"}
		</p>
	) : (
		<button
			type="button"
			disabled={!isConnected}
			className="inline-flex w-[150px] items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
			onClick={signToken}
			aria-label="Sign Token"
		>
			Sign Token
		</button>
	);
};
