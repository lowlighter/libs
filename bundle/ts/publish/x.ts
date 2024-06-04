// Imports
import { Octokit } from "octokit"
import { Logger } from "@libs/logger"
import { assert } from "@std/assert"
import { command } from "@libs/run/command"
import { retry } from "@std/async/retry"
import * as JSONC from "@std/jsonc"
import { expandGlob } from "@std/fs"
import { resolve } from "@std/path"
import type { record } from "@libs/typing"
import { unmap as _unmap } from "../unmap.ts"

/** Publishing options */
type options = {
  /** Logger instance. */
  log?: Logger
  /** GitHub API token. */
  token: string
  /** GitHub repository. */
  repository: string
  /** Subdirectory of repository to publish. */
  directory?: string
  /** Package name. */
  name: string
  /** Version name. */
  version: string
  /**
   * Import map.
   * If provided, a new temporary branch will be created.
   * All imports in TypeScript files will be resolved against specified import map and committed,
   * so an import map is no longer needed after publishing (as HTTP imports will not resolve remote import maps).
   * This branch will be pushed to origin and deleted after publishing.
   */
  map?: string
  /**
   * Should hook be forcefully activated before proceeding ?
   * This option is useful when you manage a mono-repository with multiple packages and need to handle unrelated tags.
   * This way you can keep your hook disabled and only activate it when needed.
   */
  reactive?: boolean
  /**
   * Remove tag after publishing ?
   * This option is useful when want to use a different version name for publishing than tags you are using.
   */
  remove?: boolean
  /** Maximum number of attempts to performs for publishing operations to complete. */
  attempts?: number
  /** Delay between each attempt */
  delay?: number
  /** Do not actually publish package. */
  dryrun?: boolean
}

/**
 * Publish a TypeScript package on deno.land/x.
 * This is suited for mono-repositories with different tagging conventions.
 *
 * The `reactive` option lets you have multiple deno.land/x webhook for different packages in the same repository.
 * Disable all hooks by default and this function will activate the hook before publishing and deactivate it after.
 *
 * The `remove` option lets you use a different version name for publishing than tags you are using.
 * It'll create a tag with the same name as `version` and remove it after publishing.
 * Useful if your tags are prefixed with a `v` for example but you want the version on deno.land/x to be without it.
 *
 * Note that you must configure webhook on deno.land/x prior to using this function.
 *
 * @example
 * ```ts
 * import { publish } from "./x.ts"
 * await publish({
 *   token: "github_pat_",
 *   repository: "octocat/hello-world",
 *   name: "hello-world", // Name on deno.land/x
 *   directory: "dist", // Subdirectory to publish (optional)
 *   version: "1.0.0", // Version to publish
 *   reactive: true, // Activate hook before publishing if they were disabled
 *   remove: true, // Remove tag after publishing
 * })
 * ```
 */
