"use client";

// ===============
// Components
// ===============
export { CustomAvatar } from "./components/custom-avatar";
export { IqLoginProvider } from "./components/iq-login-provider";
export {
	Login,
	type ConnectorRow,
	type LoginProps,
	type LoginVariant,
} from "./components/login-element";

export type {
	ConnectorMeta,
	ResolvedConnectorMeta,
} from "./components/connector-meta";
export type { LoginSlot } from "./components/login-slots";
export { humanizeConnectError } from "./lib/humanize-connect-error";

// ===============
// Hooks
// ===============
export { useAuth } from "./hooks/use-auth";
export { useWeb3Auth } from "./hooks/use-web-3-auth";
export {
	useLoginFlow,
	type UseLoginFlowOptions,
	type UseLoginFlowReturn,
} from "./hooks/use-login-flow";
export {
	useEnsureCorrectChain,
	type ChainStatus,
	type UseEnsureCorrectChainOptions,
	type UseEnsureCorrectChainReturn,
} from "./hooks/use-ensure-correct-chain";

// ===============
// Config
// ===============
export {
	createIqLoginConfig,
	type IqLoginConfig,
} from "./config/iq-login.config";
export { iqTestnet } from "./config/iq-testnet.config";
