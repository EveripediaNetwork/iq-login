import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SignTokenButton } from "./SignTokenButton";

interface LoginProps {
	title: string;
	description: string;
	handleRedirect?: () => void;
}

export const Login = ({ title, description, handleRedirect }: LoginProps) => {
	return (
		<div className="grid min-h-[calc(100vh-250px)] place-items-center py-4 md:p-4">
			<div className="max-w-xl text-center">
				<h1 className="mb-4 text-4xl font-bold">{title}</h1>
				<p className="mb-8 text-lg text-gray-500 dark:text-alpha-900">
					{description}
				</p>
				<div className="mt-8 rounded-md border bg-gray-100 dark:border-gray-500 dark:bg-gray-700">
					<div className="flex flex-col items-center p-4">
						<h2 className="mb-4 text-xl">Step 1: Connect your wallet</h2>
						<ConnectButton showBalance />
					</div>
					<div className="flex flex-col items-center border-t p-4 dark:border-gray-500">
						<h2 className="mb-4 text-xl">Step 2: Authenticate your wallet</h2>
						<SignTokenButton handleRedirect={() => handleRedirect?.()} />
					</div>
				</div>
			</div>
		</div>
	);
};
