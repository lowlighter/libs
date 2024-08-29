// Imports
import type { Plugin } from "../renderer.ts"
import rehypeMermaid from "rehype-mermaid"

/**
 * Add support for Mermaid diagrams.
 *
 * {@link https://mermaid-js.github.io/mermaid/ | See Mermaid documentation for more information}.
 *
 * > [!WARNING]
 * > This plugin requires the following permission in Deno:
 * > - read
 * > - env
 * > - sys: "osRelease", "homedir"
 * > - write: <TMP>
 * > - run: <location to playwright browser executable>
 *
 * @example
 * ````md
 * ```mermaid
 * graph TD;
 *  A-->B;
 * A-->C;
 * B-->D;
 * C-->D;
 * ```
 * ````
 */
export default {
  rehype(processor) {
    return processor.use(rehypeMermaid, { strategy: "inline-svg" })
  },
} as Plugin
