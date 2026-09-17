// Imports
import { join } from "@std/path"
import { expect } from "@libs/testing"
import cache from "./cache.ts"

Deno.test("cache resolves each platform and appends optional paths", { permissions: { env: ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA"] } }, () => {
  const keys = ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA"] as const
  const previous = Object.fromEntries(keys.map((key) => [key, Deno.env.get(key)]))

  try {
    for (
      const { os, home, xdg, local, path, expected } of [
        { os: "linux", home: "/home/user", xdg: "/custom/cache", expected: "/custom/cache" },
        { os: "linux", home: "/home/user", expected: "/home/user/.cache" },
        { os: "linux", expected: null },
        { os: "linux", home: "/home/user", xdg: "/custom/cache", path: "app/data", expected: join("/custom/cache", "app/data") },
        { os: "linux", home: "/home/user", path: "", expected: "/home/user/.cache" },
        { os: "darwin", home: "/Users/user", expected: "/Users/user/Library/Caches" },
        { os: "darwin", home: "/Users/user", path: "app", expected: join("/Users/user/Library/Caches", "app") },
        { os: "darwin", expected: null },
        { os: "windows", local: "C:\\Users\\user\\AppData\\Local", expected: "C:\\Users\\user\\AppData\\Local" },
        { os: "windows", local: "C:\\Users\\user\\AppData\\Local", path: "app", expected: join("C:\\Users\\user\\AppData\\Local", "app") },
        { os: "windows", expected: null },
        { os: "freebsd", expected: null },
      ] as const
    ) {
      for (const [key, value] of [["HOME", home], ["XDG_CACHE_HOME", xdg], ["LOCALAPPDATA", local]] as const) {
        if (value === undefined)
          Deno.env.delete(key)
        else
          Deno.env.set(key, value)
      }

      expect(cache(path, { os: os as typeof Deno.build.os })).toBe(expected)
    }

    Deno.env.set("HOME", "/home/user")
    Deno.env.set("XDG_CACHE_HOME", "/custom/cache")
    Deno.env.set("LOCALAPPDATA", "C:\\Users\\user\\AppData\\Local")
    const expected = Deno.build.os === "linux" ? "/custom/cache" : Deno.build.os === "darwin" ? "/home/user/Library/Caches" : Deno.build.os === "windows" ? "C:\\Users\\user\\AppData\\Local" : null
    expect(cache()).toBe(expected)
  } finally {
    for (const key of keys) {
      const value = previous[key]
      if (value === undefined)
        Deno.env.delete(key)
      else
        Deno.env.set(key, value)
    }
  }
})
