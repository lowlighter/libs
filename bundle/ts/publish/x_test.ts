import { publish } from "./x.ts"
import { expect, test } from "@libs/testing"
import { Logger } from "@libs/logger"
import { RetryError } from "@std/async/retry"
import { fromFileUrl } from "@std/path/from-file-url"

const name = "deno-world"
const version = "1.0.0"
const url = `https://deno.land/x/${name}@${version}`

test("`publish()` publishes package to `deno.land/x`", async () => {
  await expect(publish({
    logger: new Logger({ level: "disabled" }),
    token: "github_pat_",
    repository: "octocat/hello-world",
    name,
    version,
    dryrun: true,
    delay: 100,
  })).resolves.toMatchObject({ name, version, url, changed: true })
})

test("`publish()` publishes package subdirectory to `deno.land/x`", async () => {
  await expect(publish({
    logger: new Logger({ level: "disabled" }),
    token: "github_pat_",
    repository: "octocat/hello-world",
    directory: "subdirectory",
    name,
    version,
    dryrun: true,
    delay: 100,
  })).resolves.toMatchObject({ name, version, url, changed: true })
})

test("`publish()` supports reactive and remove options", async () => {
  await expect(publish({
    logger: new Logger({ level: "disabled" }),
    token: "github_pat_",
    repository: "octocat/hello-world",
    name,
    version,
    reactive: true,
    remove: true,
    dryrun: true,
    delay: 100,
  })).resolves.toMatchObject({ name, version, url, changed: true })
})

test("`publish()` has no effect if package version is already published on `deno.land/x`", async () => {
  await expect(publish({
    logger: new Logger({ level: "disabled" }),
    token: "github_pat_",
    repository: "octocat/hello-world",
    name,
    version: "already_published",
    dryrun: true,
    delay: 100,
  })).resolves.toMatchObject({ name, version: "already_published", changed: false })
})

test("`publish()` handles publishing errors", async () => {
  await expect(publish({
    logger: new Logger({ level: "disabled" }),
    token: "github_pat_",
    repository: "octocat/hello-world",
    name,
    version: "failure",
    dryrun: true,
    delay: 100,
  })).rejects.toThrow(RetryError)
})

test("`publish()` handles imports map resolution", async () => {
  const dir = Deno.cwd()
  try {
    Deno.chdir(fromFileUrl(import.meta.resolve("./testing")))
    await expect(publish({
      logger: new Logger({ level: "disabled" }),
      token: "github_pat_",
      repository: "octocat/hello-world",
      map: "deno.jsonc",
      name,
      version,
      dryrun: true,
      delay: 100,
    })).resolves.toMatchObject({ name, version, url, changed: true })
  } finally {
    Deno.chdir(dir)
  }
}, { permissions: { read: true } })
