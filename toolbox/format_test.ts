import { expect } from "@libs/testing"
import { countryFlag, lnfd, stripEmojis, unfd } from "./format.ts"

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
