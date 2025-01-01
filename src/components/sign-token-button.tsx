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

	if (token && isConnected) {
		return (
			<div className="w-full max-w-xs rounded-md bg-background border border-border p-3 text-center">
				{error ? (
					<p className="text-destructive font-medium">
						Something went wrong. Please try again.
					</p>
				) : loading ? (
					<div className="flex items-center justify-center gap-2 text-muted-foreground">
						<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
							<title>Loading...</title>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<p>Waiting for wallet signature...</p>
					</div>
				) : (
					<p className="font-medium">You are logged in 🚀</p>
				)}
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={signToken}
			disabled={!isConnected}
			className="inline-flex w-full max-w-xs items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
			aria-label="Sign Token"
		>
			Sign Token
		</button>
	);
};
