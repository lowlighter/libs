// Imports
import { join } from "@std/path"
import { env } from "./env.ts"

/**
 * Returns the path to the user's cache directory, optionally appending a path.
 *
 * The returned value depends on the operating system and is either a string,
 * containing a value from the following table, or the configured fallback.
 *
 * |Platform | Value                               | Example                          |
 * | ------- | ----------------------------------- | -------------------------------- |
 * | Linux   | `$XDG_CACHE_HOME` or `$HOME`/.cache | /home/user/.cache           |
 * | macOS   | `$HOME`/Library/Caches              | /Users/user/Library/Caches  |
 * | Windows | `$LOCALAPPDATA`                     | C:\Users\user\AppData\Local |
 */
export function cache(path?: string, { os = Deno.build.os, fallback = "" } = {}): string {
  const home = env("HOME")
  let cache = fallback

  switch (os) {
    case "linux":
      cache = env("XDG_CACHE_HOME") || (home && `${home}/.cache`) || fallback
      break
    case "darwin":
      cache = (home && `${home}/Library/Caches`) || fallback
      break
    case "windows":
      cache = env("LOCALAPPDATA") || fallback
  }

  return path ? join(cache, path) : cache
}
