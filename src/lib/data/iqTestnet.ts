import { defineChain } from 'viem'
export const iqTestnet = defineChain({
  id: 313_377,
  name: 'IQ Testnet',
  network: 'IQ Testnet',
  nativeCurrency: {
    name: 'IQ Token',
    symbol: 'IQ',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.braindao.org/'] },
    public: { http: ['https://rpc-testnet.braindao.org/'] },
  },
  blockExplorers: {
    default: { name: 'BrainScan', url: 'https://testnet.braindao.org' },
  },
  testnet: true,
})
