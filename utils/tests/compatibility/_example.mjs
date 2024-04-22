/**
 * This script is used to test the compatibility of the library with other runtime environments.
 *
 * Rather than running all the unit tests, it simply checks if the library is able to parse and
 * stringify the content of some XML files. If it can, then we assume that the remaining unit
 * tests would succeed as well since there aren't any dependencies or runtime-specific code.
 */
import { parse, stringify } from "../../../mod.ts"

for (const file of ["small.xml", "medium.xml"]) {
  let content = ""
  for (const _ of ["fetch", "retry"]) {
    try {
      content = await fetch(new URL(`../assets/${file}`, import.meta.url)).then((response) => response.text())
      break
    } // NODEJS: fetch does not support the file protocol, polyfill it with fs on the fly
    catch (error) {
      if ((!(error instanceof TypeError)) || (_ === "retry")) {
        throw error
      }
      const fs = await import("node:fs/promises")
      // deno-lint-ignore no-global-assign
      fetch = async (url) => {
        // Fix the local path on windows
        url.pathname = url.pathname.replace(/^\/[A-Z]:\//, "/")
        return new Response(await fs.readFile(url.pathname))
      }
    }
  }
  content = content.replaceAll("\r\n", "\n").trim()
  try {
    if (!content) {
      throw new Error("Content is empty")
    }
    if (stringify(parse(content)) !== content) {
      throw new Error("The parsed content is not equal to the original content")
    }
  } catch (error) {
    console.error(`${file}: ko`)
    console.error(error)
    throw error
  }
  console.log(`${file}: ok`)
}
