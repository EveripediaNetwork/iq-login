---
"@everipedia/iq-login": minor
---

Fix multi-wallet connect conflicts by adopting EIP-6963 wallet discovery, and make connect errors attributable and readable.

- `createIqLoginConfig` now enables `multiInjectedProviderDiscovery`: every installed wallet extension (MetaMask, Phantom, OKX, Coinbase…) announces itself and gets its own connector row with its own name and brand icon, instead of one generic "Browser Wallet" row talking to whichever extension last hijacked `window.ethereum`. The generic injected row still appears when no wallet announces itself. This addresses the "wallet must has at least one account" (4001) failures caused by extension conflicts.
- Connect errors are now scoped to the connector that attempted the connection — previously the one shared `useConnect` error rendered under every row, making a single failed attempt look like all connectors failed. `ConnectorRow.error` (in both `Login` and `useLoginFlow`) now carries the error only on the attempted row.
- New `humanizeConnectError(error)` export maps known wallet failures (locked-wallet 4001, pending-request -32002, missing provider, unreachable WalletConnect relay) to actionable messages; the built-in `Login` uses it for its error line.
