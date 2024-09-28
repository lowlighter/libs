import { otpauth, otpsecret, totp, verify } from "./totp.ts"
import { expect, test } from "@libs/testing"

test("all")("`otpsecret()` returns a string", () => {
  expect(typeof otpsecret()).toBe("string")
})

test("all")("`otpauth()` throws when either issuer or account contains a colon character", () => {
  const secret = otpsecret()
  const url = otpauth({ issuer: "example", account: "alice@example.com", image: "https://example.com", secret })
  expect(url.protocol).toBe("otpauth:")
  expect(url.hostname).toBe("totp")
  expect(url.pathname).toBe(`/${encodeURIComponent("example:alice@example.com")}`)
  expect(url.searchParams.get("secret")).toBe(secret)
  expect(url.searchParams.get("issuer")).toBe("example")
  expect(url.searchParams.get("algorithm")).toBe("SHA1")
  expect(url.searchParams.get("digits")).toBe("6")
  expect(url.searchParams.get("period")).toBe("30")
})

test("all")("`otpauth()` throws when either issuer or account contains a colon character", () => {
  expect(() => otpauth({ issuer: "issuer:invalid", account: "account" })).toThrow("Label may not contain a colon character")
  expect(() => otpauth({ issuer: "issuer", account: "account:invalid" })).toThrow("Label may not contain a colon character")
})

test("all")("`totp()` supports secret with longer lengths", async () => {
  const secret = otpsecret(24)
  expect(secret).not.toContain("=")
  await expect(totp(secret)).resolves.toBeType("string")
})

test("all")("`verify()` returns true if token is valid", async () => {
  await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: 152125, t: 1708671725109 })).resolves.toBe(true)
  await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: "152125", t: 1708671725109 })).resolves.toBe(true)
})

test("all")("`verify()` honors tolerance", async () => {
  for (const { tolerance, expected } of [{ tolerance: 1, expected: true }, { tolerance: 0, expected: false }]) {
    await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: 42580, t: 1708671725109, tolerance })).resolves.toBe(expected)
    await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: "042580", t: 1708671725109, tolerance })).resolves.toBe(expected)
  }
})

test("all")("`verify()` returns false if token is invalid", async () => {
  await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: 0, t: 1708671725109 })).resolves.toBe(false)
  await expect(verify({ secret: "JBSWY3DPEHPK3PXP", token: "0", t: 1708671725109 })).resolves.toBe(false)
})
