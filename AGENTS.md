# Code style guidelines for agents

These rules describe the house style. They are repository-agnostic: apply them to any codebase that includes this file. When editing existing code, match these rules even if nearby code predates them.

## Philosophy: context-sized code

Code is written in small self-contained "contexts": each function, block or file is short enough that there is no ambiguity about what an identifier refers to. This is what makes aggressive naming brevity safe. Keep units small and scoped; if a name could be confused with
something else in scope, the context is too big.

## Naming

- Prefer **single-word variables, not shortened**: `output`, `command`, `value`, `property`, `release` — not `outputBuffer`, `cmd`, `val`, `prop`.
  ```ts
  const quoted = false
  let escape = false
  for (const char of text) { ... }
  ```
- Public types are `PascalCase` (`Options`, `Result`, `Nullable`); internal-only type aliases are `lowercase` (`type detail = ...`, `type trap = ...`, `type result = ...`).
- Never use raw `any`: declare a named alias once and reuse it — `type testing = any` (test-only casts), `type rw = any` (read-write views), `type target = any` — with the matching lint ignore on that single line or file.
- Internal (non-exported-API) modules are underscore-prefixed: `_parser.ts`, `_utils.ts`. Same for shadow aliases that wrap or rename an import or a reserved word: `const _fetch = globalThis.fetch`, `{ throw: _throw }`.
- Whole-module imports get a short lowercase namespace: `import * as is from ...`.

## File layout

- **Public API first, private helpers after, types generally last.** A file reads top-down: exported functions/classes, then unexported helpers, then internal type aliases at the very bottom. Exception: types that _are_ the public API (an exported `Options`/`Result` consumed by
  the signatures below) sit at the top, right after imports — "public API first" wins over "types last", however, if the main export of the file is a class, then the class itself as priority over the types which should be declared after it.
- The import block is headed by a `// Imports` banner comment. Use `import type` for type-only imports, and re-surface types that belong to the public API with a companion `export type { ... }` line right after the imports. Do not combine type-only imports with value imports in
  the same statement.
  ```ts
  // Imports
  import { parse } from "./parse.ts"
  import type { Options, Result } from "./types.ts"
  export type { Options, Result }
  ```
- **Entry points are named `mod.ts` and contain no code** — only re-exports:
  ```ts
  export { parse } from "./parse.ts"
  export { stringify } from "./stringify.ts"
  export type * from "./types.ts"
  ```
- **Do not care about line width.** Keep definitions, signatures and type aliases on a single line, however long. Only wrap when it genuinely improves things — e.g. a large options destructuring with many defaults in an implementation signature may spread over multiple lines.

## Documentation

- **Every function and method has a JSDoc**, including private ones. Usually a single line; spanning multiple lines is fine only when there is really something to explain.
  ```ts
  /** Returns the handle type for a given mode. */
  function handle(mode: mode) { ... }
  ```
- Every exported `const`, `type`, `interface` and interface member also gets a `/** */` line.
- Use `{@link}` / `{@linkcode}` for cross-references and markdown admonitions.
- Comment big chunks of code with **one line**, as section banners — never over-explain:
  ```ts
  // Buffer output and resume the interaction generator
  ...a dozen lines...
  // Compute result
  ...
  ```

## Types

- **Prefer inferred types** everywhere except the public API (exported signatures are explicitly typed — registry/linters require it anyway).
- Use `as` for type assertions: `{} as Options`, `value as typeof CustomEvent` — not angle brackets, not unnecessary intermediate annotations.
- **Options-object pattern**: a function's configuration is a single exported `Options` (inside a bigger package, prefix the type with the function or class it belongs to) type documented field-by-field, consumed by destructuring-with-defaults in the signature.
  ```ts
  export function command(command: string, { log = null, throw: _throw = false, ...options } = {} as Options) { ... }
  ```
- **Overloads for variants**: each overload gets its own JSDoc and `@example`; the implementation signature is a single untyped/general one below them.

## Encapsulation

- **Use private accessors (`#field`, `#method()`) whenever possible** — do not expose internals to end users.
- When internals must be shared beyond the class but not exported to users, use an **unexported symbol**: `const internal = Symbol("internal")`, stored as a hidden property (`node[internal]`).
- When a symbol must cross module boundaries, export it with a `$$` prefix: `export const $$fetch = Symbol("[[fetch]]")`.

## Errors

- Never throw literals. Always throw a built-in error type, chosen semantically: `TypeError` for validation, `SyntaxError` for parsing, `RangeError` for bounds, `EvalError` for subprocess/execution failure, `Error` otherwise.
- Error messages are rich and specific: include the offending value or name and what was expected.

## Tests

- **Test files live beside their code**: `foo.ts` → `foo_test.ts`, importing its counterpart relatively (`import { foo } from "./foo.ts"`).
- **Each test file independently covers 100% of its counterpart.** Non-testable files (pure re-export `mod.ts` barrels, type-only modules, generated code, scripts) are the only exceptions.
- Use native `Deno.test` with `expect`-style assertions. Declare required permissions inline in the test options object.
- (Rare) when the same suite must run against multiple implementations (e.g. alternative backends), do not duplicate it: import the shared test file with a **URL hash** to distinguish instances:
  ```ts
  // wasm/parse_test.ts
  import "../parse_test.ts#wasm"
  // parse_test.ts reads: new URL(import.meta.url).hash.slice(1)
  ```

## Idioms

- Discard fire-and-forget promises and unwanted return values with `void`: `void status.then(...)`, `return void log.debug(...)` when the type checker complains about it.
- Parenthesize boolean sub-expressions in compound conditions: `if ((!success) && (_throw))`.
- Use `using` / `Symbol.asyncDispose` for resource lifecycles (processes, files, servers).
- Lint suppressions are disciplined: file-level `deno-lint-ignore-file` only for allowances pervasive to that file, inline single-rule `deno-lint-ignore` for one-offs. Never suppress more rules than needed.
- Assume a modern environment where you have access to all recent ECMAScript features, and use them.
- You have to avoid using external dependencies unless:
  - it is in the deno standard library (`jsr:@std`), or the `jsr:@libs` scope
  - the dependency is genuinely necessary, almost a standard (e.g. zod, three.js, etc.)

## Appendix: tooling baseline

The style above assumes this formatter/linter baseline (Deno):

```jsonc
{
  "fmt": {
    "semiColons": false,
    "useBraces": "preferNone",
    "singleBodyPosition": "nextLine",
    "lineWidth": 1000
  },
  "lint": {
    "rules": {
      "include": [
        "ban-untagged-todo",
        "eqeqeq",
        "no-console",
        "no-eval",
        "no-external-import",
        "no-inferrable-types",
        "no-sync-fn-in-async-fn",
        "no-throw-literal",
        "single-var-declarator",
        "triple-slash-reference"
      ]
    }
  }
}
```

Quality gate: each test file is type-checked, linted, format-checked, then run with coverage and sanitizers (`--sanitize-ops --sanitize-resources --trace-leaks`, seeded RNG). The target is 100% branch/function/line coverage per file. Format with `deno fmt` from the repository
root only, so every directory picks up the workspace config.
