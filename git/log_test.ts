import { log, type LogEntry } from "./log.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

const expected = [
  {
    sha: "a".repeat(40),
    author: { name: "foo", mail: "foo@example.com" },
    time: 1,
    conventional: true,
    type: "chore",
    scopes: [],
    breaking: false,
    subject: "initial commit",
    summary: "chore: initial commit",
  },
  {
    sha: "b".repeat(40),
    author: { name: "bar", mail: "bar@example.com" },
    time: 2,
    conventional: true,
    type: "fix",
    scopes: ["a", "b"],
    breaking: false,
    subject: "add a comment",
    summary: "fix(a, b): add a comment",
  },
  {
    sha: "c".repeat(40),
    author: { name: "baz", mail: "baz@example.com" },
    time: 3,
    conventional: true,
    type: "fix",
    scopes: ["c"],
    breaking: true,
    subject: "fix a bug",
    summary: "fix(c)!: fix a bug",
  },
  {
    sha: "d".repeat(40),
    author: { name: "qux", mail: "qux@example.com" },
    time: 4,
    conventional: false,
    type: null,
    scopes: [],
    breaking: null,
    subject: "random commit",
    summary: "random commit",
  },
  {
    sha: "e".repeat(40),
    author: { name: "quux >> corge", mail: "quux@example.com" },
    time: 5,
    conventional: false,
    type: null,
    scopes: [],
    breaking: null,
    subject: "summary with: colons and >> arrows",
    summary: "summary with: colons and >> arrows",
  },
] as LogEntry[]

function format(entries: LogEntry[]) {
  return entries.map((entry) => [entry.sha, entry.time, entry.author.name, entry.author.mail, entry.summary].join("\0")).join("\n")
}

Deno.test("`log()` parses `git log --pretty=format:%H%x00%at%x00%an%x00%ae%x00%s`", () => {
  expect(log("", { stdout: format(expected) })).toEqual(expected)
})

Deno.test("`log()` supports filtering entries", () => {
  const stdout = format(expected)
  expect(log("", { stdout, filter: { conventional: true } })).toHaveLength(3)
  expect(log("", { stdout, filter: { breaking: true } })).toHaveLength(1)
  expect(log("", { stdout, filter: { types: "fix" } })).toHaveLength(2)
  expect(log("", { stdout, filter: { types: ["chore", "fix"] } })).toHaveLength(3)
  expect(log("", { stdout, filter: { scopes: "c" } })).toHaveLength(1)
  expect(log("", { stdout, filter: { scopes: ["a", "c"] } })).toHaveLength(2)
})

Deno.test("`log()` throws on parsing error", () => {
  expect(() => log("", { stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git log entry/)
  expect(() => log("", { stdout: ["a".repeat(40), "not-a-time", "foo", "foo@example.com", "summary"].join("\0") })).toThrow(TypeError, /Failed to parse git log entry/)
  expect(() => log("", { stdout: ["a".repeat(40), "1", "foo", "foo@example.com", "summary", "extra"].join("\0") })).toThrow(TypeError, /Failed to parse git log entry/)
})

Deno.test("`log()` parses actual `git log` output", () => {
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
    const sha = git("rev-parse", "HEAD")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\nworld\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "fix(hello): add a line")
    const entries = log("", { cwd: path })
    expect(entries).toHaveLength(2)
    expect(entries[0]).toMatchObject({ conventional: true, type: "fix", scopes: ["hello"], subject: "add a line" })
    expect(entries[1]).toMatchObject({ sha, conventional: true, type: "feat", subject: "initial commit", author: { name: "tester", mail: "tester@example.com" } })
    expect(log(sha, { cwd: path })).toHaveLength(1)
    expect(log(sha, { head: "main", cwd: path })).toHaveLength(1)
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
