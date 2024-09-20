import { ConnectButton } from "@rainbow-me/rainbowkit";
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
	description = "Connect your wallet to access your account",
	connectText = "Step 1: Connect your wallet",
	signTokenText = "Step 2: Authenticate your wallet",
	handleRedirect,
}: LoginProps) => {
	return (
		<div className="max-w-xl w-full text-center">
			<h1 className="mb-4 text-4xl font-bold">{title}</h1>
			<p className="mb-8 text-lg text-muted-foreground">{description}</p>
			<div className="mt-8 rounded-md border bg-card text-card-foreground">
				<div className="flex flex-col items-center p-4">
					<h2 className="mb-4 text-xl">{connectText}</h2>
					<ConnectButton showBalance />
				</div>
				<div className="flex flex-col items-center border-t p-4">
					<h2 className="mb-4 text-xl">{signTokenText}</h2>
					<SignTokenButton handleRedirect={() => handleRedirect?.()} />
				</div>
			</div>
		</div>
	);
};
