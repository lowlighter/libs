import { changed } from "./utils.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

Deno.test("`changed()` parses `git diff --name-only -z`", () => {
  expect(changed("**", { stdout: "mod.ts\0nested/file with spaces.ts\0" })).toEqual(["mod.ts", "nested/file with spaces.ts"])
})

Deno.test("`changed()` lists changed files matching globs", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "user.name", "tester")
    git("config", "user.email", "tester@example.com")
    git("config", "commit.gpgsign", "false")
    Deno.mkdirSync(`${path}/pkg/nested`, { recursive: true })
    Deno.mkdirSync(`${path}/other`)
    Deno.writeTextFileSync(`${path}/pkg/mod.ts`, "1\n")
    Deno.writeTextFileSync(`${path}/pkg/nested/file.ts`, "1\n")
    Deno.writeTextFileSync(`${path}/other/file.ts`, "1\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: initial commit")
    const base = git("rev-parse", "HEAD")
    Deno.writeTextFileSync(`${path}/pkg/mod.ts`, "2\n")
    Deno.writeTextFileSync(`${path}/pkg/nested/file.ts`, "2\n")
    Deno.writeTextFileSync(`${path}/other/file.ts`, "2\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: edit everything")
    // Committed changes against a base ref
    expect(changed("pkg/**", { base, cwd: path })).toEqual(["pkg/mod.ts", "pkg/nested/file.ts"])
    expect(changed(["pkg/*.ts", "other/*.ts"], { base, cwd: path })).toEqual(["other/file.ts", "pkg/mod.ts"])
    expect(changed("unrelated/**", { base, cwd: path })).toEqual([])
    expect(changed("**", { base, head: base, cwd: path })).toEqual([])
    // Uncommitted changes from the working tree
    expect(changed("**", { cwd: path })).toEqual([])
    Deno.writeTextFileSync(`${path}/other/file.ts`, "3\n")
    expect(changed("**", { cwd: path })).toEqual(["other/file.ts"])
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
