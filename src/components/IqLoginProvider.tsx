import {
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type React from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { iqTestnet } from '../lib/data/iqTestnet'
import { iqWikiTheme } from '../lib/data/rainbowKitTheme'
import { rainbowWeb3AuthConnector } from '../lib/integrations/web3-auth-connector'

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
  ssr: true,
})

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: make a new query client if we don't already have one
  // This is very important so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function IqLoginProvider({
  children,
  cookie,
}: Readonly<React.PropsWithChildren> & { cookie?: string }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  const initialStates = cookieToInitialState(defaultConfig, cookie)
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={defaultConfig} initialState={initialStates}>
        <RainbowKitProvider theme={iqWikiTheme}>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
