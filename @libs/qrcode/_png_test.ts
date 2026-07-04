import { decode } from "./_png.ts"
import { expect } from "@libs/testing"

Deno.test("`decode()` rejects an invalid signature", async () => {
  await expect(decode(new Uint8Array(8))).rejects.toThrow("Invalid PNG signature")
})
