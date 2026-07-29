import {
	ArrowRight,
	CheckCircle,
	Loader2,
	LogOut,
	Shield,
	Wallet,
	XCircle,
} from "lucide-react";
import type React from "react";
import { Fragment, useEffect } from "react";
import { type Connector, useAccount, useConnect } from "wagmi";
import { useAuth } from "../client";
import { useProject } from "../hooks/use-project";
import { cn } from "../lib/cn";
import {
	type ConnectorMeta,
	type ResolvedConnectorMeta,
	resolveConnectorMeta,
} from "./connector-meta";
import { defaultClassNames, type LoginSlot } from "./login-slots";

export type LoginVariant = "page" | "card";

export interface ConnectorRow {
	connector: Connector;
	meta: ResolvedConnectorMeta;
	connect: () => void;
	isPending: boolean;
	isConnecting: boolean;
	error: Error | null;
}

export interface LoginProps {
	title?: string;
	description?: string;
	connectText?: string;
	signTokenText?: string;
	handleRedirect?: () => void;
	variant?: LoginVariant;
	classNames?: Partial<Record<LoginSlot, string>>;
	connectorMeta?: Record<string, ConnectorMeta>;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	renderConnector?: (row: ConnectorRow) => React.ReactNode;
}

type SlotFn = (name: LoginSlot, extra?: string) => string;

const defaultSlot: SlotFn = (name, extra) => cn(defaultClassNames[name], extra);

export const Login = ({
	title = "Welcome Back",
	description = "Connect your wallet to access your account",
	connectText = "Connect Wallet",
	signTokenText = "Verify Identity",
	handleRedirect,
	variant = "page",
	classNames,
	connectorMeta,
	header,
	footer,
	renderConnector,
}: LoginProps) => {
	const { isConnected } = useAccount();
	const { disableAuth } = useProject();

	const slot: SlotFn = (name, extra) =>
		cn(defaultClassNames[name], extra, classNames?.[name]);

	const card = (
		<div className={slot("card")}>
			{isConnected ? (
				<ConnectedWalletView
					signTokenText={signTokenText}
					handleRedirect={handleRedirect}
					disableAuth={disableAuth}
					slot={slot}
				/>
			) : (
				<WalletConnectView
					connectText={connectText}
					slot={slot}
					header={header}
					footer={footer}
					connectorMeta={connectorMeta}
					renderConnector={renderConnector}
				/>
			)}
		</div>
	);

	if (variant === "card") {
		return card;
	}

	return (
		<div className={slot("root")}>
			<div className={slot("container")}>
				<div className="space-y-8 text-center">
					<div className="space-y-2">
						<h1 className={slot("title")}>{title}</h1>
						<p className={slot("description")}>{description}</p>
					</div>
					<div className="mx-auto">{card}</div>
				</div>
			</div>
		</div>
	);
};

const WalletConnectView = ({
	connectText,
	slot,
	header,
	footer,
	connectorMeta,
	renderConnector,
}: {
	connectText: string;
	slot: SlotFn;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	connectorMeta?: Record<string, ConnectorMeta>;
	renderConnector?: (row: ConnectorRow) => React.ReactNode;
}) => {
	const { connect, connectors, isPending, error, variables } = useConnect();
	const pendingConnector =
		isPending && typeof variables?.connector === "object"
			? variables.connector
			: undefined;

	return (
		<div className={slot("cardBody")}>
			{header ?? (
				<div>
					<div className={slot("headerIcon")}>
						<Wallet className="w-4 h-4 text-primary" />
					</div>
					<h2 className={slot("headerTitle")}>{connectText}</h2>
				</div>
			)}
			<div className={slot("connectorList")}>
				{connectors.map((connector) => {
					const meta = resolveConnectorMeta(connector.name, connectorMeta);
					const isConnecting = pendingConnector?.uid === connector.uid;
					if (renderConnector) {
						return (
							<Fragment key={connector.uid}>
								{renderConnector({
									connector,
									meta,
									connect: () => connect({ connector }),
									isPending,
									isConnecting,
									error,
								})}
							</Fragment>
						);
					}
					return (
						<ConnectorButton
							key={connector.uid}
							meta={meta}
							onClick={() => connect({ connector })}
							slot={slot}
							isPending={isPending}
							isConnecting={isConnecting}
							error={error}
						/>
					);
				})}
			</div>
			{footer}
		</div>
	);
};

