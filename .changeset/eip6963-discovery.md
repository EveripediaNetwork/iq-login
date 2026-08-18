---
"@everipedia/iq-login": minor
---

Fix multi-wallet connect conflicts by adopting EIP-6963 wallet discovery, and make connect errors attributable and readable.

- `createIqLoginConfig` now enables `multiInjectedProviderDiscovery`: every installed wallet extension (MetaMask, Phantom, OKX, Coinbase…) announces itself and gets its own connector row with its own name and brand icon, instead of one generic "Browser Wallet" row talking to whichever extension last hijacked `window.ethereum`. When wallets announce, the generic injected row is relabeled "Other Browser Wallet" and moved last (it stays the escape hatch for extensions that inject without announcing); when nothing announces it renders unchanged. Discovered connectors only arrive after client hydration, so the generic row is withheld until mount to avoid flashing the ambiguous row on first paint. This addresses the "wallet must has at least one account" (4001) failures caused by extension conflicts.
- Connect errors are now scoped to the connector that attempted the connection — previously the one shared `useConnect` error rendered under every row, making a single failed attempt look like all connectors failed. `ConnectorRow.error` (in both `Login` and `useLoginFlow`) now carries the error only on the attempted row.
- New `humanizeConnectError(error)` export maps known wallet failure message patterns (locked-wallet, pending-request, missing provider, unreachable WalletConnect relay) to actionable messages; the built-in `Login` uses it for its error line.
- **Migration — `connectorMeta` keys:** overrides are keyed by connector name, and a discovered wallet's row uses the wallet's own name. An existing `connectorMeta: { Injected: { … } }` override now only styles the generic fallback row — add keys for the wallet names you customize (e.g. `MetaMask: { … }`).
