// Copyright (c) - 2025+ the lowlighter/libs authors. AGPL-3.0-or-later
import type { Arg } from "@libs/typing/types"
import type { RequestInterface } from "@octokit/types"
import { globToRegExp } from "@std/path/posix/glob-to-regexp"
import { Octokit } from "@octokit/rest"
import { paginateGraphQL } from "@octokit/plugin-paginate-graphql"
import { paginateRest } from "@octokit/plugin-paginate-rest"
import { getLogger, type Logger } from "@logtape/logtape"
export type { Arg, Logger }

/** GitHub options. */
export type GithubOptions = {
  /** Logger categories forwarded to {@link https://logtape.org | LogTape}'s `getLogger()`. */
  logger?: string[]
  /** Fetch function. */
  fetch?: typeof globalThis.fetch
  /** Linked `import.meta`. */
  meta?: ImportMeta
}

/** GitHub configuration. */
export type GitHubConfiguration = {
  /** GitHub API token. */
  token?: string
  /** User agent. */
  ua?: string
  /** Timezone. */
  timezone?: string
  /** GitHub API base URL. */
  url?: string
}

/** A GitHub API client that can be used to perform REST and GraphQL requests. */
export class GitHub {
  /** Constructor. */
  constructor({ logger: category = ["github"], fetch = globalThis.fetch, meta = import.meta }: GithubOptions = {}, { token, ua, timezone, url }: GitHubConfiguration = {}) {
    this.#meta = meta
    this.#log = getLogger(category)
    this.#log.info(`octokit version: ${Octokit.VERSION}`)
    this.#octokit = new (Octokit.plugin(paginateGraphQL, paginateRest))({
      userAgent: ua,
      auth: token,
      timeZone: timezone,
      baseUrl: url,
      log: { error: this.#log.error.bind(this.#log), warn: this.#log.warn.bind(this.#log), info: this.#log.info.bind(this.#log), debug: this.#log.debug.bind(this.#log) },
      request: { fetch },
    })
  }

  /** Linked `import.meta`. */
  readonly #meta

  /** Linked logger. */
  readonly #log

  /** Linked {@linkcode Octokit}. */
  readonly #octokit

  /**
   * GitHub REST API definition.
   *
   * This property is provided for type hinting purposes only,
   * {@linkcode GitHub.rest()} should always be used to actually perform requests.
   */
  get api(): InstanceType<typeof Octokit>["rest"] {
    return this.#octokit.rest
  }

  /** Returns the entity type and login for a given GitHub handle. */
  async entity(handle: string): Promise<{ entity: "user" | "organization"; login: string } | { entity: "repository"; owner: string; repo: string }> {
    if (globToRegExp("*/*").test(handle)) {
      const [owner, repo] = handle.split("/")
      return { entity: "repository", owner, repo }
    }
    const { data: { type } } = await this.rest(this.api.users.getByUsername, { username: handle })
    return { entity: type.toLowerCase() as "user" | "organization", login: handle }
  }

  /** Returns GitHub API current rate limit. */
  async ratelimit(): Promise<{ core: number; graphql: number; search: number }> {
    const { data: { resources: { core, search, graphql = { remaining: 0, limit: 0 } } } } = await this.rest(this.api.rateLimit.get)
    this.#log.debug("current rate limit: {quota}", {
      quota: {
        core: `${core.remaining}/${core.limit}`,
        graphql: `${graphql.remaining}/${graphql.limit}`,
        search: `${search.remaining}/${search.limit}`,
      },
    })
    return { core: core.remaining, graphql: graphql.remaining, search: search.remaining }
  }

  /** Performs a GitHub REST query. */
  rest<T extends RequestInterface>(endpoint: T, vars?: Arg<T>, _?: { paginate?: false }): ReturnType<T>
  /** Performs a GitHub REST query (with pagination enabled). */
  rest<T extends RequestInterface>(endpoint: T, vars: Arg<T>, _: { paginate: true }): Promise<Awaited<ReturnType<T>>["data"]>
  rest<T extends RequestInterface>(endpoint: T, vars = {} as Arg<T>, { paginate = false } = {}) {
    const { endpoint: { DEFAULTS: { method, url } } } = endpoint
    this.#log.info(`REST ${method} ${url}`)
    return paginate ? this.#octokit.paginate(endpoint, vars) : endpoint(vars)
  }

  /** Performs a GitHub GraphQL query. */
  // deno-lint-ignore no-explicit-any
  async graphql<T = any>(query: string, vars = {} as Record<PropertyKey, unknown>, { paginate = false } = {}): Promise<T> {
    this.#log.info(`GraphQL ${query}`)
    const path = this.#meta.resolve(`./.github/${query}.graphql`)
    this.#log.trace(`loaded query: ${path}\n${query}`)
    query = await fetch(path).then((response) => response.text())
    return paginate ? this.#octokit.graphql.paginate(query, vars) as T : this.#octokit.graphql(query, vars)
  }
}
