// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { resolve } from "@libs/toolbox/resolve"

/** Mocks constants. */
export const mocks = {
  /** Mock response protocol. */
  protocol: "mock" as const,
  /** Test TLD. */
  tld: ".test" as const,
  /** Testing fixtures. */
  fixtures: {
    /** Fetch testing fixtures path. */
    fetch: resolve("./testing/fixtures/fetch", { base: import.meta }),
    /** Browser testing fixtures path. */
    browser: resolve("./testing/fixtures/browser", { base: import.meta }),
    /** GitHub testing fixtures path. */
    github: resolve("./testing/fixtures/github", { base: import.meta }),
  },
} as const
