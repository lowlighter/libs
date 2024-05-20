/// <reference lib="dom" />
// Imports
import { expandGlob } from "@std/fs"
import { dirname, fromFileUrl, resolve } from "@std/path"
import { default as syntax } from "npm:highlight.js@11.9.0/lib/core"
import { default as hlts } from "npm:highlight.js@11.9.0/lib/languages/typescript"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"
import { basename } from "@std/path"
syntax.registerLanguage("ts", hlts)

// Merge coverage reports into a single directory
const root = fromFileUrl(import.meta.resolve("../"))
for await (const { path } of expandGlob(`coverage/*/*.html`, { root })) {
  const document = new DOMParser().parseFromString(await Deno.readTextFile(path), "text/html")!

  // Matcha theme
  for (const name of ["@root", "@syntax-highlighting", "@istanbul-coverage"]) {
    const stylesheet = document.createElement("link")
    stylesheet.setAttribute("rel", "stylesheet")
    stylesheet.setAttribute("href", `https://matcha.mizu.sh/styles/${name}/mod.css`)
    document.head.append(stylesheet)
    console.log(`added stylesheet: matcha/${name}`)
  }
  console.log(`theming: ${path}`)

  // Syntax highlighting
  document.querySelectorAll(".prettyprint").forEach((_element) => {
    const element = _element as unknown as HTMLElement
    element.innerHTML = syntax.highlight(element.innerText, { language: "ts" }).value
  })
  console.log(`highlighting: ${path}`)

  // Update file
  await Deno.writeTextFile(path, `<!DOCTYPE html>${document.documentElement!.outerHTML}`)
  console.log(`written: ${path}`)

  if (basename(path) === "index.html") {
    const coverage = document.querySelector(".clearfix .fl:last-child .strong")?.innerText ?? "-"
    const percentage = Number.parseFloat(coverage)
    const color = Number.isFinite(percentage) ? (percentage >= 80 ? "#3fb950" : percentage >= 60 ? "#db6d28" : "#f85149") : "#656d76"
    const badge = await fetch(`https://img.shields.io/badge/${encodeURIComponent(`code coverage-${coverage}-${color}`)}`).then((response) => response.text())
    await Deno.writeTextFile(resolve(dirname(path), "badge.svg"), badge)
    console.log(`generated badge: ${resolve(dirname(path), "badge.svg")}`)
  }
}
