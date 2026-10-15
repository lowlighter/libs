// Imports
import { is } from "@libs/is"

/** Options for {@link hash}. */
export interface HashOptions {
  /** Salt used by PBKDF2. */
  salt: Uint8Array<ArrayBuffer>
  /** Hash algorithm used by PBKDF2. */
  hash?: AlgorithmIdentifier
  /** Number of PBKDF2 iterations. */
  iterations?: number
}

/** Text encoder. */
const encoder = new TextEncoder()

/** Derives a 256-bit PBKDF2 hash from a secret and salt. */
export async function hash(secret: string, { salt, hash: algorithm = "SHA-256", iterations = 600_000 }: HashOptions): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(is.string().min(1).parse(secret)), "PBKDF2", false, ["deriveBits"])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: algorithm, iterations, salt }, key, 256))
}
