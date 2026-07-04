# 🟰 Git

[![JSR](https://jsr.io/badges/@libs/git)](https://jsr.io/@libs/git) [![JSR Score](https://jsr.io/badges/@libs/git/score)](https://jsr.io/@libs/git) [![Coverage](https://libs-coverage.lecoq.io/git/badge.svg)](https://libs-coverage.lecoq.io/git)

Parse the output of common `git` commands into structured data.

- [`📚 Documentation`](https://jsr.io/@libs/git/doc)

## 📑 Examples

```ts ignore
import { blame, changed, commit, diff, grep, log, pull, push, status, tag, tags } from "./mod.ts"

// Parse `git blame --line-porcelain` (line attribution, authorship and commit metadata)
blame("mod.ts")

// Parse `git diff` (files, statuses, modes, hunks and lines)
diff("HEAD~1..HEAD")

// Parse `git grep --line-number --column -I -z` (matched paths, positions and contents)
grep("TODO", { paths: ["*.ts"] })

// Parse `git log` (commit history, with conventional commits support)
log("1.0.0", { filter: { conventional: true } })

// Parse `git status --porcelain=v1 -z` (staged and unstaged changes, renames and untracked files)
status()

// Parse `git tag --list` (sorted by version) and create tags
tags({ glob: "v*" })
tags({ glob: "v*", commit: true })
tag("v1.0.0")

// List changed files matching glob patterns
changed(["git/**", ".github/workflows/*.yml"], { base: "origin/main" })

// Commit as the github-actions bot, pull with rebase and push
commit("chore: update generated files", { paths: ["README.md"] })
pull({ rebase: true })
push()
```

Each function shells out to `git` synchronously, or parses a provided `stdout` instead (in which case no permission is required).

## ✨ Features

- Support for parsing [`git blame`](https://git-scm.com/docs/git-blame), [`git diff`](https://git-scm.com/docs/git-diff), [`git grep`](https://git-scm.com/docs/git-grep), [`git log`](https://git-scm.com/docs/git-log), [`git status`](https://git-scm.com/docs/git-status) and
  [`git tag`](https://git-scm.com/docs/git-tag) outputs.
- Support for common workflow operations: [`pull()`](https://git-scm.com/docs/git-pull), [`push()`](https://git-scm.com/docs/git-push), `tag()`, `changed()` and `commit()` (authored by the github-actions bot by default).
- Support for [conventional commits](https://www.conventionalcommits.org) parsing and filtering in `log()`.
- Support for renames, copies, mode changes, binary files and quoted paths in `diff()`.
- Uses unambiguous output formats (NUL-delimited fields) when shelling out to `git`.

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
