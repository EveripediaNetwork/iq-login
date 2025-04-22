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

3. Wrap your application with the IqLoginProvider in your layout file:

```tsx
// app/layout.tsx
import { IqLoginProvider } from "@everipedia/iq-login/client";
import { headers } from "next/headers";

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
          // Optional props:
          // chains={[mainnet]} // Default: mainnet
          // disableAuth={false} // Default: false
        >
          {children}
        </IqLoginProvider>
      </body>
    </html>
  );
}
```

You can use any chain supported by viem. Import your desired chain from 'viem/chains' and pass it to the IqLoginProvider:

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

## 🎨 Styling

The package uses Tailwind CSS and Shadcn UI Theme. Visit https://ui.shadcn.com/themes for theme customization.

## 📝 Usage on Pages Router

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@everipedia/iq-login"]
};

export default nextConfig;
```
