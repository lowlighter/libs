import { expect, test } from "@libs/testing"
import { time } from "./time.ts"

const svg = /^<svg.*?>[\s\S]+<\/svg>$/

test("`time()` generates a time-based graph", () => {
  expect(time({
    A: {
      data: [{ x: new Date("2000"), y: 1 }, { x: new Date("2010"), y: 2 }, { x: new Date("2020"), y: 1 }, { x: new Date("2030"), y: 4 }],
    },
    B: {
      data: [{ x: new Date("2005"), y: 1.5, text: "B0" }, { x: new Date("2025"), y: 2, text: "B1" }],
    },
  })).toMatch(svg)
})
