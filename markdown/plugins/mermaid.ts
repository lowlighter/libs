// Imports
import type { Plugin } from "../renderer.ts"
import rehypeMermaid from "rehype-mermaid"

/**
 * Add support for Mermaid diagrams.
 *
 * {@link https://mermaid-js.github.io/mermaid/ | See Mermaid documentation for more information}.
 *
 * > [!WARNING]
 * > This plugin requires playwright browser to be installed.
 * >
 * > You can install it by running the following command:
 * > ```sh
 * > npx playwright-core install --with-deps chromium
 * > ```
 *
 * > [!WARNING]
 * > This plugin requires the following permission in Deno:
 * > - read
 * > - env
 * > - sys
 * > - write: <TMP>
 * > - run: <location to playwright browser executable>
 *
 * @example
 * ````md
 * ```mermaid
 * graph TD;
 *   A-->B;
 *   A-->C;
 *   B-->D;
 *   C-->D;
 * ```
 * ````
 */
export default {
  rehype(processor) {
    return processor.use(rehypeMermaid, { strategy: "inline-svg", launchOptions: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-accelerated-2d-canvas", "--no-zygote", "--disable-gpu"] } })
  },
} as Plugin
