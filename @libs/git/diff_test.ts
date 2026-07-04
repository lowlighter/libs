import { diff } from "./diff.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

const stdout = [
  // Modified file with two hunks (the second one lacking terminating newlines)
  "diff --git a/mod.ts b/mod.ts",
  "index 0000000..1111111 100644",
  "--- a/mod.ts",
  "+++ b/mod.ts",
  "@@ -1,3 +1,4 @@ function foo()",
  " unchanged",
  "-deleted",
  "+added",
  "+added bis",
  " unchanged bis",
  "@@ -10 +11 @@",
  "-old",
  "\\ No newline at end of file",
  "+new",
  "\\ No newline at end of file",
  // Created file
  "diff --git a/created.ts b/created.ts",
  "new file mode 100644",
  "index 0000000..2222222",
  "--- /dev/null",
  "+++ b/created.ts",
  "@@ -0,0 +1,2 @@",
  "+line",
  "+line bis",
  // Deleted file
  "diff --git a/deleted.ts b/deleted.ts",
  "deleted file mode 100644",
  "index 3333333..0000000",
  "--- a/deleted.ts",
  "+++ /dev/null",
  "@@ -1,2 +0,0 @@",
  "-line",
  "-line bis",
  // Renamed file
  "diff --git a/before.ts b/after.ts",
  "similarity index 90%",
  "rename from before.ts",
  "rename to after.ts",
  "index 4444444..5555555 100644",
  "--- a/before.ts",
  "+++ b/after.ts",
  "@@ -1 +1 @@",
  "-foo",
  "+bar",
  // Copied file
  "diff --git a/original.ts b/copy.ts",
  "similarity index 100%",
  "copy from original.ts",
  "copy to copy.ts",
  // Binary file
  "diff --git a/image.png b/image.png",
  "index 6666666..7777777 100644",
  "Binary files a/image.png and b/image.png differ",
  // Binary patch
  "diff --git a/binary.dat b/binary.dat",
  "new file mode 100644",
  "index 0000000..8888888",
  "GIT binary patch",
  "literal 6",
  "Ncmb=xyz",
  "",
  "literal 0",
  "HcmV?d00001",
  // Mode change only
  "diff --git a/script.sh b/script.sh",
  "old mode 100644",
  "new mode 100755",
  // Quoted paths
  'diff --git "a/sp ace\\t.ts" "b/sp ace\\t.ts"',
  "index 9999999..aaaaaaa 100644",
  '--- "a/sp ace\\t.ts"',
  '+++ "b/sp ace\\t.ts"',
  "@@ -1 +1 @@",
  "-a",
  "+b",
  "",
].join("\n")

Deno.test("`diff()` parses `git diff`", () => {
  const entries = diff("", { stdout })
  expect(entries).toHaveLength(9)
  expect(entries[0]).toEqual({
    from: "mod.ts",
    to: "mod.ts",
    status: "modified",
    similarity: null,
    mode: { from: "100644", to: "100644" },
    index: { from: "0000000", to: "1111111" },
    binary: false,
    hunks: [
      {
        from: { line: 1, count: 3 },
        to: { line: 1, count: 4 },
        context: "function foo()",
        lines: [
          { type: "unchanged", content: "unchanged", newline: true },
          { type: "deleted", content: "deleted", newline: true },
          { type: "added", content: "added", newline: true },
          { type: "added", content: "added bis", newline: true },
          { type: "unchanged", content: "unchanged bis", newline: true },
        ],
      },
      {
        from: { line: 10, count: 1 },
        to: { line: 11, count: 1 },
        context: "",
        lines: [
          { type: "deleted", content: "old", newline: false },
          { type: "added", content: "new", newline: false },
        ],
      },
    ],
  })
  expect(entries[1]).toMatchObject({ from: "created.ts", to: "created.ts", status: "created", mode: { from: null, to: "100644" } })
  expect(entries[1].hunks[0].lines).toEqual([
    { type: "added", content: "line", newline: true },
    { type: "added", content: "line bis", newline: true },
  ])
  expect(entries[2]).toMatchObject({ from: "deleted.ts", to: "deleted.ts", status: "deleted", mode: { from: "100644", to: null } })
  expect(entries[3]).toMatchObject({ from: "before.ts", to: "after.ts", status: "renamed", similarity: 90 })
  expect(entries[3].hunks[0].lines).toEqual([
    { type: "deleted", content: "foo", newline: true },
    { type: "added", content: "bar", newline: true },
  ])
  expect(entries[4]).toMatchObject({ from: "original.ts", to: "copy.ts", status: "copied", similarity: 100, hunks: [] })
  expect(entries[5]).toMatchObject({ from: "image.png", to: "image.png", binary: true, hunks: [] })
  expect(entries[6]).toMatchObject({ from: "binary.dat", to: "binary.dat", status: "created", binary: true, hunks: [] })
  expect(entries[7]).toMatchObject({ from: "script.sh", to: "script.sh", status: "modified", mode: { from: "100644", to: "100755" }, hunks: [] })
  expect(entries[8]).toMatchObject({ from: "sp ace\t.ts", to: "sp ace\t.ts", status: "modified" })
})

Deno.test("`diff()` returns an empty array when there are no changes", () => {
  expect(diff("", { stdout: "\n" })).toEqual([])
})

Deno.test("`diff()` throws on parsing error", () => {
  expect(() => diff("", { stdout: "<garbage>" })).toThrow(TypeError, /Failed to parse git diff entry/)
  expect(() => diff("", { stdout: "diff --git <garbage>" })).toThrow(TypeError, /Failed to parse git diff entry/)
  expect(() => diff("", { stdout: ["diff --git a/mod.ts b/mod.ts", "<garbage>"].join("\n") })).toThrow(TypeError, /Failed to parse git diff entry/)
  expect(() => diff("", { stdout: ["diff --git a/mod.ts b/mod.ts", "@@ <garbage> @@"].join("\n") })).toThrow(TypeError, /Failed to parse git diff hunk/)
  expect(() => diff("", { stdout: ["diff --git a/mod.ts b/mod.ts", "@@ -1,2 +1,2 @@", "<garbage>"].join("\n") })).toThrow(TypeError, /Failed to parse git diff hunk line/)
})

Deno.test("`diff()` parses actual `git diff` output", () => {
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
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\nthere\nfriend")
    const entries = diff("", { cwd: path })
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ from: "hello.txt", to: "hello.txt", status: "modified", binary: false })
    expect(entries[0].hunks[0].lines).toEqual([
      { type: "unchanged", content: "hello", newline: true },
      { type: "unchanged", content: "there", newline: true },
      { type: "deleted", content: "world", newline: true },
      { type: "added", content: "friend", newline: false },
    ])
    expect(diff("HEAD", { cwd: path })).toHaveLength(1)
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
