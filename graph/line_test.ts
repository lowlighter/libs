import { expect, test } from "@libs/testing"
import { line } from "./line.ts"

const svg = /^<svg.*?>[\s\S]+<\/svg>$/

test("`line()` generates a line graph", () => {
  expect(line({
    A: {
      data: [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 4 }],
    },
    B: {
      data: [{ x: 0.5, y: 1.5, text: "B0" }, { x: 2.5, y: 2, text: "B1" }],
    },
  })).toMatch(svg)
  expect(line({
    A: {
      data: [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 4 }],
    },
    B: {
      data: [{ x: 0.5, y: 1.5, text: "B0" }, { x: 2.5, y: 2, text: "B1" }],
    },
  }, { min: 0, max: 5, ticks: 4, labels: { 0: "0" }, legend: true, title: "title" })).toMatch(svg)
})