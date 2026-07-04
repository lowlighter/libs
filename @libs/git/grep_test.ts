import { grep } from "./grep.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

const stdout = [
  ["mod.ts", "1", "8", 'export * from "./blame.ts"'].join("\0"),
  ["foo:bar.ts", "40", "13", "// a match: with colons"].join("\0"),
].join("\n")

Deno.test("`grep()` parses `git grep --line-number --column -I -z`", () => {
  expect(grep("match", { stdout })).toEqual([
    { path: "mod.ts", line: 1, column: 8, content: 'export * from "./blame.ts"' },
    { path: "foo:bar.ts", line: 40, column: 13, content: "// a match: with colons" },
  ])
})

Deno.test("`grep()` throws on parsing error", () => {
  expect(() => grep("match", { stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git grep entry/)
  expect(() => grep("match", { stdout: ["mod.ts", "not-a-line-number", "1", "content"].join("\0") })).toThrow(TypeError, /Failed to parse git grep entry/)
})

Deno.test("`grep()` parses actual `git grep` output", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "user.name", "tester")
    git("config", "user.email", "tester@example.com")
    git("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\nthere\nworld\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: initial commit")
    expect(grep("hello", { cwd: path })).toEqual([{ path: "hello.txt", line: 1, column: 1, content: "hello" }])
    expect(grep("^the", { args: ["--extended-regexp"], paths: ["*.txt"], cwd: path })).toEqual([{ path: "hello.txt", line: 2, column: 1, content: "there" }])
    expect(grep("no match to be found", { cwd: path })).toEqual([])
    expect(() => grep("hello", { args: ["--not-a-valid-flag"], cwd: path })).toThrow(EvalError, /git grep exited with non-zero code/)
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
