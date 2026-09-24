// Imports
import { join } from "@std/path"
import { expect } from "@libs/testing"
import { cache } from "./cache.ts"

Deno.test("cache resolves each platform and appends optional paths", { permissions: { env: ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA"] } }, () => {
  const keys = ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA"] as const
  const previous = Object.fromEntries(keys.map((key) => [key, Deno.env.get(key)]))

  try {
    for (
      const { os, home, xdg, local, path, fallback, expected } of [
        { os: "linux", home: "/home/user", xdg: "/custom/cache", expected: "/custom/cache" },
        { os: "linux", home: "/home/user", expected: "/home/user/.cache" },
        { os: "linux", expected: "" },
        { os: "linux", fallback: "/fallback/cache", expected: "/fallback/cache" },
        { os: "linux", fallback: "/fallback/cache", path: "app", expected: join("/fallback/cache", "app") },
        { os: "linux", home: "/home/user", xdg: "/custom/cache", path: "app/data", expected: join("/custom/cache", "app/data") },
        { os: "linux", home: "/home/user", path: "", expected: "/home/user/.cache" },
        { os: "darwin", home: "/Users/user", expected: "/Users/user/Library/Caches" },
        { os: "darwin", home: "/Users/user", path: "app", expected: join("/Users/user/Library/Caches", "app") },
        { os: "darwin", expected: "" },
        { os: "windows", local: "C:\\Users\\user\\AppData\\Local", expected: "C:\\Users\\user\\AppData\\Local" },
        { os: "windows", local: "C:\\Users\\user\\AppData\\Local", path: "app", expected: join("C:\\Users\\user\\AppData\\Local", "app") },
        { os: "windows", expected: "" },
        { os: "freebsd", expected: "" },
        { os: "freebsd", fallback: "/fallback/cache", expected: "/fallback/cache" },
      ] as const
    ) {
      for (const [key, value] of [["HOME", home], ["XDG_CACHE_HOME", xdg], ["LOCALAPPDATA", local]] as const) {
        if (value === undefined)
          Deno.env.delete(key)
        else
          Deno.env.set(key, value)
      }

      expect(cache(path, { os: os as typeof Deno.build.os, fallback, env: "" })).toBe(expected)
    }

    Deno.env.set("HOME", "/home/user")
    Deno.env.set("XDG_CACHE_HOME", "/custom/cache")
    Deno.env.set("LOCALAPPDATA", "C:\\Users\\user\\AppData\\Local")
    const expected = Deno.build.os === "linux" ? "/custom/cache" : Deno.build.os === "darwin" ? "/home/user/Library/Caches" : Deno.build.os === "windows" ? "C:\\Users\\user\\AppData\\Local" : ""
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

Deno.test("cache replaces the first path segment only when the override resolves", { permissions: { env: ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA", "LIBS_TEST_CACHE"] } }, () => {
  const keys = ["HOME", "XDG_CACHE_HOME", "LOCALAPPDATA", "LIBS_TEST_CACHE"] as const
  const previous = Object.fromEntries(keys.map((key) => [key, Deno.env.get(key)]))

  try {
    Deno.env.set("HOME", "/home/user")
    Deno.env.set("XDG_CACHE_HOME", "/custom/cache")
    Deno.env.set("LOCALAPPDATA", "C:\\Users\\user\\AppData\\Local")
    for (const os of ["linux", "darwin", "windows", "freebsd"] as const) {
      Deno.env.set("LIBS_TEST_CACHE", "/data/.my-fixed-cache")
      expect(cache(undefined, { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe("/data/.my-fixed-cache")
      expect(cache(".my-cache/hello", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache", "hello"))
      expect(cache(".my-cache/hello/nested", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache", "hello/nested"))
      expect(cache(".my-cache\\hello", { os, env: "LIBS_TEST_CACHE" })).toBe(Deno.build.os === "windows" ? join("/data/.my-fixed-cache", "hello") : join("/data/.my-fixed-cache"))
      expect(cache(".my cache/hello world", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache", "hello world"))
      expect(cache(".my-cache/hello\\ world", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache", "hello\\ world"))
      expect(cache(".my-cache///hello", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache", "hello"))
      expect(cache(".my-cache", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache"))
      expect(cache(".my-cache/", { os, env: "LIBS_TEST_CACHE" })).toBe(join("/data/.my-fixed-cache"))
      expect(cache("", { os, env: "LIBS_TEST_CACHE" })).toBe("/data/.my-fixed-cache")

      const expected = os === "linux" ? "/custom/cache" : os === "darwin" ? "/home/user/Library/Caches" : os === "windows" ? "C:\\Users\\user\\AppData\\Local" : "/fallback/cache"
      expect(cache(".my-cache/hello", { os, env: "", fallback: "/fallback/cache" })).toBe(join(expected, ".my-cache/hello"))
      for (const value of ["", undefined]) {
        if (value === undefined)
          Deno.env.delete("LIBS_TEST_CACHE")
        else
          Deno.env.set("LIBS_TEST_CACHE", value)
        expect(cache(undefined, { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe(expected)
        expect(cache(".my-cache/hello", { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe(join(expected, ".my-cache/hello"))
      }
    }

    for (const key of keys)
      Deno.env.delete(key)
    for (const os of ["linux", "darwin", "windows", "freebsd"] as const) {
      expect(cache(undefined, { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe("/fallback/cache")
      expect(cache("app/data", { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe(join("/fallback/cache", "app/data"))
      expect(cache("app", { os, env: "LIBS_TEST_CACHE" })).toBe("app")
    }
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

Deno.test("cache uses the fallback when environment access is denied", { permissions: { env: false } }, () => {
  for (const os of ["linux", "darwin", "windows", "freebsd"] as const) {
    expect(cache(undefined, { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe("/fallback/cache")
    expect(cache("app/data", { os, env: "LIBS_TEST_CACHE", fallback: "/fallback/cache" })).toBe(join("/fallback/cache", "app/data"))
    expect(cache("app/data", { os, env: "", fallback: "/fallback/cache" })).toBe(join("/fallback/cache", "app/data"))
  }
})
