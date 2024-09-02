# 🔐 IQ Login

## 🌟 Introduction

@everipedia/iq-login is a package that provides easy integration of IQ.wiki login functionality into your Next.js applications. It allows users to authenticate using their crypto wallet and web3auth with rainbow kit seamlessly.

## 📦 Installation

To install the package, run:

```bash
pnpm install @everipedia/iq-login
```


## 🛠️ Setup

1. Add the package to your Tailwind CSS configuration:
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
2. Wrap your application with the RainbowKitClientProvider in your layout file:

```typescript
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


3. Add login page to your application.
```ts
import { Login } from '@everipedia/iq-login';

// In your component or page
const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <Login />
    </div>
  );
};

export default LoginPage;
```


## 🔒 Use Auth Hook

The package provides a custom hook called useAuth that can be used to get the current user's information.
It can be used to re-sign token, get the current token, and check if the user is authenticated.

```ts
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