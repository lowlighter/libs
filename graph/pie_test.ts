import { expect, test } from "@libs/testing"
import { pie } from "./pie.ts"

const svg = /^<svg.*?>[\s\S]+<\/svg>$/

test("`pie()` generates a pie graph", () => {
  expect(pie({
    A: { data: 0.6 },
    B: { data: 0.2 },
    C: { data: 0.1 },
  }, { legend: true })).toMatch(svg)
  expect(pie({
    A: { data: 0.6 },
    B: { data: 0.2 },
    C: { data: 0.9999 },
    D: { data: 0.0001 },
  }, { legend: false })).toMatch(svg)
})
