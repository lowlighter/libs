import { expect } from "@libs/testing"
import { countryFlag, duration, lnfd, stripEmojis, unfd } from "./format.ts"

Deno.test("`countryFlag()` formats country code as a flag emoji", () => {
  expect(countryFlag("US")).toBe("🇺🇸")
  expect(countryFlag("jp")).toBe("🇯🇵")
  expect(countryFlag("FR ")).toBe("🇫🇷")
  expect(countryFlag("unknown")).toBe("unknown")
})

Deno.test("`unfd()` normalizes string to uppercase and removes diacritics", () => {
  expect(unfd("café")).toBe("CAFE")
  expect(unfd("Straße")).toBe("STRASSE")
})

Deno.test("`lnfd()` normalizes string to lowercase and removes diacritics", () => {
  expect(lnfd("café")).toBe("cafe")
  expect(lnfd("Straße")).toBe("strasse")
})

Deno.test("`stripEmojis()` removes emojis from a string", () => {
  expect(stripEmojis("Hello, world! 👋🌍")).toBe("Hello, world! ")
  expect(stripEmojis("No emojis here.")).toBe("No emojis here.")
  expect(stripEmojis("Sequences 👨‍👩‍👧 and modifiers 👋🏽")).toBe("Sequences  and modifiers ")
  expect(stripEmojis("Room 101, #1 and 2 * 3 are kept")).toBe("Room 101, #1 and 2 * 3 are kept")
})

Deno.test("`stripEmojis()` converts keycaps and flags back to characters", () => {
  expect(stripEmojis("Press 1️⃣ then #️⃣")).toBe("Press 1 then #")
  expect(stripEmojis("From 🇫🇷 to 🇯🇵")).toBe("From FR to JP")
})

Deno.test("`duration()` formats duration as `m:ss`", () => {
  expect(duration(0)).toBe("0:00")
  expect(duration(999)).toBe("0:00")
  expect(duration(1_000)).toBe("0:01")
  expect(duration(61_000)).toBe("1:01")
  expect(duration(3_600_000)).toBe("60:00")
  expect(duration(0, { unit: "s" })).toBe("0:00")
  expect(duration(59, { unit: "s" })).toBe("0:59")
  expect(duration(90, { unit: "s" })).toBe("1:30")
  expect(duration(90.9, { unit: "s" })).toBe("1:30")
})

Deno.test("`duration()` handles negative and non-finite values", () => {
  expect(duration(-1_000)).toBe("0:00")
  expect(duration(NaN)).toBe("∞")
  expect(duration(Infinity)).toBe("∞")
  expect(duration(-Infinity)).toBe("∞")
})
