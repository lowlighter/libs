import { expect, inspect, test } from "@libs/testing"
import { fromFileUrl, join } from "@std/path"
import { chdir, cwd, filetype, list } from "./filesystem.ts"

const root = fromFileUrl(import.meta.resolve("./fixtures/filesystem"))

test("`cwd()` gets the current working directory", () => {
  expect(cwd()).toBe(Deno.cwd())
})

test("`chdir()` changes the current working directory and returns its value", () => {
  expect(chdir(cwd())).toBe(cwd())
}, { permissions: { read: true } })

for (
  const { path, type } of [
    { path: import.meta.filename!, type: "file" },
    { path: import.meta.dirname!, type: "directory" },
    { path: "-esquie-test-non-existent-file-", type: null },
  ]
) {
  test(`\`filetype(${inspect(path)})\` returns ${inspect(type)}`, () => {
    expect(filetype(path)).toBe(type)
  }, { permissions: { read: true } })
}

for (
  const { glob, options, has, hasnt } of [
    // Files
    { glob: "**/*.txt", options: { files: true, relative: false }, has: [join(root, "a/b/foo.txt"), join(root, "a/c/bar.txt"), join(root, "a/c/baz.txt")], hasnt: [join(root, "a"), join(root, "a/b"), join(root, "a/c"), join(root, "a/d"), join(root, "a/d/qux.ts")] },
    { glob: "**/*.txt", options: { files: true, relative: true }, has: ["a/b/foo.txt", "a/c/bar.txt", "a/c/baz.txt"], hasnt: ["a/b/qux.ts", "a", "a/b", "a/c", "a/d"] },
    // Directories
    { glob: "**/*", options: { directories: true, relative: false }, has: [join(root, "a"), join(root, "a/b"), join(root, "a/c"), join(root, "a/d")], hasnt: [join(root, "a/b/foo.txt"), join(root, "a/c/bar.txt"), join(root, "a/c/baz.txt"), join(root, "a/d/qux.ts")] },
    { glob: "**/", options: { directories: true, relative: true }, has: ["a", "a/b", "a/c", "a/d"], hasnt: ["a/b/foo.txt", "a/c/bar.txt", "a/c/baz.txt", "a/d/qux.ts"] },
    // Both
    {
      glob: "**/*",
      options: { files: true, directories: true, relative: false },
      has: [join(root, "a"), join(root, "a/b"), join(root, "a/c"), join(root, "a/d"), join(root, "a/b/foo.txt"), join(root, "a/b/foo.txt"), join(root, "a/c/bar.txt"), join(root, "a/c/baz.txt"), join(root, "a/d/qux.ts")],
      hasnt: [],
    },
    { glob: "**/*", options: { files: true, directories: true, relative: true }, has: ["a", "a/b", "a/c", "a/d", "a/b/foo.txt", "a/c/bar.txt", "a/c/baz.txt", "a/d/qux.ts"], hasnt: [] },
  ]
) {
  test(`\`list(${inspect(glob)}, ${inspect(options)})\` has ${inspect(has)}`, async () => {
    const listed = await list(glob, { root, ...options })
    has.forEach((path) => expect(listed).toContain(path))
    hasnt.forEach((path) => expect(listed).not.toContain(path))
  }, { permissions: { read: true } })
}
