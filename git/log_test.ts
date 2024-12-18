import { log, type LogEntry } from "./log.ts"
import { expect, test } from "@libs/testing"

const expected = [
  {
    sha: "a".repeat(40),
    author: "foo",
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
    author: "bar",
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
    author: "baz",
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
    author: "qux",
    time: 4,
    conventional: false,
    type: null,
    scopes: [],
    breaking: null,
    subject: "random commit",
    summary: "random commit",
  },
] as LogEntry[]

function format(entries: LogEntry[]) {
  return entries.map((entry) => `<<${entry.sha}>> <<${entry.time}>> <<${entry.author}>> ${entry.conventional ? `${entry.type}${entry.scopes?.length ? `(${entry.scopes.join(", ")})` : ""}${entry.breaking ? "!" : ""}: ${entry.subject}` : entry.subject}`).join("\n")
}

test("`log()` parses `git log --pretty=<<%H>> <<%at>> <<%an>> %s`", () => {
  expect(log("", { stdout: format(expected) })).toEqual(expected)
})

test("`log()` throws on parsing error", () => {
  expect(() => log("", { stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git log entry/)
})
