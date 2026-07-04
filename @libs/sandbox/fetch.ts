// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import type { Arg, Optional } from "@libs/typing/types"
import type { Handler } from "./testing/mock.ts"
import { pick } from "@std/collections/pick"
import { STATUS_CODE as Status, STATUS_TEXT as StatusText } from "@std/http/status"
import { basename } from "@std/path/basename"
import { join } from "@std/path/join"
import { normalize } from "@std/path/posix/normalize"
import { fromFileUrl } from "@std/path/from-file-url"
import { getLogger, type Logger } from "@logtape/logtape"
import { filetype, list } from "@libs/toolbox/filesystem"
import { mocks } from "./constants.ts"
export type { Arg, Logger, Optional }

/** URL pattern to intercept mock requests. */
const testpattern = new URLPattern({ protocol: mocks.protocol })

/** Symbol to access the original fetch implementation. */
export const $$fetch = Symbol("[[fetch]]")

/** Interceptor rules. */
export type FetchRules = Array<
  URLPatternInit & {
    /** Redirection URL. */
    redirect?: string
    /** Static mocked response. */
    respond?: StaticMockedResponse
    /** Whether to ignore case when matching URL components. */
    ignoreCase?: boolean
  }
>

/** Static mocked response. */
export type StaticMockedResponse = {
  /** HTTP status code. */
  status?: number
  /** HTTP headers. */
  headers?: Record<string, string>
  /** Response body. */
  body?: BodyInit
}

/** Fetch options. */
export type FetchOptions = {
  /**
   * Logger categories forwarded to {@link https://logtape.org | LogTape}'s `getLogger()`.
   *
   * As recommended for libraries, the actual output is left to the host application (through {@link https://logtape.org/manual/config | LogTape configuration}).
   */
  logger?: string[]
  /** Paths to search for mock files and directories. */
  paths?: Array<Optional<string>>
  /** If `true`, disables all non-mocked requests (useful for browser environments). */
  browser?: boolean
}

/** Provides a fetch function with support for interceptors and mocks. */
export function sandboxedFetch(rules: FetchRules, { logger: category = ["fetch"], paths: _paths = [], browser = false }: FetchOptions = {}): typeof globalThis.fetch {
  const $fetch = (globalThis.fetch as unknown as { [$$fetch]?: typeof globalThis.fetch })?.[$$fetch] ?? globalThis.fetch
  const _log = getLogger(category)
  const paths = _paths.filter((path): path is string => Boolean(path))
    .filter((path) => ["file:", "http:", "https:"].includes(`${URL.parse(path)?.protocol}`))
    .map((path) => fromFileUrl(new URL(mocks.tld, path)))
  return Object.assign(async function fetch(input: RequestInfo | URL, init?: RequestInit) {
    let request = input instanceof Request ? input : new Request(input, init)
    let respond = undefined as Arg<typeof mock, 1>["respond"]
    const log = _log.with({ method: request.method, url: request.url })
    log.info("{method} {url}")
    // Apply interceptors
    if (rules.length) {
      const interceptors = rules.map(({ redirect, respond, ignoreCase = false, ...pattern }) => ({ pattern: new URLPattern(pattern, { ignoreCase }), redirect, respond }))
      for (const interceptor of interceptors) {
        const url = new URL(request.url)
        const captured = interceptor.pattern.exec(url.href)
        if (!captured)
          continue
        log.trace("matched: {url} → {pattern}", format(interceptor.pattern, request.url))
        let redirect = url
        // Use static mocked response
        if (interceptor.respond) {
          respond = interceptor.respond
          redirect = new URL(`${mocks.protocol}://${url.href.replace(url.protocol, "")}`)
        } // Compute redirection
        else if (interceptor.redirect) {
          redirect = URL.canParse(interceptor.redirect) ? new URL(interceptor.redirect) : interceptor.redirect.startsWith("/") ? new URL(`${url.protocol}//${url.host}${interceptor.redirect}`) : new URL(`${url.protocol}//${interceptor.redirect}`)
          if ((redirect.protocol === `${mocks.protocol}:`) && (!redirect.host))
            redirect = new URL(`${redirect.protocol}//${url.host}`)
          redirect.pathname = join(redirect.pathname, captured.pathname.groups._ ?? url.pathname)
          redirect.username ||= captured.username.groups._ ?? ""
          redirect.password ||= captured.password.groups._ ?? ""
          redirect.hash ||= captured.hash.groups._ ?? ""
          new URLSearchParams(captured.search.groups._).forEach((value, key) => redirect.searchParams.set(key, value))
        }
        request = new Request(redirect, request)
        log.debug("redirected: {url} → {redirect}", { redirect: redirect.href })
      }
      // Use mock server for mock scheme
      if (testpattern.test(request.url)) {
        log.trace("matched: {url} → {pattern}", format(testpattern, request.url))
        return await mock(request, { log, paths, respond })
      }
    }
    if (browser)
      return null as unknown as Response
    return $fetch(request, init)
  }, { [$$fetch]: $fetch })
}

