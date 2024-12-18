import { blame, type BlameEntry } from "./blame.ts"
import { expect, test } from "@libs/testing"

const expected = [
  {
    sha: "a".repeat(40),
    author: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 1 },
    committer: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 1 },
    summary: "feat: initial commit",
    boundary: false,
    previous: null,
    filename: "foo.ts",
    content: "console.log('Hello, World!')",
  },
  {
    sha: "b".repeat(40),
    author: { name: "bar", mail: "<bar@example.com>", time: 2, tz: -1 },
    committer: { name: "bar", mail: "<bar@example.com>", time: 2, tz: -1 },
    summary: "fix: add a comment",
    boundary: false,
    previous: "a".repeat(40),
    filename: "foo.ts",
    content: "// Say hello !",
  },
  {
    sha: "c".repeat(40),
    author: { name: "qux", mail: "<qux@example.com>", time: 3, tz: 0 },
    committer: { name: "quux", mail: "<quux@example.com>", time: 3, tz: 0 },
    summary: "chore: update README",
    boundary: true,
    previous: null,
    filename: "README.md",
    content: "# Hello, World!",
  },
] as BlameEntry[]

function format(entries: BlameEntry[]) {
  return entries.map((entry) =>
    [
      `${entry.sha} 1 1 1`,
      `author ${entry.author.name}`,
      `author-mail ${entry.author.mail}`,
      `author-time ${entry.author.time}`,
      `author-tz ${entry.author.tz}`,
      `committer ${entry.committer.name}`,
      `committer-mail ${entry.committer.mail}`,
      `committer-time ${entry.committer.time}`,
      `committer-tz ${entry.committer.tz}`,
      `summary ${entry.summary}`,
      entry.boundary ? "boundary" : "",
      entry.previous ? `previous ${entry.previous}` : "",
      `filename ${entry.filename}`,
      `\t${entry.content}`,
    ].filter(Boolean).join("\n")
  ).join("\n")
}

test("`blame()` parses `git blame --line-porcelain`", () => {
  expect(blame("", { stdout: format(expected) })).toEqual(expected)
})
