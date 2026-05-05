---
"@everipedia/iq-login": patch
---

Fix Web3Auth social login by replacing unreliable viem default RPCs with PublicNode RPCs

Viem's default RPCs (eth.merkle.io, polygon-rpc.com) fail for the RPC methods Web3Auth
calls during provider setup after OAuth, causing social login to silently fail and return
to the modal. This replaces them with reliable PublicNode RPCs for known chains and fixes
the blockExplorerUrl bug where string indexing returned a single character instead of the
full URL.
