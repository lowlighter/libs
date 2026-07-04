import { expect } from "@libs/testing"
import { pluralize } from "./pluralize.ts"

Deno.test("`pluralize()` adds `s` by default", () => {
  expect(pluralize("user")).toBe("users")
  expect(pluralize("post")).toBe("posts")
  expect(pluralize("tag")).toBe("tags")
  expect(pluralize("day")).toBe("days")
  expect(pluralize("key")).toBe("keys")
  expect(pluralize("boy")).toBe("boys")
})

Deno.test("`pluralize()` adds `es` after a sibilant ending", () => {
  expect(pluralize("box")).toBe("boxes")
  expect(pluralize("class")).toBe("classes")
  expect(pluralize("address")).toBe("addresses")
  expect(pluralize("status")).toBe("statuses")
  expect(pluralize("bus")).toBe("buses")
  expect(pluralize("match")).toBe("matches")
  expect(pluralize("dish")).toBe("dishes")
  expect(pluralize("quiz")).toBe("quizzes")
  expect(pluralize("buzz")).toBe("buzzes")
})

Deno.test("`pluralize()` turns a consonant + `y` into `ies`", () => {
  expect(pluralize("category")).toBe("categories")
  expect(pluralize("company")).toBe("companies")
  expect(pluralize("country")).toBe("countries")
  expect(pluralize("city")).toBe("cities")
})

Deno.test("`pluralize()` handles common irregular nouns", () => {
  expect(pluralize("person")).toBe("people")
  expect(pluralize("child")).toBe("children")
  expect(pluralize("man")).toBe("men")
  expect(pluralize("woman")).toBe("women")
  expect(pluralize("human")).toBe("humans")
  expect(pluralize("HUMAN")).toBe("HUMANS")
})

Deno.test("`pluralize()` preserves the original casing", () => {
  expect(pluralize("User")).toBe("Users")
  expect(pluralize("BlogPost")).toBe("BlogPosts")
  expect(pluralize("USER")).toBe("USERS")
  expect(pluralize("BOX")).toBe("BOXES")
  expect(pluralize("Category")).toBe("Categories")
  expect(pluralize("Person")).toBe("People")
  expect(pluralize("Woman")).toBe("Women")
})

Deno.test("`pluralize()` returns an empty string unchanged", () => {
  expect(pluralize("")).toBe("")
})
