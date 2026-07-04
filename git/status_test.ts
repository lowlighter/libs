import { status } from "./status.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

const stdout = [" M mod.ts", "?? new file.ts", "R  renamed.ts\0original.ts", "A  added.ts", ""].join("\0")

Deno.test("`status()` parses `git status --porcelain=v1 -z`", () => {
  expect(status({ stdout })).toEqual([
    { staged: " ", unstaged: "M", path: "mod.ts", from: null },
    { staged: "?", unstaged: "?", path: "new file.ts", from: null },
    { staged: "R", unstaged: " ", path: "renamed.ts", from: "original.ts" },
    { staged: "A", unstaged: " ", path: "added.ts", from: null },
  ])
})

Deno.test("`status()` throws on parsing error", () => {
  expect(() => status({ stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git status entry/)
  expect(() => status({ stdout: "R  renamed.ts" })).toThrow(TypeError, /missing origin path/)
})

Deno.test("`status()` parses actual `git status` output", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "user.name", "tester")
    git("config", "user.email", "tester@example.com")
    git("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${path}/committed.txt`, "foo\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: initial commit")
    expect(status({ cwd: path })).toEqual([])
    Deno.writeTextFileSync(`${path}/committed.txt`, "bar\n")
    Deno.writeTextFileSync(`${path}/untracked.txt`, "baz\n")
    expect(status({ cwd: path })).toEqual([
      { staged: " ", unstaged: "M", path: "committed.txt", from: null },
      { staged: "?", unstaged: "?", path: "untracked.txt", from: null },
    ])
    expect(status({ paths: ["untracked.txt"], cwd: path })).toEqual([{ staged: "?", unstaged: "?", path: "untracked.txt", from: null }])
    git("mv", "committed.txt", "renamed.txt")
    expect(status({ paths: ["*.txt"], cwd: path })).toContainEqual({ staged: "R", unstaged: "M", path: "renamed.txt", from: "committed.txt" })
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
