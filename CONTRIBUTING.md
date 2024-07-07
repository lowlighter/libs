# Reference for contributors

## Scope

This repository is a monorepo containing multiple packages.

We try to offer high quality packages that are well documented, tested and maintained, which is why each new contribution **MUST**:

- Be tested **AND** covered
  - If some parts are not covered, either refactor the code in a way that it can be tested or add a comment explaining why it's really not possible
- Be well documented (including internal APIs)
- Be consistent with the rest of the repository
  - Use the same "vocabulary"
  - Prefers single-word names for public APIs, or camelCase if it cannot be clear enough
- Avoid introducing unnecessary breaking changes
- Avoid introducing unnecessary dependencies
  - If a dependency is required, it should be justified in the pull request

> [!IMPORTANT]
> Because this project is relatively huge, maintainers reserve the right to refuse contributions that do not meet these requirements or are deemed out of scope.
> If you're unsure about a contribution, feel free to open an issue to discuss it first.

## Automated releases

When a pull request is merged, a new release is automatically created when applicable.

This is why all commits **MUST** follow [Conventional Commits](https://www.conventionalcommits.org) rules:

- Use a scope matching the **exact** name of the package (e.g. `feat(testing): my awesome new feature`)
- Use the `!` modifier to indicate for breaking changes (e.g. `fix(testing)!: renamed members from public api`)

The new version will be computed automatically based on the changes introduced in the pull request and published on applicable package managers.

> [!WARNING]
> [deno.land/x/libs] is not published under semantically versioned tags, but under a date-based tag (`YYYY.MM.DD`).
>
> This is because it contains multiple packages so it's not possible to determine a single version for the whole repository.
> Because of this limitation, it also means that only a single release can be made per day on this registry.

## Tasks

To ease maintenance, a set of tasks are available to contributors through `deno task`.

The following tasks are available from `@libs/*` scopes:

- `test`: Run `deno test` while collecting coverage, looking for leaks and checking documentation examples
- `test:deno`: Perform tests on deno runtime
- `test:deno-future`: Same as `test:deno` but with `DENO_FUTURE=1` environment variable set
- `test:others`: Perform tests on other runtimes (node, bun)
- `coverage:html`: Generate coverage report (html)
- `dev`: Run `deno fmt`, `deno test` (deno only), print detailed coverage, and `deno task lint`
- `lint`: Run `deno fmt`, `deno lint`, `deno doc --lint`, `deno publish --dry-run`

The following tasks are available from `@libs` scope:

- `lint`: Run `deno task lint` for all packages
- `make:readme`<sub>🤖</sub>: Generate main `README.md` file
  - _This action is performed automatically by CI, do **NOT** submit changes resulting from this command in pull requests_
- `make:config`<sub>🤖</sub>: Generate and sync all `*/deno.jsonc` to match metadata of main `deno.jsonc`
  - _This action is performed automatically by CI, do **NOT** submit changes resulting from this command in pull requests_
  - The following properties additonal properties to `*/deno.jsonc` are supported:
    - `icon:string`: Package icon
    - `description:string`: Package description
    - `keywords:Array<string>`: Package keywords (for npm)
    - `supported:Array<"deno"|"node"|"bun"|"cloudflare-workers"|"browsers">`: List of supported runtimes
    - `playground?:string`: URL to playground
    - `npm?:boolean`: Is this package published on npm?
    - `["deno.land/x"]?:boolean`: Is this package published on deno.land/x?
    - `types?:"slow"`: Use `--allow-slow-types` when publishing _(do not use except is absolutely needed)_
    - `test:permissions?:Deno.TestDefinition["permissions"]`: Permissions required for tests _(these should be minimal, note that `--allow-run=deno,node,bun,npx` permissions is always appended as they're required for cross-runtime testing)_
- `make:config-upgrade`<sub>👨‍💻</sub>: Same as `make:config` but also upgrade dependencies of `*/deno.jsonc` with the ones from `deno.jsonc`
  - _This action is to be performed by a maintainer, each package should be separately commited to ensure that each package are correctly rebuild in the CI_
- `make:tag`<sub>🤖</sub>: verify that new tag is semantically greater than previous one
  - _This action is performed automatically by CI, do **NOT** run it locally_
