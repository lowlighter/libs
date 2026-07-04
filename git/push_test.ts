import { push } from "./push.ts"
import { tag, tags } from "./tag.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

Deno.test("`push()` pushes branches and tags to the remote", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (cwd: string) => (...args: string[]) => command("git", args, { sync: true, throw: true, cwd }).stdout.trim()
    // Setup a remote repository and a clone
    git(path)("init", "--quiet", "--bare", "--initial-branch=main", "origin.git")
    git(path)("clone", "--quiet", `${path}/origin.git`, "clone")
    const cwd = `${path}/clone`
    git(cwd)("config", "user.name", "tester")
    git(cwd)("config", "user.email", "tester@example.com")
    git(cwd)("config", "commit.gpgsign", "false")
    Deno.writeTextFileSync(`${cwd}/hello.txt`, "hello\n")
    git(cwd)("add", ".")
    git(cwd)("commit", "--quiet", "--message", "feat: initial commit")
    // Push the current branch
    push([], { cwd })
    expect(git(`${path}/origin.git`)("rev-parse", "main")).toBe(git(cwd)("rev-parse", "main"))
    // Push a tag
    tag("v1.0.0", { cwd })
    push("v1.0.0", { cwd })
    expect(tags({ cwd: `${path}/origin.git` })).toEqual(["v1.0.0"])
    // Push errors are thrown
    expect(() => push("not-a-ref", { cwd })).toThrow()
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