export async function publish({ log = new Logger(), token, repository, directory, name, version, map, reactive = false, remove = false, attempts = 30, delay = 30000, dryrun = false }: options): Promise<{ name: string; version: string; url: string; changed: boolean }> {
  // Setup
  const [owner, repo] = repository.split("/")
  log = log.with({ owner, repo, name })
  directory = directory?.trim().replace(/\/$/, "")
  const api = `https://api.deno.land/webhook/gh/${name}${directory ? `?subdir=${encodeURIComponent(`/${directory}/`)}` : ""}`
  const url = `https://deno.land/x/${name}@${version}`
  const request = { fetch }
  if (dryrun) {
    const requested = new Set<string>()
    Object.assign(request, {
      // deno-lint-ignore require-await
      async fetch(url: string, { method = "GET" } = {}) {
        let data = null
        switch (true) {
          case (method === "GET") && new URLPattern("https://api.github.com/repos/:owner/:repo/hooks").test(url):
            data = [{ id: 1, active: false, config: { url: api } }]
            break
          case (method === "PATCH") && new URLPattern("https://api.github.com/repos/:owner/:repo/hooks/:id").test(url):
            data = {}
            break
          case (method === "GET") && new URLPattern("https://api.github.com/repos/:owner/:repo/hooks/:id/deliveries").test(url):
            data = requested.has(url) ? [{ event: "create", delivered_at: new Date().toISOString() }] : []
            break
          case (method === "GET") && new URLPattern("https://deno.land/x/:package").test(url.replace(/\?.*$/, "")):
            data = requested.has(url) ? "200 - OK" : "404 - Not Found"
            if (url.includes("already_published")) {
              data = "200 - OK"
            }
            if (url.includes("failure")) {
              data = "404 - Not Found"
            }
            break
        }
        requested.add(url)
        return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
      },
    })
  }
  const octokit = new Octokit({ auth: token, request, throttle: { enabled: false }, retry: { enabled: !dryrun } })

  // Check if package is already published
  const check = await request.fetch(`${url}?check`, { headers: { Accept: "text/html" } }).then((r) => r.text())
  if (!check.includes("404 - Not Found")) {
    log.debug(`package is already published at ${url}, nothing to do`)
    return { name, version, url, changed: false }
  }

  // Resolve import map if needed
  const branch = { current: "", temporary: "" }
  if (map) {
    branch.current = (await command("git", ["rev-parse", "--abbrev-ref", "HEAD"], { log, throw: true, dryrun })).stdout.trim()
    branch.temporary = `x-${name}-${version}-${Date.now()}`
    log.debug(`current branch: ${branch.current}`)
    log.debug(`temporary branch: ${branch.temporary}`)
    await command("git", ["switch", "--create", branch.temporary], { log, throw: true, dryrun })
    log.log(`on ${branch.temporary}`)
    log.info("resolving imports from map")
    await unmap({ log, directory, map, dryrun })
    log.debug("imports have been resolved")
    log.info(`pushing changes on temporary branch ${branch.temporary} to origin`)
    await command("git", ["add", "."], { log, throw: true, dryrun })
    await command("git", ["commit", "--message", `build(${name}): deno.land/x@${version}`], { log, throw: true, dryrun })
    await command("git", ["push", "origin", branch.temporary], { log, throw: true, dryrun })
    log.debug(`pushed changes from temporary branch ${branch.temporary} to origin`)
  }

  // Fetch webhook
  log.debug(`searching for hook: ${api}`)
  const { data: webhooks } = await octokit.rest.repos.listWebhooks({ owner, repo })
  const hook = webhooks.filter(({ config }: { config: { url?: string } }) => config.url === api)[0]!
  assert(hook, `Could not find a hook with expected url: ${api}`)
  log.debug(`found hook: ${hook.id}`)

  // Active hook if needed
  if (reactive && (!hook.active)) {
    log.log("hook is inactive prior publishing, activating")
    await octokit.rest.repos.updateWebhook({ owner, repo, hook_id: hook.id, active: true })
    log.debug("hook is now active")
  }

  try {
    // Create git tag
    const { stdout: object } = await command("git", ["rev-parse", "HEAD"], { throw: true, dryrun })
    const { stdout: email } = await command("git", ["config", "user.email"], { throw: true, dryrun })
    const { stdout: author } = await command("git", ["config", "user.name"], { throw: true, dryrun })
    log.info(`creating tag ${version} on commit ${object} by ${author} <${email}>`)
    await command("git", ["tag", "--force", version], { log, throw: true, dryrun })
    await command("git", ["show-ref", "--tags", version], { log, throw: true, dryrun })
    log.info(`pushing tag ${version} to origin`)
    await command("git", ["pull", "--rebase"], { log, throw: true, dryrun })
    await command("git", ["push", "origin", version], { log, throw: true, dryrun })
    log.debug(`tag ${version} has been pushed to origin`)

    // Wait for webhook payload delivery
    log.debug("waiting for webhook payload delivery")
    await retry(async () => {
      const { data: deliveries } = await octokit.rest.repos.listWebhookDeliveries({ owner, repo, hook_id: hook.id })
      if (!deliveries.some(({ event, delivered_at }: { event: string; delivered_at: string }) => (event === "create") && (new Date().getTime() >= new Date(delivered_at).getTime()))) {
        log.debug("webhook payload has not been delivered yet")
        throw new Error("Webhook payload has not been delivered in the expected time frame")
      }
    }, { minTimeout: delay, maxTimeout: delay, maxAttempts: attempts })
    log.debug("webhook payload has been delivered")

    // Wait for deno.land/x publishing
    log.debug("waiting for deno.land/x publishing")
    await retry(async () => {
      const text = await request.fetch(url, { headers: { Accept: "text/html" } }).then((r) => r.text())
      if (text.includes("404 - Not Found")) {
        log.debug("package has not been published yet")
        throw new Error("Package has not been published in the expected time frame")
      }
    }, { minTimeout: delay, maxTimeout: delay, maxAttempts: attempts })
    log.debug("published on deno.land/x")
  } finally {
    // Deactivate hook if needed
    if (reactive && (!hook.active)) {
      log.log("hook was inactive prior publishing, restoring state")
      await octokit.rest.repos.updateWebhook({ owner, repo, hook_id: hook.id, active: false })
      log.debug("hook is now inactive")
    }

    // Remove tag if needed
    if (remove) {
      log.log(`removing tag ${version} locally and from origin`)
      await command("git", ["tag", "--delete", version], { log, dryrun })
      await command("git", ["push", "--delete", "origin", version], { log, dryrun })
      log.debug(`tag ${version} has been removed`)
    }

    // Remove temporary branch if needed
    if (map) {
      log.info(`switching back to ${branch.current}`)
      await command("git", ["switch", branch.current], { log, throw: true, dryrun })
      log.debug(`on ${branch.current}`)
      log.info(`deleting temporary branch ${branch.temporary}`)
      await command("git", ["branch", "--delete", branch.temporary], { log, throw: true, dryrun })
      await command("git", ["push", "origin", "--delete", branch.temporary], { log, throw: true, dryrun })
      log.debug(`deleted temporary branch ${branch.temporary}`)
    }
  }

  return { name, version, url, changed: true }
}

/** Resolve import map. */
async function unmap({ log: logger, map, directory = ".", exclude = [], dryrun }: { log: Logger; map: string; directory?: string; exclude?: string[]; dryrun?: boolean }) {
  const root = resolve(`${directory}`).replaceAll("\\", "/")
  const { imports } = JSONC.parse(await Deno.readTextFile(resolve(root, map))) as record<record<string>>
  exclude.push("node_modules")
  logger.log(`processing files in ${root}`)
  for await (const { path } of expandGlob("**/*.ts", { root, exclude })) {
    const log = logger.with({ path: path.replaceAll("\\", "/").replace(`${root}/`, "") }).debug("found")
    const content = await Deno.readTextFile(path)
    const { result, resolved } = _unmap(content, imports, { log })
    if (resolved) {
      log.debug(`resolved ${resolved} imports`)
    } else {
      log.debug("no imports to resolve")
    }
    if (!dryrun) {
      await Deno.writeTextFile(path, result)
      log.debug("file updated")
    }
  }
}
