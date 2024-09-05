# 🔐 IQ Login

## 🌟 Introduction

@everipedia/iq-login is a package that provides easy integration of IQ.wiki login functionality into your Next.js applications. It allows users to authenticate using their crypto wallet and web3auth with rainbow kit seamlessly.

## 📦 Installation

To install the package, run:

```bash
pnpm install @everipedia/iq-login wagmi@2.12.4 viem@2.x @rainbow-me/rainbowkit@2.1.4
```

## 🛠️ Setup

1. Setup Environment Variables

```bash
# .env

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_IS_PRODUCTION=true/false
NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

2. Add the package to your Tailwind CSS configuration:
```tsx
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

3. Wrap your application with the RainbowKitClientProvider in your layout file:

```tsx
// app/layout.tsx

import { RainbowKitClientProvider } from "@everipedia/iq-login";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RainbowKitClientProvider>{children}</RainbowKitClientProvider>
      </body>
    </html>
  );
}
```

4. Add login page to your application. Note: You need to import rainbowkit styles in your application.
```tsx
// app/login/page.tsx

import { Login } from '@everipedia/iq-login';
import "@rainbow-me/rainbowkit/styles.css"; // NOTE: For pages router this should be in _app.tsx

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

The package provides a custom hook called useAuth that can be used to get the current user's information.
It can be used to re-sign token, get the current token, and check if the user is authenticated.

```tsx
// components/my-component.tsx

import { useAuth } from '@everipedia/iq-login';

function MyComponent() {
  const { token, loading, reSignToken, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (token) {
    return <div>Authenticated! Token: {token}</div>;
  }

  return (
    <div>
      <button onClick={() => reSignToken(true)}>Sign In</button>
    </div>
  );
}
```

## 🎨 Styling

The package is designed to work with Tailwind CSS and Shad-cn Theme. Make sure to add the shad-cn theme to your project.
You can learn more about it here: https://ui.shadcn.com/themes

# 📝 Usage on Pages router

1. Add the package in transpilePackages in your next.config.js file.

```tsx
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@everipedia/iq-login"]
};

export default nextConfig;
``` 
2. Add the rainbowkit styles in your _app.tsx file.

```tsx
// _app.tsx
import "@rainbow-me/rainbowkit/styles.css";
```
