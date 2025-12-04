// deno-lint-ignore-file no-console
import "./assert.ts"
import { expect, test } from "@libs/testing"
import { assertConsoleSnapshot } from "./assert.ts"
import { emptyDir } from "@std/fs"
import { fromFileUrl } from "@std/path/from-file-url"

const snapshots = fromFileUrl(import.meta.resolve("./fixtures/snapshots"))

test(`\`assertConsoleSnapshot()\` captures and matches console output`, async () => {
  for (const channel of ["log", "error"] as const) {
    await emptyDir(snapshots)
    await expect(assertConsoleSnapshot(import.meta, () => console[channel](`testing-${channel}`), { capture: false })).rejects.toThrow(new RegExp(`-\\s+testing-${channel}`))
    await assertConsoleSnapshot(import.meta, () => console[channel](`testing-${channel}`), { capture: true })
    await assertConsoleSnapshot(import.meta, () => console[channel](`testing-${channel}`), { capture: false })
    await expect(assertConsoleSnapshot(import.meta, () => null, { capture: false })).rejects.toThrow(new RegExp(`\\+\\s+testing-${channel}`))
    await assertConsoleSnapshot(import.meta, () => null, { capture: true })
    await assertConsoleSnapshot(import.meta, () => null, { capture: false })
  }
}, { permissions: { read: true, write: [snapshots] } })
