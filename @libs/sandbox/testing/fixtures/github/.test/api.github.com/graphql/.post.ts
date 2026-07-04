// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { basename } from "@std/path/basename"
import { dirname } from "@std/path/dirname"
import { join } from "@std/path/join"
import { toSnakeCase } from "@std/text/to-snake-case"
import { filetype } from "@libs/toolbox/filesystem"
import { is, mock, type ResponseInitWithBody } from "../../../../../mock.ts"

export default mock({
  query: is.string(),
  variables: is.record(is.string(), is.unknown()).optional(),
}, async ({ query, variables }, request, { log, paths: candidates }) => {
  const name = toSnakeCase(query.match(/query\s+(\w+)/)?.[1] ?? "")
  let body = null as unknown
  if (name) {
    let ok = false
    const paths = []
    for (const candidate of candidates) {
      const module = join(candidate, basename(dirname(import.meta.dirname!)), basename(import.meta.dirname!), `${name}.ts`)
      paths.push(module)
      if (filetype(module) === "file") {
        log.trace("calling handler from {module} for query {query}", { module, query })
        const { default: mock } = await import(module)
        body = await mock(new Request(request, { body: JSON.stringify(variables) })).then((response: Response) => response.json())
        ok = true
        break
      }
    }
    if (!ok) {
      log.warn("no mocks found in {paths} for query {query}", { paths, query })
      body = { errors: [{ path: ["query"], message: "No data" }] }
    }
  } else {
    log.error("query {query} is unnamed", { query })
    body = { errors: [{ path: ["query"], message: "Missing query name" }] }
  }
  return { body, headers: { "content-type": "application/json; charset=utf-8" } } as ResponseInitWithBody
})
