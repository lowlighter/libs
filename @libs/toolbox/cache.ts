// Imports
import { join, SEPARATOR_PATTERN } from "@std/path"
import { env } from "./env.ts"

/**
 * Returns the path to the user's cache directory, optionally appending a path.
 *
 * The returned value depends on the operating system and is either a string,
 * containing a value from the following table, or the configured fallback.
 *
 * |Platform | Value                               | Example                     |
 * | ------- | ----------------------------------- | --------------------------- |
 * | Linux   | `$XDG_CACHE_HOME` or `$HOME`/.cache | /home/user/.cache           |
 * | macOS   | `$HOME`/Library/Caches              | /Users/user/Library/Caches  |
 * | Windows | `$LOCALAPPDATA`                     | C:\Users\user\AppData\Local |
 *
 * A fallback value can be provided if none of the platform-specific cache directories are available.
 *
 * The name of an environment variable can be provided to force the use of a specific cache directory.
 * When the override is non-empty, it replaces the first segment of the provided path.
 * If the specified environment variable is empty or not available, the resolution will resume as usual.
 */
export function cache(path?: string, { os = Deno.build.os, fallback = "", env: override } = {} as CacheOptions): string {
  let cache = ""
  if (override)
    cache = env(override)

  if (cache)
    return path ? join(cache, ...path.split(SEPARATOR_PATTERN).slice(1)) : cache

  const home = env("HOME")
  cache = fallback
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

/** Cache options. */
export type CacheOptions = {
  /** The operating system to use for determining the cache directory (default is the current OS). */
  os?: typeof Deno.build.os
  /** The fallback cache directory to use if resolution fails. */
  fallback?: string
  /** The name of the environment variable to lookup to override the resolved cache directory. */
  env: string
}
