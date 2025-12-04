// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, test } from "@libs/testing"
import { timezone, timezones } from "./timezone.ts"

test("`timezones` contains supported timezones", () => {
  expect(timezones.length).toBeGreaterThan(0)
  expect(timezones).toContain("Europe/Paris")
  expect(timezones).not.toContain("Invalid/Timezone")
})

test("`timezone` is defined", () => {
  expect(timezone).toBeType("string")
})
