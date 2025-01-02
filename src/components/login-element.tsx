import { useConnect, useAccount, useDisconnect } from "wagmi";
import { SignTokenButton } from "./sign-token-button";

interface LoginProps {
	title?: string;
	description?: string;
	connectText?: string;
	signTokenText?: string;
	handleRedirect?: () => void;
}

export const Login = ({
	title = "Sign In / Connect",
	description = "Get started with your preferred login method",
	connectText = "Choose your login method",
	signTokenText = "Verify your wallet",
	handleRedirect,
}: LoginProps) => {
	const { connect, connectors } = useConnect();
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();

	return (
		<div className="max-w-xl w-full text-center">
			<h1 className="mb-2 md:mb-4 text-2xl md:text-3xl xl:text-4xl font-semibold xl:font-bold">
				{title}
			</h1>
			<p className="md:text-lg text-muted-foreground">{description}</p>
			<div className="mt-4 md:mt-8 rounded-md border bg-card text-card-foreground divide-y">
				<div className="flex flex-col items-center p-4 md:p-6">
					<h2 className="mb-4 text-lg md:text-xl font-medium flex items-center gap-2">
						<span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
							1
						</span>
						{connectText}
					</h2>
					<div className="flex flex-col gap-2 w-full max-w-xs">
						{isConnected ? (
							<div className="flex flex-col gap-2">
								<div className="p-3 bg-muted rounded-md">
									<p className="text-sm font-medium">Connected Wallet</p>
									<p className="text-xs text-muted-foreground break-all">
										{address}
									</p>
								</div>
								<button
									type="button"
									suppressHydrationWarning
									onClick={() => disconnect()}
									className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
								>
									Disconnect
								</button>
							</div>
						) : (
							connectors.map((connector) => (
								<button
									type="button"
									key={connector.uid}
									suppressHydrationWarning
									onClick={() => connect({ connector })}
									className="w-full px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-md transition-colors"
								>
									{getConnectorLabel(connector.name)}
								</button>
							))
						)}
					</div>
				</div>
				<div
					className={`flex flex-col items-center p-4 md:p-6 ${!isConnected ? "opacity-50" : ""}`}
				>
					<h2 className="mb-4 text-lg md:text-xl font-medium flex items-center gap-2">
						<span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
							2
						</span>
						{signTokenText}
					</h2>
					<SignTokenButton handleRedirect={handleRedirect ?? (() => {})} />
				</div>
			</div>
		</div>
	);
};

const getConnectorLabel = (connectorName: string) => {
	switch (connectorName) {
		case "Web3Auth":
			return "Login with Email / Socials";
		case "Injected":
			return "Login with Browser Wallet";
		case "MetaMask":
			return "Login with MetaMask";
		default:
			return `Login with ${connectorName}`;
	}
};
