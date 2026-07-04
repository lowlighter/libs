import { bot, commit, listChanged } from "./utils.ts"
import { log } from "./log.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

Deno.test("`listChanged()` parses `git diff --name-only -z`", () => {
  expect(listChanged("**", { stdout: "mod.ts\0nested/file with spaces.ts\0" })).toEqual(["mod.ts", "nested/file with spaces.ts"])
})

Deno.test("`listChanged()` lists changed files matching globs", () => {
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
    expect(listChanged("pkg/**", { base, cwd: path })).toEqual(["pkg/mod.ts", "pkg/nested/file.ts"])
    expect(listChanged(["pkg/*.ts", "other/*.ts"], { base, cwd: path })).toEqual(["other/file.ts", "pkg/mod.ts"])
    expect(listChanged("unrelated/**", { base, cwd: path })).toEqual([])
    expect(listChanged("**", { base, head: base, cwd: path })).toEqual([])
    // Uncommitted changes from the working tree
    expect(listChanged("**", { cwd: path })).toEqual([])
    Deno.writeTextFileSync(`${path}/other/file.ts`, "3\n")
    expect(listChanged("**", { cwd: path })).toEqual(["other/file.ts"])
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})

Deno.test("`commit()` commits as the github-actions bot", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (...args: string[]) => command("git", args, { sync: true, throw: true, cwd: path }).stdout.trim()
    git("init", "--quiet", "--initial-branch=main")
    git("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${path}/hello.txt`, "hello\n")
    const sha = commit("feat: initial commit", { paths: "hello.txt", cwd: path })
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
    expect(sha).toBe(git("rev-parse", "HEAD"))
    expect(log("", { cwd: path })).toMatchObject([{ sha, author: { name: bot.name, mail: bot.mail }, summary: "feat: initial commit" }])
    // Custom author and `all` staging
    Deno.writeTextFileSync(`${path}/hello.txt`, "world\n")
    Deno.writeTextFileSync(`${path}/other.txt`, "other\n")
    commit("fix: update everything", { all: true, author: { name: "tester", mail: "tester@example.com" }, cwd: path })
    expect(git("show", "--pretty=format:%an %ae", "--name-only", "HEAD")).toContain("tester tester@example.com")
    expect(git("show", "--name-only", "--pretty=format:", "HEAD").split("\n").filter(Boolean)).toEqual(["hello.txt", "other.txt"])
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
