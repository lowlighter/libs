import { expect, test } from "@libs/testing"
import { diff } from "./diff.ts"

const svg = /^<svg.*?>[\s\S]+<\/svg>$/

test("`diff()` generates a diff graph", () => {
  expect(diff({
    A: { data: [{ date: new Date("2019"), added: 100, deleted: 20, changed: 12 }] },
    B: { data: [{ date: new Date("2020"), added: 40, deleted: 23, changed: 20 }, { date: new Date("2021"), added: 54, deleted: 12, changed: 30 }] },
    C: { data: [{ date: new Date("2021"), added: 0, deleted: 30, changed: 10 }] },
  }, { title: "foobar" })).toMatch(svg)
})
