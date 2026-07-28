# 🔐 IQ Login

## 🌟 Introduction

@everipedia/iq-login is a package that provides easy integration of IQ.wiki login functionality into your Next.js applications. It allows users to authenticate using their crypto wallet and web3auth with Wagmi seamlessly.

## 📦 Installation

```bash
pnpm install @everipedia/iq-login wagmi@2.x viem@2.x @web3auth/modal @web3auth/ethereum-provider @web3auth/web3auth-wagmi-connector
```

## 🛠️ Setup

1. Add environment variables:
```bash
## .env.local
NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

2. Add the package to your Tailwind CSS configuration:

For Tailwind CSS v3:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // ... other content paths
    "./node_modules/@everipedia/iq-login/**/*.{js,jsx,ts,tsx}",
  ],
  // ... rest of your Tailwind config
};

export default config;
```

For Tailwind CSS v4:

Add this line to your CSS entry point (e.g., `app/globals.css`):

```css
@source "../node_modules/@everipedia/iq-login";
```

3. Wrap your application with the IqLoginProvider in your layout file:

```tsx
// app/layout.tsx
import { IqLoginProvider, createIqLoginConfig } from "@everipedia/iq-login/client";
import { headers } from "next/headers";
import { fraxtal } from "viem/chains";

// Create the config. It is important that this is outside the component
const config = createIqLoginConfig([fraxtal])

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await headers()).get("cookie")

  return (
    <html lang="en">
      <body>
        <IqLoginProvider 
          projectName="YOUR_PROJECT_NAME"
          cookie={cookie}
          config={config}
          // Optional props:
          // disableAuth={false} // Default: false
        >
          {children}
        </IqLoginProvider>
      </body>
    </html>
  );
}
```

You can use any chain supported by viem. Import your desired chain from 'viem/chains' and pass it to the `createIqLoginConfig` function.

4. Add login page to your application:

```tsx
// app/login/page.tsx
import { Login } from '@everipedia/iq-login';

const LoginPage = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
```

## 🔒 Use Auth Hook

```tsx
// components/my-component.tsx
import { useAuth } from '@everipedia/iq-login';

function MyComponent() {
  const { token, loading, reSignToken, error, logout, web3AuthUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {token ? (
        <>
          <p>Authenticated!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={reSignToken}>Sign Token</button>
      )}
    </div>
  );
}
```

## 🔑 Authentication Helper

```ts
import { getAuth } from '@everipedia/iq-login';

const { token, address } = await getAuth();

if (token && address) {
  console.log('User is authenticated');
  console.log('Token:', token);
  console.log('Address:', address);
} else {
  console.log('User is not authenticated');
}
```

## 🔗 Chain Enforcement Hook

Use `useEnsureCorrectChain` to ensure the connected wallet is on the correct network. It exposes a single `status` flow instead of multiple booleans:

```
idle → wrong-network → switching → correct
```

| Status | Meaning |
|---|---|
| `"idle"` | Wallet not connected or state dismissed |
| `"wrong-network"` | Connected to an unsupported chain |
| `"switching"` | Chain switch in progress |
| `"correct"` | On the required chain |

### Basic Usage

```tsx
import { useEnsureCorrectChain } from '@everipedia/iq-login/client';

function MyComponent() {
  const { status, switchToCorrectChain, targetChain, dismiss } = useEnsureCorrectChain({
    requiredChainId: 252, // e.g. Fraxtal
  });

  if (status === "wrong-network") {
    return (
      <div>
        <p>Please switch to {targetChain?.name}</p>
        <button onClick={switchToCorrectChain}>Switch Network</button>
        <button onClick={dismiss}>Dismiss</button>
      </div>
    );
  }

  if (status === "switching") {
    return <p>Switching network...</p>;
  }

  return <p>Connected to the correct network!</p>;
}
```

### With Status Callback

Use `onStatusChange` to react to transitions — e.g. to open/close a modal:

```tsx
const { status, switchToCorrectChain } = useEnsureCorrectChain({
  requiredChainId: 252,
  onStatusChange: (status, chainName) => {
    if (status === "wrong-network") openSwitchModal();
    if (status === "correct") closeSwitchModal();
  },
});
```

### API Reference

**Options:**

