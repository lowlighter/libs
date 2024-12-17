// Imports
import type { Arrayable, Nullable } from "@libs/typing"
import { assert } from "@std/assert"
import * as semver from "@std/semver"
import * as git from "./mod.ts"

/**
 * Generate a changelog based on the commits since the last version bump.
 *
 * It is automatically determined by the list of commits since the last edit of the "version" key.
 * Commits must follow the conventional commits syntax (non-conventional commits are ignored).
 */
export function changelog(path: string, { scopes = [], minor = ["feat"], patch = ["fix", "docs", "perf", "refactor", "chore"] } = {} as ChangelogOptions): Changelog {
  // Find the base commit (last version bump)
  const base = git.blame(path).find(({ content }) => /"version": "\d\.\d\.\d.*"/.test(content))
  assert(base, `Could not find "version" key in ${path}`)

  // Parse the version
  const version = semver.parse(base.content.match(/"version": "(?<version>\d\.\d\.\d.*)"/)?.groups?.version ?? "")
  const commits = git.log(base.sha, { filter: { conventional: true, scopes } })
  const result = { version: { bump: null, current: version, next: version }, changelog: "" } as Changelog

  // Bump the version
  if (commits.some(({ breaking }) => breaking)) {
    result.version.bump = "major"
    result.version.next = semver.increment(version, result.version.bump)
  } else if (commits.some(({ type }) => minor.includes(type as string))) {
    result.version.bump = "minor"
    result.version.next = semver.increment(version, result.version.bump)
  } else if (commits.some(({ type }) => patch.includes(type as string))) {
    result.version.bump = "patch"
    result.version.next = semver.increment(version, result.version.bump)
  }

  // Generate the changelog
  result.changelog = commits.map(({ summary }) => summary).join("\n")
  return result
}

/** Options for {@linkcode changelog()}. */
export type ChangelogOptions = {
  /** The scopes to filter. */
  scopes?: Arrayable<string>
  /** The type of commits that increase the "patch" component of semver. */
  patch?: Arrayable<string>
  /** The type of commits that increase the "minor" component of semver. */
  minor?: Arrayable<string>
}

/** Changelog. */
export type Changelog = {
  version: {
    bump: Nullable<"major" | "minor" | "patch">
    current: semver.SemVer
    next: semver.SemVer
  }
  changelog: string
}
