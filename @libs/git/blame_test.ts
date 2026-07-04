import { blame, type BlameEntry } from "./blame.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

const stdout = [
  `${"a".repeat(40)} 1 1 2`,
  "author foo",
  "author-mail <foo@example.com>",
  "author-time 1",
  "author-tz +0000",
  "committer foo",
  "committer-mail <foo@example.com>",
  "committer-time 1",
  "committer-tz +0000",
  "summary feat: initial commit",
  "boundary",
  "filename foo.ts",
  "\tconsole.log('Hello, World!')",
  `${"a".repeat(40)} 2 2`,
  "author foo",
  "author-mail <foo@example.com>",
  "author-time 1",
  "author-tz +0000",
  "committer foo",
  "committer-mail <foo@example.com>",
  "committer-time 1",
  "committer-tz +0000",
  "summary feat: initial commit",
  "boundary",
  "filename foo.ts",
  "\t",
  `${"b".repeat(40)} 4 3 1`,
  "author bar",
  "author-mail <bar@example.com>",
  "author-time 2",
  "author-tz -0130",
  "committer baz",
  "committer-mail <baz@example.com>",
  "committer-time 3",
  "committer-tz +0200",
  "summary fix: add a comment",
  `previous ${"a".repeat(40)} old name.ts`,
  "filename foo.ts",
  "\t// Say hello !",
  "",
].join("\n")

const expected = [
  {
    sha: "a".repeat(40),
    line: { original: 1, final: 1 },
    author: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 0 },
    committer: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 0 },
    summary: "feat: initial commit",
    boundary: true,
    previous: null,
    filename: "foo.ts",
    content: "console.log('Hello, World!')",
  },
  {
    sha: "a".repeat(40),
    line: { original: 2, final: 2 },
    author: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 0 },
    committer: { name: "foo", mail: "<foo@example.com>", time: 1, tz: 0 },
    summary: "feat: initial commit",
    boundary: true,
    previous: null,
    filename: "foo.ts",
    content: "",
  },
  {
    sha: "b".repeat(40),
    line: { original: 4, final: 3 },
    author: { name: "bar", mail: "<bar@example.com>", time: 2, tz: -130 },
    committer: { name: "baz", mail: "<baz@example.com>", time: 3, tz: 200 },
    summary: "fix: add a comment",
    boundary: false,
    previous: { sha: "a".repeat(40), filename: "old name.ts" },
    filename: "foo.ts",
    content: "// Say hello !",
  },
] as BlameEntry[]

Deno.test("`blame()` parses `git blame --line-porcelain`", () => {
  expect(blame("foo.ts", { stdout })).toEqual(expected)
})

Deno.test("`blame()` tolerates missing porcelain tags", () => {
  expect(blame("foo.ts", { stdout: `${"c".repeat(40)} 1 1 1\n\tcontent only` })).toEqual([{
    sha: "c".repeat(40),
    line: { original: 1, final: 1 },
    author: { name: "", mail: "", time: NaN, tz: NaN },
    committer: { name: "", mail: "", time: NaN, tz: NaN },
    summary: "",
    boundary: false,
    previous: null,
    filename: "",
    content: "content only",
  }])
  expect(blame("foo.ts", { stdout: `${"c".repeat(40)} 1 1 1\nsummary foo` })[0]).toMatchObject({ summary: "foo", content: "" })
  expect(blame("foo.ts", { stdout: `${"c".repeat(40)} 1 1 1\nprevious ${"b".repeat(40)}\n\tfoo` })[0]).toMatchObject({ previous: { sha: "b".repeat(40), filename: "" } })
})

Deno.test("`blame()` throws on parsing error", () => {
  expect(() => blame("foo.ts", { stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git blame entry/)
})

Deno.test("`blame()` parses actual `git blame` output", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "user.name", "tester")
    git("config", "user.email", "tester@example.com")
    git("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\nworld\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "feat: initial commit")
    const sha = git("rev-parse", "HEAD")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\nthere\nworld\n")
    git("add", ".")
    git("commit", "--quiet", "--message", "fix: add a line")
    const entries = blame("hello.txt", { cwd: path })
    expect(entries).toHaveLength(3)
    expect(entries[0]).toMatchObject({ sha, line: { original: 1, final: 1 }, summary: "feat: initial commit", filename: "hello.txt", content: "hello" })
    expect(entries[0].author).toMatchObject({ name: "tester", mail: "<tester@example.com>" })
    expect(entries[1]).toMatchObject({ line: { original: 2, final: 2 }, summary: "fix: add a line", content: "there", previous: { sha, filename: "hello.txt" } })
    expect(blame("hello.txt", { ref: sha, cwd: path })).toHaveLength(2)
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
