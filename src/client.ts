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
export { useAuth } from "./hooks/use-auth";
export { useWeb3Auth } from "./hooks/use-web-3-auth";

// ===============
// Config
// ===============
export {
	createIqLoginConfig,
	type IqLoginConfig,
} from "./config/iq-login.config";
export { iqTestnet } from "./config/iq-testnet.config";
