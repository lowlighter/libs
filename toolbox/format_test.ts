import { expect, test } from "@libs/testing"
import { countryFlag, lnfd, stripEmojis, unfd } from "./format.ts"

test("`countryFlag()` formats country code as a flag emoji", () => {
  expect(countryFlag("US")).toBe("🇺🇸")
  expect(countryFlag("jp")).toBe("🇯🇵")
  expect(countryFlag("FR ")).toBe("🇫🇷")
  expect(countryFlag("unknown")).toBe("unknown")
})

test("`unfd()` normalizes string to uppercase and removes diacritics", () => {
  expect(unfd("café")).toBe("CAFE")
  expect(unfd("Straße")).toBe("STRASSE")
})

test("`lnfd()` normalizes string to lowercase and removes diacritics", () => {
  expect(lnfd("café")).toBe("cafe")
  expect(lnfd("Straße")).toBe("strasse")
})

test("`stripEmojis()` removes emojis from a string", () => {
  expect(stripEmojis("Hello, world! 👋🌍")).toBe("Hello, world! ")
  expect(stripEmojis("No emojis here.")).toBe("No emojis here.")
})
