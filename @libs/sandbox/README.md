# 📦 Sandboxing utilities

[![JSR](https://jsr.io/badges/@libs/sandbox)](https://jsr.io/@libs/sandbox) [![JSR Score](https://jsr.io/badges/@libs/sandbox/score)](https://jsr.io/@libs/sandbox) [![Coverage](https://libs-coverage.lecoq.io/sandbox/badge.svg)](https://libs-coverage.lecoq.io/sandbox)

- [`📚 Documentation`](https://jsr.io/@libs/sandbox/doc)

## ✨ Features

- Sandboxed `Browser` instances powered by [`@astral/astral`](https://jsr.io/@astral/astral), with configurable viewport, permissions and cache.
- `fetch()` interception: redirect, mock or disable requests through declarative `FetchRules`, with support for file-based mock handlers resolved from `mock:` URLs.
- `GitHub` API client wrapping [`@octokit/rest`](https://www.npmjs.com/package/@octokit/rest) with REST and GraphQL pagination, and mockable transport.
- `testing/mock` helpers to author schema-validated mock handlers with static or dynamic responses.

## 📑 Examples

### Intercept fetch requests

```ts
import { sandboxedFetch } from "./fetch.ts"

// Requests matching a rule are redirected, mocked or blocked, others pass through
const fetch = sandboxedFetch([
  { hostname: "example.test", respond: { status: 200, body: "mocked!" } },
])
const response = await fetch("https://example.test")
console.assert(await response.text() === "mocked!")
```

### Drive a sandboxed browser

```ts
import { Browser } from "./browser.ts"

await using browser = new Browser()
await using page = await browser.page("about:blank")
```

## 📜 License

```plaintext
Copyright (c) - 2025+ the lowlighter/libs authors. AGPL-3.0
```

> [!IMPORTANT]
> Unlike the other packages of this monorepo, this package is licensed under the [GNU Affero General Public License v3.0](./LICENSE).
