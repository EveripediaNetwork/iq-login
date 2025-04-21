"use client";

// ===============
// Components
// ===============
export { CustomAvatar } from "./components/custom-avatar";
export { IqLoginProvider } from "./components/iq-login-provider";
export { Login } from "./components/login-element";

// ===============
// Hooks
// ===============
export { useAuth } from "./lib/hooks/use-auth";

// ===============
// Config
// ===============
export {
	getWagmiConfig,
	createWeb3AuthInstance,
} from "./lib/integrations/wagmi.config";
