import {
	ArrowRight,
	CheckCircle,
	Loader2,
	LogOut,
	Shield,
	Wallet,
	XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { useAuth } from "../client";
import { Injected } from "../lib/icons/injected";
import { Social } from "../lib/icons/social";
import { WalletConnect } from "../lib/icons/wallet-connect";

export const Login = ({
	title = "Welcome Back",
	description = "Connect your wallet to access your account",
	connectText = "Connect Wallet",
	signTokenText = "Verify Identity",
	handleRedirect,
	disableAuth = false,
}: {
	title?: string;
	description?: string;
	connectText?: string;
	signTokenText?: string;
	handleRedirect?: () => void;
	disableAuth?: boolean;
}) => {
	const { isConnected } = useAccount();

	return (
		<div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-8">
			<div className="relative w-full max-w-md">
				<div className="space-y-8 text-center">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
							{title}
						</h1>
						<p className="mx-auto max-w-[500px] text-muted-foreground text-sm md:text-base">
							{description}
						</p>
					</div>
					<div className="mx-auto">
						<div className="overflow-hidden rounded-lg border bg-card shadow">
							{isConnected ? (
								<ConnectedWalletView
									signTokenText={signTokenText}
									handleRedirect={handleRedirect}
									disableAuth={disableAuth}
								/>
							) : (
								<WalletConnectView connectText={connectText} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const WalletConnectView = ({ connectText }: { connectText: string }) => {
	const { connect, connectors } = useConnect();

	return (
		<div className="p-4">
			<div className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg bg-primary/10">
				<Wallet className="w-4 h-4 text-primary" />
			</div>
			<h2 className="mt-3 mb-3 text-lg font-semibold">{connectText}</h2>
			<div className="grid gap-3">
				{connectors.map((connector) => (
					<ConnectorButton
						key={connector.uid}
						name={connector.name}
						onClick={() => connect({ connector })}
					/>
				))}
			</div>
		</div>
	);
};

const ConnectorButton = ({
	name,
	onClick,
}: {
	name: string;
	onClick: () => void;
}) => {
	const { isPending, error } = useConnect();

	const connectorConfig = {
		Web3Auth: {
			label: "Social Login",
			icon: Social,
		},
		Injected: {
			label: "Browser Wallet",
			icon: Injected,
		},
		WalletConnect: {
			label: "Wallet Connect",
			icon: WalletConnect,
		},
	};

	const config = connectorConfig[name as keyof typeof connectorConfig] || {
		label: name,
		icon: Wallet,
	};

	const ConnectorIcon = config.icon;

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isPending}
			className="group relative flex items-center justify-between rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent disabled:opacity-50"
		>
			<div className="flex items-center gap-3">
				<ConnectorIcon className="size-8 text-primary" />
				<div>
					<p className="font-medium text-sm">{config.label}</p>
					<p className="text-xs text-muted-foreground">
						{isPending ? "Connecting..." : `Connect using your ${name} wallet`}
					</p>
					{error && (
						<p className="text-xs text-destructive mt-1">{error.message}</p>
					)}
				</div>
			</div>
			{isPending ? (
				<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
			) : (
				<ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
			)}
		</button>
	);
};

const ConnectedWalletView = ({
	signTokenText,
	handleRedirect,
	disableAuth,
}: {
	signTokenText: string;
	handleRedirect?: () => void;
	disableAuth?: boolean;
}) => {
	const { address } = useAccount();
	const { logout } = useAuth();

	// Add useEffect to trigger handleRedirect when disableAuth is true
	useEffect(() => {
		if (disableAuth && handleRedirect) {
			handleRedirect();
		}
	}, [disableAuth, handleRedirect]);

	return (
		<div className="p-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
						<Wallet className="w-3 h-3 text-primary" />
					</div>
					<p className="font-medium text-sm">Connected Wallet</p>
				</div>
				<button
					type="button"
					onClick={logout}
					className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
					title="Disconnect wallet"
				>
					<LogOut className="w-4 h-4" />
				</button>
			</div>

			<div className="rounded-lg bg-muted/50 border p-3 mb-4">
				<p className="font-mono text-xs break-all">{address}</p>
			</div>

			{disableAuth ? (
				<div className="w-full grid place-items-center">
					<div className="flex items-center gap-2 text-success py-1.5 text-green-500">
						<CheckCircle className="h-4 w-4" />
						<p className="font-medium text-sm">Successfully signed in!</p>
					</div>
				</div>
			) : (
				<VerificationSection
					signTokenText={signTokenText}
					handleRedirect={handleRedirect ?? (() => {})}
				/>
			)}
		</div>
	);
};

const VerificationSection = ({
	signTokenText,
	handleRedirect,
}: {
	signTokenText: string;
	handleRedirect: () => void;
}) => (
	<div className="space-y-3">
		<div className="relative">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-card px-2 text-muted-foreground">Next Step</span>
			</div>
		</div>

		<div className="rounded-lg border p-4 text-center">
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<Shield className="w-4 h-4 text-primary" />
				</div>
				<div className="space-y-1">
					<h3 className="font-medium text-base">{signTokenText}</h3>
					<p className="text-xs text-muted-foreground">
						Sign a message to verify your wallet ownership
					</p>
				</div>
				<div className="w-full flex justify-center">
					<SignTokenButton handleRedirect={handleRedirect} />
				</div>
			</div>
		</div>
	</div>
);

export const SignTokenButton = ({
	handleRedirect,
	handleTokenPass,
}: {
	handleRedirect: () => void;
	handleTokenPass?: (token: string) => Promise<void>;
}) => {
	const { isConnected } = useAccount();
	const { token, signToken, loading, error } = useAuth();

	useEffect(() => {
		const handleEffect = async () => {
			if (token && isConnected) {
				try {
					if (handleTokenPass) {
						await handleTokenPass(token);
					}
					handleRedirect();
				} catch (err) {
					console.error("Error during authentication flow:", err);
				}
			}
		};
		handleEffect();
	}, [handleRedirect, handleTokenPass, isConnected, token]);

	const StatusDisplay = () => {
		if (error) {
			return (
				<div className="flex items-center gap-2 text-destructive py-1.5">
					<XCircle className="h-4 w-4" />
					<p className="font-medium text-sm">Failed to sign. Try again</p>
				</div>
			);
		}
		if (loading) {
			return (
				<div className="flex items-center gap-2 text-primary py-1.5">
					<Loader2 className="h-4 w-4 animate-spin" />
					<p className="font-medium text-sm">Waiting for signature...</p>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-2 text-success py-1.5 text-green-500">
				<CheckCircle className="h-4 w-4" />
				<p className="font-medium text-sm">Successfully signed in!</p>
			</div>
		);
	};

	if (token && isConnected) {
		return (
			<div className="mx-auto">
				<StatusDisplay />
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={signToken}
			disabled={!isConnected}
			className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
		>
			<Shield className="h-4 w-4" />
			Sign Token
		</button>
	);
};
