import * as Web3AuthBase from "@web3auth/base";
import * as Web3AuthEthereumProvider from "@web3auth/ethereum-provider";
import * as Web3AuthModal from "@web3auth/modal";
import type { Chain } from "viem";

export function createWeb3AuthInstance(chain: Chain, clientId: string) {
	const chainConfig = {
		chainNamespace: Web3AuthBase.CHAIN_NAMESPACES.EIP155,
		chainId: `0x${chain.id.toString(16)}`,
		rpcTarget: chain.rpcUrls.default.http[0],
		displayName: chain.name,
		tickerName: chain.nativeCurrency?.name,
		ticker: chain.nativeCurrency?.symbol,
		blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
	};

	const privateKeyProvider =
		new Web3AuthEthereumProvider.EthereumPrivateKeyProvider({
			config: { chainConfig },
		});

	return new Web3AuthModal.Web3Auth({
		clientId,
		chainConfig,
		privateKeyProvider,
		web3AuthNetwork: Web3AuthBase.WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
	});
}
