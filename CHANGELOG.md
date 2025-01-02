# @everipedia/iq-login

## 7.0.9

### Patch Changes

- eba3637: query client and wagmi config refactoring

## 7.0.8

### Patch Changes

- cd94800: Adds better ux copies and button styles in login element

## 7.0.7

### Patch Changes

- 41f67df: Fixes chains

## 7.0.6

### Patch Changes

- e956741: Re-enable web3auth

## 7.0.5

### Patch Changes

- 1b0574d: Removes web3auth provider

## 7.0.4

### Patch Changes

- ffa08fb: Removes ssr

## 7.0.3

### Patch Changes

- 4b631b0: Updates provider query client

## 7.0.2

### Patch Changes

- c83c186: enable ssr in create config

## 7.0.1

### Patch Changes

- 3dc5789: removes unused variables
- 1791717: adds supress hydration warning on disconnect button
- 1feb5dc: Adds metamask connector

## 7.0.0

### Major Changes

- fee4c02: Breaking Changes:

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

## 6.2.0

### Minor Changes

- 03c569b: Update dependencies

## 6.1.4

### Patch Changes

- fa91092: Adds storage key to createStorage for wagmi config

## 6.1.3

### Patch Changes

- 3feaf3d: adds storage cookie storage

## 6.1.2

### Patch Changes

- 4a94747: changes group name

## 6.1.1

### Patch Changes

- b56c3ab: Adds ability to add project name from outside

## 6.1.0

### Minor Changes

- c600863: Adds popular wallet section
- 5f4e76a: Adds popular wallet section

## 6.0.1

### Patch Changes

- 2328e85: fix-fix-wallet-adapters-openlogin-to-auth

## 6.0.0

### Major Changes

- 16efa40: Enable passing down chain, wallet connect and web3auth ids from provider. Now IQ Login won't recognize the envs set and these must be passed down as props.

## 5.2.0

### Minor Changes

- 316319f: Removes default wallets and retained only metamask and web3auth

## 5.1.1

### Patch Changes

- 412aa0a: Updates web3 auth name to iq.wiki rather than iq wiki ai editor

## 5.1.0

### Minor Changes

- 03c9be1: Make login component responsive

## 5.0.0

### Major Changes

- 3441950: Updates web3auth libraries

## 4.0.0

### Major Changes

- 2f72652: Supports next 15

## 3.5.0

### Minor Changes

- bb94a85: Adds getCookie without passing cookies from next headers
- fc643c5: better imports

## 3.4.2

### Patch Changes

- 6383e8a: updates sign token button width

## 3.4.1

### Patch Changes

- 2430a51: Updates sign token styles

## 3.4.0

### Minor Changes

- 50d7fc2: Updates login component to use shadcn

## 3.3.1

### Patch Changes

- 491bc8f: adds cookies from next/header

## 3.3.0

### Minor Changes

- bd3d888: Removes use client directive in index.ts

## 3.2.9

### Patch Changes

- 0c26a7c: adds server funtion

## 3.2.8

### Patch Changes

- 0d1e77c: export get auth

## 3.2.7

### Patch Changes

- 50dab00: Adds get auth utility function

## 3.2.6

### Patch Changes

- 47f596d: Adds logout function in useAuth
- 6306002: Changes USER_TOKEN name to x-auth-token for existing compatibility

## 3.2.5

### Patch Changes

- 853a177: Returns the user from web3auth hook
- 875aa23: fixes useAuth not returning user data
- f1a6adc: Adds web3auth user data from useAuth hook

## 3.2.4

### Patch Changes

- a1d6f15: Removes wallet services plugin which is giving error of plan

## 3.2.3

### Patch Changes

- 55a2eae: Fixes login always uses polygon chain

## 3.2.2

### Patch Changes

- 58a9a69: Adds structural sharing to react query client

## 3.2.1

### Patch Changes

- ecd46c2: Removes redundant console logs

## 3.2.0

### Minor Changes

- 811615b: Moves bundling to be done with tsup

### Patch Changes

- b5659ed: updated imports pear deps and docs
- 619ba08: reverts web3 import structure

## 3.1.7

### Patch Changes

- 92b7aec: removes tags from package json

## 3.1.6

### Patch Changes

- ca6006b: fixes formating

## 3.1.5

### Patch Changes

- 991505e: Fixes destructure to @web3auth/web3auth-wagmi-connector
- 0d5e5b3: Removes format rules

## 3.1.5

### Patch Changes

- 3454344: removes named imports for web3auth packages

## 3.1.4

### Patch Changes

- 2190e85: changes name of export from eth-provider web3auth

## 3.1.3

### Patch Changes

- 5a3dbc0: Fixes for pages router

## 3.1.2

### Patch Changes

- 2c59dab: Removes css import from provider

## 3.1.1

### Patch Changes

- 1169c50: exports useAuth

## 3.1.0

### Minor Changes

- 89d7289: Update IqLoginProvider name
