// Imports
import type { Optional } from "@libs/typing/types"
import type { Page, SandboxOptions } from "@astral/astral"
import { getLogger, type Logger } from "@logtape/logtape"
import { launch } from "@astral/astral"
import { env } from "@libs/toolbox/env"
export type { Logger, Page, SandboxOptions }

/** Permissions for browser pages. */
export type Permissions = NonNullable<Exclude<Required<SandboxOptions["sandbox"]>, boolean>>["permissions"]

/** Browser options. */
export type BrowserOptions = {
  /** Logger categories forwarded to {@link https://logtape.org | LogTape}'s `getLogger()`. */
  logger?: string[]
  /** Fetch function. */
  fetch?: typeof globalThis.fetch
}

/** Browser configuration. */
export type BrowserConfiguration = {
  /** Path to browser data cache (requires write access). */
  cache?: string
  /** User agent. */
  ua?: string
  /** Viewport width. */
  width?: number
  /** Viewport height. */
  height?: number
  /** Permissions for browser pages. */
  permissions?: Permissions
  /** Whether to run the browser in headless mode or not. */
  headless?: boolean
}

/** A sandboxed browser instance that can be used to navigate web pages. */
export class Browser {
  /** Constructor. */
  constructor({ logger: category = ["browser"], fetch = globalThis.fetch }: BrowserOptions = {}, config: BrowserConfiguration = {}) {
    this.#log = getLogger(category)
    this.#fetch = fetch
    this.#config = { width: 1280, height: 720, headless: true, permissions: "inherit", ...config }
  }

  /** Linked logger. */
  readonly #log

  /** Fetch function. */
  readonly #fetch

  /** Browser config. */
  readonly #config

  /** Browser process. */
  #browser: Optional<Awaited<ReturnType<typeof launch>>>

  /**
   * Opens a new browser page.
   *
   * See {@linkcode https://jsr.io/@astral/astral/doc/~/Page | jsr:@astral/astral} for more details.
   *
   * ```ts ignore
   * await using browser = new Browser()
   * await using page = await browser.page("about:blank")
   * ```
   */
  async page(url: string): Promise<Page> {
    if (!this.#browser) {
      const args = []
      if (this.#config.cache)
        args.push(`--user-data-dir=${this.#config.cache}`)
      this.#browser = await launch({
        cache: this.#config.cache,
        args,
        headless: this.#config.headless,
        userAgent: this.#config.ua,
        launchPresets: { hardened: true, bgTransparent: true, windowSize: { width: this.#config.width, height: this.#config.height } },
      })
      const useragent = await this.#browser.userAgent()
      const version = await this.#browser.version()
      this.#log.info(`opened browser: ${version} ${useragent}`)
    }
    const page = await this.#browser.newPage(url, {
      coverage: env("DENO_COVERAGE", { boolean: true }),
      sandbox: { permissions: this.#config.permissions as Permissions },
      interceptor: (request) => this.#fetch(request),
    })
    const close = page.close.bind(page)
    page.close = async () => {
      await close()
      this.#log.debug(`closed page: ${url}`)
    }
    this.#log.info(`opened page: ${url}`)
    return page
  }

  /** Disposes the browser process. */
  async [Symbol.asyncDispose](): Promise<void> {
    await this.#browser?.close()
    this.#browser = undefined
    this.#log.info("closed browser")
  }
}
