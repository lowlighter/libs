import { tag, tags } from "./tag.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

Deno.test("`tags()` parses `git tag --list`", () => {
  expect(tags({ stdout: "v0.9.0\nv0.10.0\n" })).toEqual(["v0.9.0", "v0.10.0"])
})

Deno.test("`tag()` creates tags listable by `tags()`", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "user.name", "tester")
    git("config", "user.email", "tester@example.com")
    git("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: initial commit")
    const initial = git("rev-parse", "HEAD")
    Deno.writeTextFileSync(`${path}/hello.txt`, "world\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: another commit")
    tag("v0.9.0", { ref: initial, cwd: path })
    tag("v0.10.0", { message: "annotated", cwd: path })
    tag("other-1.0.0", { cwd: path })
    expect(tags({ cwd: path })).toEqual(["other-1.0.0", "v0.9.0", "v0.10.0"])
    expect(tags({ glob: "v*", cwd: path })).toEqual(["v0.9.0", "v0.10.0"])
    expect(tags({ glob: "v*", sort: "-version:refname", cwd: path })).toEqual(["v0.10.0", "v0.9.0"])
    expect(git("rev-list", "--max-count=1", "v0.9.0")).toBe(initial)
    expect(() => tag("v0.9.0", { cwd: path })).toThrow()
    tag("v0.9.0", { force: true, cwd: path })
    expect(git("rev-list", "--max-count=1", "v0.9.0")).not.toBe(initial)
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
