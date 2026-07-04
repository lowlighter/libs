// deno-lint-ignore-file no-console
/**
 * Publish a package on deno.land/x.
 *
 * 1. Check whether `https://deno.land/x/<name>@<version>` is already published (in which case there is nothing to do)
 * 2. When `map` is set, create a temporary git branch where all imports are resolved against import maps
 *    (raw imports served by deno.land/x cannot resolve import maps, so bare specifiers are rewritten to fully qualified ones)
 * 3. Search the github repository for the deno.land/x webhook, and activate it when `reactive` is set
 *    (this lets you keep the hook disabled by default so unrelated tags are not published)
 * 4. Create and push a git tag named after `version` to trigger the webhook
 * 5. Wait for the webhook payload delivery and for the version to be published on deno.land/x
 * 6. Restore the webhook state, and clean up the temporary branch and tag (when `remove` is set)
 *
 * Note that you must configure the webhook on deno.land/x prior to using this script.
 *
 * @module
 */

// Imports
import { parseArgs } from "@std/cli"
import { expandGlob } from "@std/fs"
import { dirname, resolve } from "@std/path"
import { command } from "@libs/run/command"
import { commit, pull, push, tag } from "@libs/git"
import { manifest, unmap, workspaceImports } from "./_utils.ts"
import { cyan, gray, green, yellow } from "@std/fmt/colors"

