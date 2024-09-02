import React, { useCallback } from 'react'
import { useWalletClient } from 'wagmi'
import { sign, verify } from '@everipedia/web3-signer'
import { create } from 'zustand'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'

export const useTokenStore = create<{
  token: string | null
  setToken: (token: string | null) => void
}>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}))

export const useAuth = () => {
  const { token, setToken } = useTokenStore((state) => state)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>()
  const [isReSignToken, reSignToken] = React.useState<boolean>(false)
  const { data: walletClient } = useWalletClient()

  const generateNewTokenAndStore = useCallback(async () => {
    if (!walletClient) return
    const freshToken = await sign(
      (msg) => walletClient.signMessage({ message: msg }),
      {
        statement:
          'Welcome to IQ.wiki ! Click to sign in and accept the IQ.wiki Terms of Service. This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 1 year. ',
        expires_in: '1y',
      },
    )
    setCookie('USER_TOKEN', freshToken, { maxAge: 60 * 60 * 24 * 365 })
    setToken(freshToken)
  }, [setToken, walletClient])

  const fetchStoredToken = useCallback(async () => {
    const storedToken = getCookie('USER_TOKEN') as string
    if (storedToken) {
      const { address, body } = await verify(storedToken)
      if (address && body) {
        setToken(storedToken)
      }
    } else {
      deleteCookie('USER_TOKEN')
      throw new Error('No stored token')
    }
  }, [setToken])

  React.useEffect(() => {
    const retrieveWeb3Token = async () => {
      if (isReSignToken) setError('')
      else reSignToken(false)

      const generateNewToken = async () => {
        setLoading(true)
        try {
          await generateNewTokenAndStore()
        } catch (e) {
          setError(e as string)
        }
        setLoading(false)
      }

      try {
        await fetchStoredToken()
      } catch {
        await generateNewToken()
      }
    }
    retrieveWeb3Token()
  }, [isReSignToken, generateNewTokenAndStore, fetchStoredToken])

  return { token, loading, reSignToken, error }
}
