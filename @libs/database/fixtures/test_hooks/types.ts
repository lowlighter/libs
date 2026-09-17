/** Request-specific options passed to query hooks. */
export type Context = {
  /** Whether the output should be hidden. */
  censor: boolean
  /** Text added to the normalized input. */
  prefix: string
}
