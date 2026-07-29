---
"@everipedia/iq-login": minor
---

Add UI customization props to `Login`: `variant` ("page" | "card"), per-slot `classNames` overrides, `connectorMeta` label/description/icon overrides, `header`/`footer` slots, and a `renderConnector` render prop. Also adds a headless `useLoginFlow()` hook for building fully custom login UIs without the built-in markup. Rendering with no new props is unchanged.