/** Publish a package on deno.land/x. */
export async function publish({ token, repository, name, version, directory = "", map = "", reactive = false, remove = false, attempts = 30, delay = 30000, dryrun = false, fetcher = fetch }: Options): Promise<{ name: string; version: string; url: string; changed: boolean }> {
  directory = directory.trim().replace(/\/$/, "")
  const hooked = `https://api.deno.land/webhook/gh/${name}${directory ? `?subdir=${encodeURIComponent(`/${directory}/`)}` : ""}`
  const url = `https://deno.land/x/${name}@${version}`
  const github = (path: string, init = {} as RequestInit) =>
    fetcher(`https://api.github.com/repos/${repository}${path}`, { ...init, headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` } }).then(async (response) => {
      if (!response.ok) {
        await response.body?.cancel()
        throw new Error(`GitHub API request failed with status ${response.status}: ${path}`)
      }
      return response.json()
    })
  const published = () =>
    fetcher(url, { headers: { Accept: "text/html" } }).then(async (response) => {
      await response.body?.cancel()
      return response.ok
    })
  const sleep = () => new Promise((resolve) => setTimeout(resolve, delay))

  // Check if package is already published
  if (await published()) {
    console.error(`${url} is already published, nothing to do`)
    return { name, version, url, changed: false }
  }

  // Resolve imports on a temporary branch if needed
  const branch = { current: "", temporary: "" }
  try {
    if (map) {
      branch.current = command("git", ["rev-parse", "--abbrev-ref", "HEAD"], { sync: true, throw: true }).stdout.trim()
      branch.temporary = `x-${name}-${version}`
      console.error(`switching from ${branch.current} to temporary branch ${branch.temporary}`)
      if (!dryrun) {
        command("git", ["switch", "--create", branch.temporary], { sync: true, throw: true })
        push(branch.temporary)
        command("git", ["branch", "--set-upstream-to", `origin/${branch.temporary}`], { sync: true, throw: true })
      }
      const cwd = resolve(Deno.cwd())
      const workspace = await workspaceImports(cwd)
      const mapped = manifest(dirname(resolve(cwd, map)))?.imports ?? {}
      const exclude = [...new Set([...(manifest(cwd)?.publish?.exclude ?? []), "node_modules", ".git", "coverage", ".github"])]
      for await (const { path } of expandGlob("**/*.ts", { root: cwd, includeDirs: false, exclude })) {
        // Resolve against workspace members, the nearest manifest imports and the specified map
        let local = {} as Record<string, string>
        for (let base = dirname(path); base.startsWith(cwd); base = dirname(base)) {
          const parsed = manifest(base)
          if (parsed) {
            local = parsed.imports ?? {}
            break
          }
        }
        const { result, resolved } = unmap(await Deno.readTextFile(path), { ...workspace, ...local, ...mapped })
        if (resolved) {
          console.error(gray(`resolved ${resolved} imports in ${path}`))
          if (!dryrun)
            await Deno.writeTextFile(path, result)
        }
      }
      console.error(gray(`committing resolved imports on ${branch.temporary}`))
      if (!dryrun) {
        commit(`build(${name}): deno.land/x@${version}`, { all: true })
        push(branch.temporary)
      }
    }

    // Search webhook and activate it if needed
    const webhooks = await github("/hooks") as Array<{ id: number; active: boolean; config: { url?: string } }>
    const hook = webhooks.find(({ config }) => config.url === hooked)
    if (!hook)
      throw new Error(`Could not find a hook with expected url: ${hooked}`)
    console.error(`found hook ${hook.id} (active: ${hook.active})`)
    if (reactive && (!hook.active)) {
      console.error(yellow("hook is inactive prior publishing, activating"))
      if (!dryrun)
        await github(`/hooks/${hook.id}`, { method: "PATCH", body: JSON.stringify({ active: true }) })
    }

    try {
      // Create and push tag to trigger webhook
      console.error(`creating and pushing tag ${version}`)
      const pushed = Date.now()
      if (!dryrun) {
        tag(version, { force: true })
        pull({ rebase: true })
        push(version)
      }

      // Wait for webhook payload delivery and deno.land/x publishing
      if (!dryrun) {
        for (let attempt = 0;; attempt++) {
          const deliveries = await github(`/hooks/${hook.id}/deliveries`) as Array<{ event: string; delivered_at: string }>
          if (deliveries.some(({ event, delivered_at }) => (event === "create") && (Date.parse(delivered_at) >= pushed - delay)))
            break
          if (attempt >= attempts)
            throw new Error("Webhook payload has not been delivered in the expected time frame")
          console.error(gray("webhook payload has not been delivered yet"))
          await sleep()
        }
        console.error(cyan("webhook payload has been delivered"))
        for (let attempt = 0;; attempt++) {
          if (await published())
            break
          if (attempt >= attempts)
            throw new Error("Package has not been published in the expected time frame")
          console.error(gray("package has not been published yet"))
          await sleep()
        }
      }
      console.error(green(`published on ${url}`))
    } finally {
      // Restore hook state if needed
      if (reactive && (!hook.active)) {
        console.error(yellow("hook was inactive prior publishing, restoring state"))
        if (!dryrun)
          await github(`/hooks/${hook.id}`, { method: "PATCH", body: JSON.stringify({ active: false }) })
      }

      // Remove tag if needed
      if (remove && (!dryrun)) {
        console.error(gray(`removing tag ${version} locally and from origin`))
        command("git", ["tag", "--delete", version], { sync: true })
        push(version, { args: ["--delete"] })
      }
    }
  } finally {
    // Remove temporary branch if needed
    if (map && (!dryrun) && branch.temporary) {
      console.error(`switching back to ${branch.current} and deleting temporary branch ${branch.temporary}`)
      command("git", ["switch", branch.current], { sync: true })
      command("git", ["branch", "--delete", "--force", branch.temporary], { sync: true })
      push(branch.temporary, { args: ["--delete"] })
    }
  }

  return { name, version, url, changed: true }
}

/** Publishing options for {@linkcode publish()}. */
export type Options = {
  /** GitHub API token. */
  token: string
  /** GitHub repository (e.g. `octocat/hello-world`). */
  repository: string
  /** Package name on deno.land/x. */
  name: string
  /** Version to publish. */
  version: string
  /** Subdirectory of the repository to publish (optional). */
  directory?: string
  /** Path to an import map. When specified, a temporary branch with all imports resolved is created and published instead. */
  map?: string
  /** Activate the webhook before publishing and restore its state afterwards. */
  reactive?: boolean
  /** Remove the tag after publishing. */
  remove?: boolean
  /** Maximum number of attempts for publishing operations to complete. */
  attempts?: number
  /** Delay between each attempt (in milliseconds). */
  delay?: number
  /** Do not actually publish (no file is written and no mutating git or remote call is made). */
  dryrun?: boolean
  /** Fetch implementation (mostly used for testing purposes). */
  fetcher?: typeof fetch
}

// Entry point
if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["token", "repository", "name", "version", "directory", "map", "attempts", "delay"],
    boolean: ["reactive", "remove", "dryrun", "help"],
  })
  if (args.help) {
    console.error("Usage: deno run --allow-all jsr:@libs/toolbox/scripts/publish/x --token <token> --repository <owner/repo> [options]")
    console.error("")
    console.error("Options:")
    console.error("  --token <token>            GitHub API token")
    console.error("  --repository <owner/repo>  GitHub repository")
    console.error("  --name [name]              Package name on deno.land/x (defaults to the unscoped name from the deno.json(c) in the current directory)")
    console.error("  --version [version]        Version to publish (defaults to the version from the deno.json(c) in the current directory)")
    console.error("  --directory [directory]    Subdirectory of the repository to publish")
    console.error("  --map [map]                Import map path, when specified imports are resolved on a temporary branch which is published instead")
    console.error("  --reactive                 Activate the webhook before publishing and restore its state afterwards")
    console.error("  --remove                   Remove the tag after publishing")
    console.error("  --attempts [attempts=30]   Maximum number of attempts for publishing operations to complete")
    console.error("  --delay [delay=30000]      Delay between each attempt (in milliseconds)")
    console.error("  --dryrun                   Do not actually publish")
    Deno.exit(2)
  }
  if ((!args.name) || (!args.version)) {
    const { name = "", version = "" } = (await manifest(Deno.cwd())) ?? {}
    args.name ||= name.split("/").at(-1)!
    args.version ||= version
  }
  const { token = "", repository = "", name = "", version = "", directory, map, reactive, remove, dryrun } = args
  await publish({ token, repository, name, version, directory, map, reactive, remove, dryrun, attempts: Number(args.attempts) || undefined, delay: Number(args.delay) || undefined })
}
