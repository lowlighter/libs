import { pull } from "./pull.ts"
import { expect } from "@libs/testing"
import { command } from "@libs/run/command"

Deno.test("`pull()` fetches and integrates remote changes", () => {
  const path = Deno.makeTempDirSync()
  try {
    const git = (cwd: string) => (...args: string[]) => command("git", args, { sync: true, throw: true, cwd }).stdout.trim()
    // Setup a remote repository and two clones
    git(path)("init", "--quiet", "--bare", "--initial-branch=main", "origin.git")
    for (const clone of ["a", "b"]) {
      git(path)("clone", "--quiet", `${path}/origin.git`, clone)
      git(`${path}/${clone}`)("config", "user.name", "tester")
      git(`${path}/${clone}`)("config", "user.email", "tester@example.com")
      git(`${path}/${clone}`)("config", "commit.gpgsign", "false")
    }
    // Push an initial commit from the first clone
    Deno.writeTextFileSync(`${path}/a/hello.txt`, "hello\n")
    git(`${path}/a`)("add", ".")
    git(`${path}/a`)("commit", "--quiet", "--message", "feat: initial commit")
    git(`${path}/a`)("push", "--quiet", "origin", "main")
    // Pull it from the second clone
    pull({ remote: "origin", branch: "main", cwd: `${path}/b` })
    expect(Deno.readTextFileSync(`${path}/b/hello.txt`)).toBe("hello\n")
    // Pulling a branch without specifying a remote implies the `origin` remote
    pull({ branch: "main", cwd: `${path}/b` })
    git(`${path}/b`)("branch", "--set-upstream-to=origin/main", "main")
    // Push a new commit from the first clone and create a local commit in the second clone
    Deno.writeTextFileSync(`${path}/a/remote.txt`, "remote\n")
    git(`${path}/a`)("add", ".")
    git(`${path}/a`)("commit", "--quiet", "--message", "feat: remote commit")
    git(`${path}/a`)("push", "--quiet", "origin", "main")
    Deno.writeTextFileSync(`${path}/b/local.txt`, "local\n")
    git(`${path}/b`)("add", ".")
    git(`${path}/b`)("commit", "--quiet", "--message", "feat: local commit")
    // Pull with rebase keeps the history linear
    pull({ rebase: true, cwd: `${path}/b` })
    expect(Deno.readTextFileSync(`${path}/b/remote.txt`)).toBe("remote\n")
    expect(git(`${path}/b`)("rev-list", "--count", "--merges", "HEAD")).toBe("0")
    expect(git(`${path}/b`)("log", "--pretty=format:%s", "--max-count=1")).toBe("feat: local commit")
  } finally {
    Deno.removeSync(path, { recursive: true })
  }
})
