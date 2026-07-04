import { bot, commit } from "./commit.ts"
import { log } from "./log.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

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
