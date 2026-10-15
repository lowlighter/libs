import { expect } from "@libs/testing"
import { hash } from "./hash.ts"

Deno.test("`hash()` derives a deterministic PBKDF2 hash", async () => {
  const options = { salt: new Uint8Array([1, 2, 3]), iterations: 1 }
  const expected = new Uint8Array([177, 34, 224, 157, 101, 93, 21, 94, 126, 59, 232, 150, 173, 78, 44, 8, 100, 184, 226, 224, 89, 130, 82, 140, 129, 75, 217, 131, 102, 148, 160, 169])
  await expect(hash("secret", options)).resolves.toEqual(expected)
  await expect(hash("secret", options)).resolves.toEqual(expected)
})

Deno.test("`hash()` accepts a configurable hash algorithm and iteration count", async () => {
  const output = await hash("secret", { salt: new Uint8Array([1, 2, 3]), hash: "SHA-512", iterations: 2 })
  expect(output).toEqual(new Uint8Array([66, 171, 93, 34, 217, 194, 236, 223, 54, 163, 210, 204, 150, 164, 205, 177, 177, 87, 4, 128, 242, 110, 150, 40, 161, 155, 111, 78, 55, 235, 179, 81]))
})

Deno.test("`hash()` rejects empty secrets", async () => {
  await expect(hash("", { salt: new Uint8Array([1, 2, 3]), iterations: 1 })).rejects.toThrow()
})
