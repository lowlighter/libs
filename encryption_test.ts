import { bytes, decrypt, encrypt, exportKey, hash, hex, importKey } from "./encryption.ts"
import { expect } from "https://deno.land/std@0.217.0/expect/expect.ts"

Deno.test("hex() returns hexadecimal string", { permissions: "none" }, () => {
  expect(hex(0x0a)).toBe("0a")
  expect(hex(0x42)).toBe("42")
  expect(hex(new Uint8Array([0x0a, 0x42]))).toBe("0a42")
})

Deno.test("bytes() parses hexadecimal string", { permissions: "none" }, () => {
  expect(bytes("0a")).toEqual(new Uint8Array([0x0a]))
  expect(bytes("42")).toEqual(new Uint8Array([0x42]))
  expect(bytes("0a42")).toEqual(new Uint8Array([0x0a, 0x42]))
})

Deno.test("hash() returns digest as hexadecimal string", { permissions: "none" }, async () => {
  await expect(hash("foo", { algorithm: "SHA-1" })).resolves.toBe("0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33")
  await expect(hash("foo", { algorithm: "SHA-256" })).resolves.toBe("2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae")
  await expect(hash("foo", { algorithm: "SHA-384" })).resolves.toBe("98c11ffdfdd540676b1a137cb1a22b2a70350c9a44171d6b1180c6be5cbb2ee3f79d532c8a1dd9ef2e8e08e752a3babb")
  await expect(hash("foo", { algorithm: "SHA-512" })).resolves.toBe("f7fbba6e0636f890e56fbbf3283e524c6fa3204ae298382d624741d0dc6638326e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7")
})

Deno.test("exportKey() returns an exported CryptoKey as hexadecimal string", { permissions: "none" }, async () => {
  await expect(exportKey({ seed: "", salt: "" })).resolves.toBe("e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47")
  await expect(exportKey({ seed: "hello", salt: "world" })).resolves.toBe("664d43091e7905723fc92a4c38f58e9aeff6d822488eb07d6b11bcfc2468f48a")
  await expect(exportKey({ seed: "bonjour", salt: "monde" })).resolves.toBe("2af043e1b91ba7ba0036884e40ca9a1f8dcbadfa47a7894955f6c154dd0a635c")
})

Deno.test("importKey() returns an exported CryptoKey as hexadecimal string", { permissions: "none" }, async () => {
  const key = await importKey("e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47")
  expect(key).toBeInstanceOf(CryptoKey)
  expect(key.type).toBe("secret")
  expect(key.algorithm).toMatchObject({ name: "AES-GCM", length: 256 })
  expect(key.usages).toEqual(["encrypt", "decrypt"])
})

Deno.test("encrypt() encrypts data with specified key and returns a hash of specified length", { permissions: "none" }, async () => {
  const key = "e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47"
  await expect(encrypt("🍱 bento", { key, length: 256 })).resolves.toMatch(/^[a-f0-9]+$/)
  await expect(encrypt("🍱 bento", { key, length: 256 })).resolves.toHaveLength(256)
})

Deno.test("encrypt() returns a different hash value each time for same key", { permissions: "none" }, async () => {
  const key = "e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47"
  await expect(encrypt("🍱 bento", { key })).not.resolves.toBe(await encrypt("🍱 bento", { key }))
})

Deno.test("decrypt() returns data encrypted with specified key", { permissions: "none" }, async () => {
  const key = "e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47"
  const message = "3fad79f2da00039971a33690de745a4182fe5f13b5b51a94018b14cf64bb3493941e69db4df1537cdbb01e5f46c93e8d1abe69af8a9328316662195d11728030897e89ac7e29c200d10d31d3f46a4af6e8e835effbd55662f0cca6150d2fc1005128dc2919ccb7f387915231"
  await expect(decrypt(message, { key })).resolves.toBe("🍱 bento")
  await expect(decrypt(await encrypt("🍱 bento", { key }), { key })).resolves.toBe("🍱 bento")
  await expect(decrypt(await encrypt("", { key }), { key })).resolves.toBe("")
})

Deno.test("decrypt() supports long messages with length constraint disabled", { permissions: "none" }, async () => {
  const key = "e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47"
  await expect(decrypt(await encrypt("lorem ipsum".repeat(1000), { key, length: 0 }), { key })).resolves.toBe("lorem ipsum".repeat(1000))
})

Deno.test("decrypt() throws when message is larger than constrained length", { permissions: "none" }, async () => {
  const key = "e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47"
  await expect(encrypt("lorem ipsum".repeat(1000), { key, length: 256 })).rejects.toThrow("Message too long")
  await expect(encrypt("lorem ipsum".repeat(1000), { key, length: 512 })).rejects.toThrow("Message too long")
})

Deno.test("decrypt() throws when decrypted value mismatches registered hash", { permissions: "none" }, async () => {
  let message = "🍱 bento"
  const key = await importKey("e8bf6e323c23036402989c3e89fe8e6219c18edbfde74a461b5f27d806e51f47")
  const encoder = new TextEncoder()
  const size = hex(Math.min(encoder.encode(message).length))
  message = `${size}${message}`
  message = `${"0".repeat(64)}${message}`
  const [iv, value] = [crypto.getRandomValues(new Uint8Array(16)), encoder.encode(message)]
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, value))
  await expect(decrypt(hex(new Uint8Array([...iv, ...encrypted])), { key })).rejects.toThrow("Hash mismatch")
})
