/** Numeric enum with implicit, negative, and computed values. */
export enum Status {
  /** Disabled state. */
  Disabled = -1,
  /** Enabled state. */
  Enabled,
  /** Computed mask. */
  Mask = 1 << 3,
}

/** String values that need SQL escaping. */
export enum Label {
  /** Quote and template-like text. */
  Quoted = "it's #{Status.Missing} ${not_a_binding}",
  /** Backslashes remain literal. */
  Path = "a\\b",
  /** Empty string. */
  Empty = "",
  /** A value that must never become SQL syntax. */
  Injection = "'; DROP TABLE users; --",
  /** Newlines remain literal. */
  Multiline = "first\nsecond",
}

/** Values unsuitable for portable SQL literals. */
export enum Invalid {
  /** Non-finite number. */
  Infinite = Infinity,
  /** Embedded NUL. */
  Null = "\0",
}

/** Plain objects are not TypeScript enums. */
export const ObjectValue = { Member: "value" }