/**
 * Returns a mock response for intercepted requests.
 *
 * Mock handlers (whose filename match `/.${request.method}.ts`) are expected to export a default function that takes
 * a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Request | Request} object and returns
 * a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} object.
 *
 * Mock candidates are evaluated sequentially, and the first *2XX response* is returned.
 *
 * A *502 Bad Gateway* response is returned when there are no more mock candidates to evaluate.
 */
async function mock(request: Request, options: Arg<Handler, 2> & { respond?: StaticMockedResponse }) {
  const log = options.log.getChild("mocks")
  let response = new Response(StatusText[Status.BadGateway], { status: Status.BadGateway })

  // Return static mocked response if configured
  if (options.respond) {
    log.trace("using: static response")
    response = new Response(options.respond.body, { status: options.respond.status, headers: options.respond.headers })
  } // Find all mock candidates
  else {
    response = new Response(StatusText[Status.BadGateway], { status: Status.BadGateway })
    const url = new URL(request.url)
    const candidates = [...await Promise.all(options.paths.map(async (root) => await list("*", { root, relative: false, directories: true })))]
      .flat()
      .filter((mock) => basename(mock) === url.host && filetype(mock) === "directory")
    if (!candidates.length)
      log.warn("no mocks found: {paths}", { paths: options.paths })
    for (const candidate of candidates) {
      // Check if a better response can be obtained
      if (response.status >= Status.OK && response.status <= Status.OK + 99)
        break
      if (response.status !== Status.BadGateway) {
        log.trace("current status: http {status}", { status: response.status })
        log.trace("trying next candidate: {candidate}", { candidate })
      }
      // Try executing mock file
      const module = join(candidate, `${url.pathname}/.${request.method.toLowerCase()}.ts`)
      if (filetype(module) === "file") {
        log.trace("using: handler {module}", { module })
        const { default: mock } = await import(module)
        response = await mock(request, options)
        continue
      }
      // Try serving static directory
      if (filetype(candidate) === "directory") {
        log.trace("using: directory {candidate}", { candidate })
        const path = join(candidate, normalize(decodeURIComponent(url.pathname)))
        response = new Response(StatusText[Status.NotFound], { status: Status.NotFound })
        for (const filepath of [path, `${path}.html`, join(path, "index.html")]) {
          log.trace("trying next file: {filepath}", { filepath })
          if (filetype(filepath) === "file") {
            log.trace("using: file {filepath}", { filepath })
            response = new Response(await Deno.readFile(filepath), { status: Status.OK })
            break
          }
        }
        continue
      }
    }
  }
  log.debug("sent: http {status}", { status: response.status })
  return response
}

/** Formats a `URLPattern` into a simple object for logging. */
function format(pattern: URLPattern, url: string) {
  return { url, pattern: Object.fromEntries(Object.entries(pick(pattern, ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"])).filter(([key, value]) => (key === "hostname") || (value !== "*"))) }
}
