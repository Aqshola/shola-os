# Routes Guide

## Current Routes

Based on `@solidjs/router` in `src/index.tsx`:

| Path | Page | Description |
|------|------|-------------|
| `/` | Desktop | Main Windows 98 desktop |

## Adding Routes

1. Import page component
2. Add route in router config:

```tsx
import { Route } from "@solidjs/router";
import SomePage from "./pages/SomePage";

<Route path="/some-path" component={SomePage} />
```

## Navigation

```tsx
import { A } from "@solidjs/router";

<A href="/desktop">Go to Desktop</A>
```
