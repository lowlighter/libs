// Copyright (c) - 2025+ the lowlighter/libs authors. AGPL-3.0-or-later
import { expect, type testing } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { join } from "@std/path/join"
import { sandboxedFetch } from "./fetch.ts"
import { GitHub } from "./github.ts"

const gh = new GitHub({ meta: { resolve: (path: string) => import.meta.resolve(join("./testing/fixtures/github", path)) } as testing, fetch: sandboxedFetch([{ hostname: "api.github.com", redirect: `mock://` }], { paths: [join("./testing/fixtures/github", ".test")] }) }, {
  url: "https://api.github.com",
})

Deno.test("`GitHub.constructor()` instantiates a new instance", () => expect(new GitHub()).toBeInstanceOf(GitHub))

for (
  const { handle, result } of [
    { handle: "octocat/hello-world", result: { entity: "repository", owner: "octocat", repo: "hello-world" } },
    { handle: "octocat", result: { entity: "user", login: "octocat" } },
    { handle: "github", result: { entity: "organization", login: "github" } },
  ]
) {
  Deno.test(`\`GitHub.entity(${inspect(handle)})\` returns ${inspect(result)}`, { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
    await expect(gh.entity(handle)).resolves.toEqual(result)
  })
}

Deno.test("`GitHub.ratelimit()` returns current rate limit.", { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
  await expect(gh.ratelimit()).resolves.toHaveProperty("core")
  await expect(gh.ratelimit()).resolves.toHaveProperty("graphql")
  await expect(gh.ratelimit()).resolves.toHaveProperty("search")
})

for (
  const { options, predicate } of [
    { options: {}, predicate: (result: testing) => result.data },
    { options: { paginate: true }, predicate: (result: testing) => result.length },
  ]
) {
  Deno.test(`\`GitHub.rest(api, data, ${inspect({ options })})\` is supported`, { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
    await expect(gh.rest(gh.api.issues.listForRepo, { owner: "user", repo: "repo" }, options as testing)).resolves.toSatisfy(predicate)
  })
}

for (
  const { query, options, predicate, rejects } of [
    { query: "testing", options: {}, predicate: (result: testing) => result.repository.issue.title },
    { query: "testing_paginate", options: { paginate: true }, predicate: (result: testing) => result.repository.issues.nodes.length },
    { query: "testing_unnamed", rejects: /Missing query name/ },
    { query: "testing_unloadable", rejects: /No data/ },
  ]
) {
  Deno.test(`\`GitHub.graphql(${inspect(query)}, data, ${inspect({ options })})\` is supported`, { permissions: { read: true, net: ["0.0.0.0"] } }, async () => {
    if (rejects)
      await expect(gh.graphql(query)).rejects.toThrow(rejects)
    else
      await expect(gh.graphql(query, { owner: "user", repo: "repo" }, options as testing)).resolves.toSatisfy(predicate as testing)
  })
}
