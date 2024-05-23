// Imports
import { expandGlob } from "@std/fs"
import * as YAML from "@std/yaml"
import * as JSONC from "@std/jsonc"
import { fromFileUrl } from "@std/path/from-file-url"
import { basename, dirname } from "@std/path"
import { Logger } from "@libs/logger"
import { record } from "../typing/mod.ts"
const logger = new Logger()

/** Deno version */
const DENO_VERSION = "1.x"

/** Node version */
const NODE_VERSION = "22.x"

/** Bun version */
const BUN_VERSION = "1.x"

/** GitHub bot name */
const BOT_NAME = "github-actions[bot]"

/** GitHub bot mail */
const BOT_MAIL = "41898282+github-actions[bot]@users.noreply.github.com"

async function ci() {
  //
  const root = fromFileUrl(import.meta.resolve("../"))
  const path = fromFileUrl(import.meta.resolve("./workflows/ci.yml"))
  const workflow = YAML.parse(await Deno.readTextFile(path)) as { jobs: record<unknown> }
  workflow.jobs = {}
  const builds = []
  const packages = []
  for await (const { path } of expandGlob(`*/deno.jsonc`, { root })) {
    packages.push(basename(dirname(path)))
    logger.debug(`found: ${packages.at(-1)}`)
  }

  // Build workflow
  for (const name of packages) {
    const log = logger.with({ package: name })
    const pkg = new Package(name)
    builds.push(...pkg.build())

    // Unit tests (deno)
    workflow.jobs[`${name}_test`] = {
      if: `(github.event_name == 'push' && github.ref == 'refs/heads/main') || contains(github.event.pull_request.changed_files, '${name}/')`,
      "runs-on": "ubuntu-latest",
      steps: [
        pkg.setup(),
        pkg.build(),
        pkg.task("dev"),
      ].flat(),
    }
    log.with({ job: `${name}_test` }).info("added")

    // Unit tests (all)
    workflow.jobs[`${name}_test_all`] = {
      "runs-on": "ubuntu-latest",
      needs: [`${name}_test`],
      steps: [
        pkg.setup(),
        { uses: "oven-sh/setup-bun@v1", with: { "bun-version": BUN_VERSION } },
        { uses: "actions/setup-node@v4", with: { "node-version": NODE_VERSION } },
        pkg.build(),
        pkg.task("ci"),
      ].flat(),
    }
    log.with({ job: `${name}_test_all` }).info("added")

    // Bench
    if (pkg.benchmarks) {
      workflow.jobs[`${name}_bench`] = {
        "runs-on": "ubuntu-latest",
        needs: [`${name}_test`],
        steps: [
          pkg.setup(),
          pkg.build(),
          pkg.task("bench"),
        ].flat(),
      }
      log.with({ job: `${name}_bench` }).info("added")
    }

    // Tag
    workflow.jobs[`${name}_tag`] = {
      if: "github.event_name == 'push' && github.ref == 'refs/heads/main'",
      "runs-on": "ubuntu-latest",
      needs: [`${name}_test_all`].concat(pkg.benchmarks ? [`${name}_bench`] : []),
      permissions: {
        contents: "write",
      },
      steps: [
        pkg.setup({ with: { "fetch-depth": 0 } }),
        { id: `${name}_tagging`, uses: "ldelarue/git-next-tag@v0.4", with: { "tag-prefix": `${name}-`, scope: name } },
        {
          if: `\${{ steps.${name}_tagging.outputs.tag }}`,
          shell: "bash",
          run: [
            `deno task tag --version '\${{ steps.${name}_tagging.outputs.semver }}' ${name}`,
            `deno fmt ${name}/deno.jsonc`,
            `git config user.name '${BOT_NAME}'`,
            `git config user.email '${BOT_MAIL}'`,
            "git pull --ff-only",
            `git add ${name}/deno.jsonc`,
            `git commit -m 'chore: bump version \${{ steps.${name}_tagging.outputs.tag }}'`,
            "git push",
            `git tag '\${{ steps.${name}_tagging.outputs.tag }}'`,
            `git show-ref --tags '\${{ steps.${name}_tagging.outputs.tag }}'`,
            `git push origin '\${{ steps.${name}_tagging.outputs.tag }}'`,
          ].join("\n"),
        },
      ].flat(),
    }
    log.with({ job: `${name}_tag` }).info("added")

    // Publish
    workflow.jobs[`${name}_publish`] = {
      if: "github.event_name == 'push' && github.ref == 'refs/heads/main'",
      "runs-on": "ubuntu-latest",
      needs: [`${name}_tag`],
      permissions: {
        "id-token": "write",
        contents: "read",
        packages: "write",
      },
      steps: [
        pkg.setup({ with: { ref: "main" } }),
        { run: `cd ${name} && deno publish` },
      ].flat(),
    }
    log.with({ job: `${name}_publish` }).info("added")
  }

  // Coverage
  workflow.jobs.coverage = {
    if: "github.event_name == 'push' && github.ref == 'refs/heads/main'",
    "runs-on": "ubuntu-latest",
    environment: {
      name: "github-pages",
      url: "${{ steps.pages.outputs.page_url }}",
    },
    permissions: {
      "id-token": "write",
      contents: "read",
      pages: "write",
    },
    steps: [
      Package.setup(),
      { uses: "actions/configure-pages@v5" },
      builds,
      { run: "rm coverage -rf && mkdir -p coverage" },
      packages.map((name) => ({ run: `cd ${name} && deno task ci:coverage` })),
      { run: "deno run --allow-read --allow-write=coverage --allow-net bundle/ts/cli/coverage.ts --root=coverage" },
      { uses: "actions/upload-pages-artifact@v3", with: { path: "coverage" } },
      { id: "pages", uses: "actions/deploy-pages@v4" },
    ].flat(),
  }
  logger.with({ job: "coverage" }).info("added")

  // Save workflow
  await Deno.writeTextFile(path, YAML.stringify(workflow, { lineWidth: 120 }))
  logger.with({ path }).info("saved")
  return workflow
}

/** Package */
class Package {
  /** Constructor */
  constructor(name: string) {
    this.name = name
    this.#config = JSONC.parse(Deno.readTextFileSync(`./${name}/deno.jsonc`)) as { tasks: record<string> }
  }

  /** Package config */
  readonly #config

  /** Package name */
  readonly name

  /** Check if benchmarks are enabled */
  get benchmarks() {
    return !!this.#config.tasks.bench
  }

  /** Setup steps */
  setup(options = {}) {
    return Package.setup(options)
  }

  /** Build steps */
  build() {
    return this.#config.tasks.build
      ? [
        { run: "curl https://sh.rustup.rs -sSf | sh -s -- -y" },
        { run: `cd ${this.name} && deno task build` },
      ]
      : []
  }

  /** Task steps */
  task(name: string) {
    return [
      { run: `cd ${this.name} && deno task ${name}` },
    ]
  }

  /** Setup steps */
  static setup(options = {}) {
    return [
      { uses: "actions/checkout@v4", ...options },
      { uses: "denoland/setup-deno@v1", with: { "deno-version": DENO_VERSION } },
    ]
  }
}

if (import.meta.main) {
  await ci()
}
