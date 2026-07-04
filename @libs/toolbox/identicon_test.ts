import { expect } from "@libs/testing"
import { identicon } from "./identicon.ts"

/** Decodes the SVG payload of an identicon data URL. */
function decode(url: string): string {
  return atob(url.replace(/^data:image\/svg\+xml;base64,/, ""))
}

/** Extracts the set of lit cells (`"x,y"`) from an identicon SVG. */
function cells(svg: string): Set<string> {
  const set = new Set<string>()
  for (const [, x, y] of svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="1"/g))
    set.add(`${x},${y}`)
  return set
}

Deno.test("`identicon()` returns a base64-encoded svg data URL", () => {
  const url = identicon("alice")
  expect(url).toMatch(/^data:image\/svg\+xml;base64,/)
  expect(decode(url)).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
})

Deno.test("`identicon()` is deterministic for a given seed", () => {
  expect(identicon("alice")).toBe(identicon("alice"))
  expect(identicon("alice", { size: 8 })).toBe(identicon("alice", { size: 8 }))
})

Deno.test("`identicon()` produces different output for different seeds", () => {
  expect(identicon("alice")).not.toBe(identicon("bob"))
})

Deno.test("`identicon()` defaults to a 5x5 grid and respects the `size` option", () => {
  expect(decode(identicon("alice"))).toContain('viewBox="0 0 5 5"')
  const svg = decode(identicon("alice", { size: 7 }))
  expect(svg).toContain('viewBox="0 0 7 7"')
  for (const cell of cells(svg)) {
    const [x, y] = cell.split(",").map(Number)
    expect(x).toBeLessThan(7)
    expect(y).toBeLessThan(7)
  }
})

Deno.test("`identicon()` is horizontally mirror-symmetric", () => {
  const size = 5
  const lit = cells(decode(identicon("symmetry", { size })))
  expect(lit.size).toBeGreaterThan(0)
  for (const cell of lit) {
    const [x, y] = cell.split(",").map(Number)
    expect(lit.has(`${size - 1 - x},${y}`)).toBe(true)
  }
})

Deno.test("`identicon()` derives a deterministic foreground and background colour", () => {
  const svg = decode(identicon("alice"))
  const hues = [...svg.matchAll(/hsl\((\d+) /g)].map(([, h]) => Number(h))
  expect(hues.length).toBe(2)
  expect(hues[0]).toBe(hues[1])
  expect(hues[0]).toBeGreaterThanOrEqual(0)
  expect(hues[0]).toBeLessThan(360)
  expect(svg).toContain("58% 62%") // foreground
  expect(svg).toContain("26% 18%") // background
})

Deno.test("`identicon()` throws on invalid sizes", () => {
  expect(() => identicon("alice", { size: 0 })).toThrow(RangeError)
  expect(() => identicon("alice", { size: -1 })).toThrow(RangeError)
  expect(() => identicon("alice", { size: 2.5 })).toThrow(RangeError)
})

Deno.test("`identicon()` handles an empty seed deterministically", () => {
  expect(identicon("")).toBe(identicon(""))
  expect(decode(identicon(""))).toContain('viewBox="0 0 5 5"')
})
