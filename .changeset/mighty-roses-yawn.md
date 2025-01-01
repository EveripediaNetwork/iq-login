---
"@everipedia/iq-login": major
---

Breaking Changes:
- Removed RainbowKit dependency in favor of direct Wagmi implementation
- Updated provider props:
  - Removed `walletConnectProjectId` (no longer needed)
  - Added required `projectName` prop for storage configuration

Migration Steps:
1. Update dependencies:
***
pnpm remove @rainbow-me/rainbowkit
***

2. Update IqLoginProvider usage:
***
<IqLoginProvider 
  chain={polygon}
  web3AuthProjectId="YOUR_PROJECT_ID"
  projectName="YOUR_PROJECT_NAME"
  cookie={cookie}
>
***

3. Remove RainbowKit styles import from your application
