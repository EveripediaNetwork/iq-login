import type { Wallet } from '@rainbow-me/rainbowkit'
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/modal'
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import type { Chain } from 'viem'
import { createConnector } from 'wagmi'

export const rainbowWeb3AuthConnector = ({
  chain,
}: { chain: Chain }): Wallet => {
  const name = 'Web3 Auth'

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: `0x${chain.id.toString(16)}`,
    rpcTarget: chain.rpcUrls.default.http[0],
    displayName: chain.name,
    tickerName: chain.nativeCurrency?.name,
    ticker: chain.nativeCurrency?.symbol,
    blockExplorerUrl: chain.blockExplorers?.default.url[0] as string,
  }

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  })

  const web3AuthInstance = new Web3Auth({
    clientId:
      'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ',
    chainConfig,
    privateKeyProvider,
    uiConfig: {
      appName: name,
      loginMethodsOrder: ['google', 'discord', 'twitter'],
      defaultLanguage: 'en',
      modalZIndex: '2147483647',
      logoLight: 'https://web3auth.io/images/web3authlog.png',
      logoDark: 'https://web3auth.io/images/web3authlogodark.png',
      uxMode: 'redirect',
      mode: 'auto',
      theme: {
        primary: '#f93493',
        onPrimary: '#ffffff',
      },
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true,
  })

  const walletServicesPlugin = new WalletServicesPlugin({
    walletInitOptions: {
      whiteLabel: {
        showWidgetButton: true,
      },
    },
  })

  web3AuthInstance.addPlugin(walletServicesPlugin)

  const modalConfig = {
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: 'openlogin',
      showOnModal: true,
    },
  }

  return {
    id: 'web3-auth',
    name: 'Web3 Auth',
    iconUrl: 'https://favicon.twenty.com/web3auth.io',
    iconBackground: '#0364ff',

    createConnector: (walletDetails) => {
      const web3AuthConnector = Web3AuthConnector({
        web3AuthInstance,
        modalConfig,
      })

      return createConnector((config) => ({
        ...walletDetails,
        ...web3AuthConnector(config),
      }))
    },
  }
}
