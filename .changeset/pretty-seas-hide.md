---
"@everipedia/iq-login": patch
---

Fixes an issue where the app could crash during server-side rendering due to browser-only APIs being accessed on the server.

Wagmi connectors are now only initialized in the browser, preventing `indexedDB`-related errors during SSR and avoiding unhandled rejections in Next.js.