export const ConnectorButton = ({
	meta,
	onClick,
	slot,
	isPending,
	isConnecting,
	error,
}: {
	meta: ResolvedConnectorMeta;
	onClick: () => void;
	slot: SlotFn;
	isPending: boolean;
	isConnecting: boolean;
	error: Error | null;
}) => {
	const ConnectorIcon = meta.icon;

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isPending}
			className={slot("connectorButton")}
		>
			<div className="flex items-center gap-3">
				<ConnectorIcon className={slot("connectorIcon")} />
				<div>
					<p className={slot("connectorLabel")}>{meta.label}</p>
					<p className={slot("connectorDescription")}>
						{isConnecting ? "Connecting..." : meta.description}
					</p>
					{error && <p className={slot("connectorError")}>{error.message}</p>}
				</div>
			</div>
			{isConnecting ? (
				<Loader2 className={slot("connectorArrow", "animate-spin")} />
			) : (
				<ArrowRight
					className={slot(
						"connectorArrow",
						"transition-transform group-hover:translate-x-0.5",
					)}
				/>
			)}
		</button>
	);
};

const ConnectedWalletView = ({
	signTokenText,
	handleRedirect,
	disableAuth,
	slot,
}: {
	signTokenText: string;
	handleRedirect?: () => void;
	disableAuth?: boolean;
	slot: SlotFn;
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
		<div className={slot("cardBody")}>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
						<Wallet className="w-3 h-3 text-primary" />
					</div>
					<p className={slot("connectedTitle")}>Connected Wallet</p>
				</div>
				<button
					type="button"
					onClick={logout}
					className={slot("logoutButton")}
					title="Disconnect wallet"
				>
					<LogOut className="w-4 h-4" />
				</button>
			</div>

			<div className={slot("addressBox")}>
				<p className={slot("addressText")}>{address}</p>
			</div>

			{disableAuth ? (
				<div className="w-full grid place-items-center">
					<div className={`${slot("statusText")} text-success text-green-500`}>
						<CheckCircle className="h-4 w-4" />
						<p className="font-medium text-sm">Successfully signed in!</p>
					</div>
				</div>
			) : (
				<VerificationSection
					signTokenText={signTokenText}
					handleRedirect={handleRedirect ?? (() => {})}
					slot={slot}
				/>
			)}
		</div>
	);
};

const VerificationSection = ({
	signTokenText,
	handleRedirect,
	slot,
}: {
	signTokenText: string;
	handleRedirect: () => void;
	slot: SlotFn;
}) => (
	<div className="space-y-3">
		<div className={slot("divider")}>
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className={slot("dividerLabel")}>Next Step</span>
			</div>
		</div>

		<div className={slot("verificationCard")}>
			<div className="flex flex-col items-center gap-3">
				<div className={slot("verificationIcon")}>
					<Shield className="w-4 h-4 text-primary" />
				</div>
				<div className="space-y-1">
					<h3 className={slot("verificationTitle")}>{signTokenText}</h3>
					<p className={slot("verificationDescription")}>
						Sign a message to verify your wallet ownership
					</p>
				</div>
				<div className="w-full flex justify-center">
					<SignTokenButton handleRedirect={handleRedirect} slot={slot} />
				</div>
			</div>
		</div>
	</div>
);

export const SignTokenButton = ({
	handleRedirect,
	handleTokenPass,
	slot = defaultSlot,
}: {
	handleRedirect: () => void;
	handleTokenPass?: (token: string) => Promise<void>;
	slot?: SlotFn;
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
				<div className={slot("statusText", "text-destructive")}>
					<XCircle className="h-4 w-4" />
					<p className="font-medium text-sm">Failed to sign. Try again</p>
				</div>
			);
		}
		if (loading) {
			return (
				<div className={slot("statusText", "text-primary")}>
					<Loader2 className="h-4 w-4 animate-spin" />
					<p className="font-medium text-sm">Waiting for signature...</p>
				</div>
			);
		}
		return (
			<div className={`${slot("statusText")} text-success text-green-500`}>
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
			className={slot("signButton")}
		>
			<Shield className="h-4 w-4" />
			Sign Token
		</button>
	);
};
