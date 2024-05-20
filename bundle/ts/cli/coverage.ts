/// <reference lib="dom" />
// Imports
import { expandGlob } from "@std/fs"
import { dirname, resolve } from "@std/path"
import { default as syntax } from "npm:highlight.js@11.9.0"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"
import { basename } from "@std/path"
import { parseArgs } from "@std/cli"
import { Logger } from "@libs/logger"

const { help, loglevel, root = ".", exclude, _: globs, ...flags } = parseArgs(Deno.args, {
  boolean: ["help", "no-matcha", "no-highlight", "no-write", "no-badge"],
  alias: { help: "h", loglevel: "l", root: "r", exclude: "e", "no-matcha": "M", "no-highlight": "H", "no-write": "W", "no-badge": "B" },
  string: ["loglevel", "root", "exclude"],
  collect: ["exclude"],
})
if (help) {
  console.log("CSS compatibility checker")
  console.log("https://github.com/lowlighter/libs - MIT License - (c) 2024 Simon Lecoq")
  console.log("")
  console.log("Usage:")
  console.log("  deno --allow-read --allow-write=coverage --allow-net=img.shields.io coverage.ts [options] [files...=coverage/*.hmtl]")
  console.log("")
  console.log("Options:")
  console.log("  -h, --help                 Show this help")
  console.log("  -l, --loglevel=[log]       Log level (disabled, debug, log, info, warn, error)")
  console.log("  -e, --exclude              Exclude files matching glob pattern (can be used multiple times)")
  console.log("  [-r, --root=.]             Root directory to search for files")
  console.log("  -M, --no-matcha            Disable matcha.css styling")
  console.log("  -H, --no-highlight         Disable syntax highlighting")
  console.log("  -W, --no-write             Do not rewrite html files")
  console.log("  -B, --no-badge             Do not generate coverage badge")
  console.log("")
  Deno.exit(0)
}

const logger = new Logger({ level: Logger.level[loglevel as keyof typeof Logger.level] })
if (!globs.length) {
  globs.push("coverage/*.html")
}

// Process files
for (const glob of globs) {
  logger.debug(`processing glob: ${glob}`)
  for await (const { path } of expandGlob(`${glob}`, { root, exclude })) {
    // Parse document
    const log = logger.with({ path })
    log.debug("parsing document")
    const document = new DOMParser().parseFromString(await Deno.readTextFile(path), "text/html")!
    if (!document.title.includes("Coverage report")) {
      log.warn("skipped as it does not seem to be a coverage report")
      continue
    }

    // Matcha theme
    if ((!flags["no-write"]) && (!flags["no-matcha"])) {
      log.debug("applying matcha theme")
      for (const name of ["@root", "@syntax-highlighting", "@istanbul-coverage"]) {
        if (document.querySelector(`link[href*="${name}"]`)) {
          log.debug(`skipped as it has already been themed with matcha/${name}`)
          continue
        }
        const stylesheet = document.createElement("link")
        stylesheet.setAttribute("rel", "stylesheet")
        stylesheet.setAttribute("href", `https://matcha.mizu.sh/styles/${name}/mod.css`)
        document.head.append(stylesheet)
        log.debug(`added stylesheet: matcha/${name}`)
      }
      log.log("themed with matcha")
    }

    // Syntax highlighting
    if ((!flags["no-write"]) && (!flags["no-highlight"])) {
      log.debug("highlighting document")
      document.querySelectorAll(".prettyprint").forEach((_element) => {
        const element = _element as unknown as HTMLElement
        if (element.dataset.highlighted === "true") {
          log.debug("skipped as it has already been highlighted")
          return
        }
        element.innerHTML = syntax.highlight(element.innerText, { language: "ts" }).value
        element.dataset.highlighted = "true"
        log.log("highlighted")
      })
    }

    // Write file
    if (!flags["no-write"]) {
      await Deno.writeTextFile(path, `<!DOCTYPE html>${document.documentElement!.outerHTML}`)
      log.info("updated")
    }

    // Generate badges
    if ((!flags["no-badge"]) && (basename(path) === "index.html")) {
      const coverage = document.querySelector(".clearfix .fl:last-child .strong")?.innerText ?? "-"
      const value = Number.parseFloat(coverage)
      const color = Number.isFinite(value) ? (value >= 80 ? "#3fb950" : value >= 60 ? "#db6d28" : "#f85149") : "#656d76"
      const svg = await fetch(`https://img.shields.io/badge/${encodeURIComponent(`Coverage-${coverage}-${color}`)}`).then((response) => response.text())
      await Deno.writeTextFile(resolve(dirname(path), "badge.svg"), svg)
      log.log(`generated badge: ${resolve(dirname(path), "badge.svg")}`)
    }
  }
}