| Prop | Type | Description |
|---|---|---|
| `requiredChainId` | `number` | The chain ID your app requires |
| `onStatusChange` | `(status, chainName?) => void` | Optional callback on every status transition |

**Returns:**

| Field | Type | Description |
|---|---|---|
| `status` | `ChainStatus` | Current status (`"idle"`, `"wrong-network"`, `"switching"`, `"correct"`) |
| `switchToCorrectChain` | `() => Promise<void>` | Trigger a chain switch |
| `dismiss` | `() => void` | Dismiss the wrong-network state |
| `targetChain` | `Chain \| undefined` | Target chain object from wagmi config |
| `isConnected` | `boolean` | Whether the wallet is connected |

## 🎨 Styling

The package uses Tailwind CSS and Shadcn UI Theme. Visit https://ui.shadcn.com/themes for theme customization.

## 🧩 Customizing the UI

All customization props are optional — with none, `Login` renders the default design.

```tsx
import { Login } from "@everipedia/iq-login/client";

<Login
	// Render only the card (no page wrapper/title) so you can place it in your own modal
	variant="card"
	// Replace the default icon + heading block
	header={<MyBannerHeader />}
	// Rendered below the wallet list (connect view only)
	footer={<a href="/claim">← just claim a handle instead (no wallet)</a>}
	// Relabel / re-icon the built-in connectors (keys: Injected, WalletConnect, Web3Auth)
	connectorMeta={{
		Injected: { label: "METAMASK", description: "browser extension" },
		WalletConnect: { label: "WALLETCONNECT", description: "scan with any wallet" },
		Web3Auth: { label: "SOCIAL LOGIN", description: "google, x, discord" },
	}}
	// Override classes per named slot (merged over defaults; your classes win conflicts)
	classNames={{
		connectorButton: "border-slate-700 bg-slate-950 hover:bg-slate-900",
		connectorLabel: "font-bold uppercase tracking-wider",
		connectorDescription: "font-mono",
	}}
/>
```

Available slots: `root`, `container`, `title`, `description`, `card`, `cardBody`, `headerIcon`, `headerTitle`, `connectorList`, `connectorButton`, `connectorIcon`, `connectorLabel`, `connectorDescription`, `connectorError`, `connectorArrow`, `connectedTitle`, `logoutButton`, `addressBox`, `addressText`, `divider`, `dividerLabel`, `verificationCard`, `verificationIcon`, `verificationTitle`, `verificationDescription`, `signButton`, `statusText`.

For full control of a wallet row, pass `renderConnector`:

```tsx
<Login
	renderConnector={({ meta, connect, isPending }) => (
		<button type="button" onClick={connect} disabled={isPending}>
			<meta.icon className="size-8" />
			{meta.label}
		</button>
	)}
/>
```

## 🪝 Fully Custom UI (Headless)

If restyling `Login` isn't enough — you want to own the entire markup — use `useLoginFlow()` and keep none of the built-in UI. The default `Login` component keeps working unchanged for projects that don't customize.

```tsx
"use client";
import { useLoginFlow } from "@everipedia/iq-login/client";

function MyLogin() {
	const {
		connectors,      // [{ connector, meta: { label, description, icon }, connect, isPending, error }]
		isConnected,
		address,
		token,
		signToken,       // trigger the sign-in signature
		signing,         // signature in progress
		signError,
		logout,
		disableAuth,
	} = useLoginFlow({
		connectorMeta: {
			Injected: { label: "MetaMask", description: "browser extension" },
		},
	});

	if (!isConnected) {
		return (
			<ul>
				{connectors.map(({ connector, meta, connect, isPending }) => (
					<li key={connector.uid}>
						<button type="button" onClick={connect} disabled={isPending}>
							<meta.icon className="size-8" />
							{meta.label} — {meta.description}
						</button>
					</li>
				))}
			</ul>
		);
	}

	if (!token && !disableAuth) {
		return (
			<button type="button" onClick={signToken} disabled={signing}>
				{signing ? "Waiting for signature..." : signError ? "Retry" : "Verify identity"}
			</button>
		);
	}

	return (
		<p>
			Signed in as {address} <button type="button" onClick={logout}>Log out</button>
		</p>
	);
}
```

Must be rendered inside `IqLoginProvider`.

## 📝 Usage on Pages Router

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@everipedia/iq-login"]
};

export default nextConfig;
```
