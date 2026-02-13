---
"@everipedia/iq-login": patch
---

Add `useEnsureCorrectChain` hook to standardize wallet network enforcement in dApps.

This hook introduces a unified status state machine (`idle` → `wrong-network` → `switching` → `correct`) for managing connected wallet chain state. It includes utilities for programmatic network switching, dismissal handling, and an optional `onStatusChange` callback for reacting to status transitions. Documentation has been added to the README with usage examples and API reference.
