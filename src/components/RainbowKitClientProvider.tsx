'use client'

import type React from 'react'
import { iqTestnet } from '../lib/data/iqTestnet'
import { iqWikiTheme } from '../lib/data/rainbowKitTheme'
import { rainbowWeb3AuthConnector } from '../lib/integrations/web3-auth-connector'
import {
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { CustomAvatar } from './CustomAvatar'

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set')
}
if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set')
}
if (!process.env.NEXT_PUBLIC_IS_PRODUCTION) {
  console.log('NEXT_PUBLIC_IS_PRODUCTION is not set')
}

const chain = process.env.NEXT_PUBLIC_IS_PRODUCTION ? polygon : iqTestnet

export const defaultConfig = getDefaultConfig({
  appName: 'IQ.Wiki AI Editor',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains: [chain],
  wallets: [
    ...getDefaultWallets({
      appName: 'IQ.Wiki AI Editor',
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    }).wallets,
    {
      groupName: 'More',
      wallets: [() => rainbowWeb3AuthConnector({ chain })],
    },
  ],
  multiInjectedProviderDiscovery: false,
  ssr: false,
})

const queryClient = new QueryClient()

export function RainbowKitClientProvider({
  children,
  cookie,
}: Readonly<React.PropsWithChildren> & { cookie?: string }) {
  const initialStates = cookieToInitialState(defaultConfig, cookie)
  return (
    <WagmiProvider config={defaultConfig} initialState={initialStates}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={CustomAvatar} theme={iqWikiTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
