/**
 * Utilities for generating and working with
 * {@link https://github.com/ulid/spec | Universally Unique Lexicographically Sortable Identifiers (ULIDs)}.
 *
 * To generate a ULID use the {@linkcode ulid} function. This will generate a
 * ULID based on the current time.
 *
 * ```ts no-assert
 * import { ulid } from "@std/ulid";
 *
 * ulid(); // 01HYFKMDF3HVJ4J3JZW8KXPVTY
 * ```
 *
 * {@linkcode ulid} does not guarantee that the ULIDs will be strictly
 * increasing for the same current time. If you need to guarantee that the ULIDs
 * will be strictly increasing, even for the same current time, use the
 * {@linkcode monotonicUlid} function.
 *
 * ```ts no-assert
 * import { monotonicUlid } from "@std/ulid";
 *
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAS
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAT
 * ```
 *
 * Because each ULID encodes the time it was generated, you can extract the
 * timestamp from a ULID using the {@linkcode decodeTime} function.
 *
 * ```ts
 * import { decodeTime, ulid } from "@std/ulid";
 * import { assertEquals } from "@std/assert";
 *
 * const timestamp = 150_000;
 * const ulidString = ulid(timestamp);
 *
 * assertEquals(decodeTime(ulidString), timestamp);
 * ```
 *
 * @module
 */
import { decodeTime as _function_decodeTime } from "jsr:@std/ulid@1.0.0"
/**
 * Extracts the number of milliseconds since the Unix epoch that had passed when
 * the ULID was generated. If the ULID is malformed, an error will be thrown.
 *
 * @example Decode the time from a ULID
 * ```ts
 * import { decodeTime, ulid } from "@std/ulid";
 * import { assertEquals } from "@std/assert";
 *
 * const timestamp = 150_000;
 * const ulidString = ulid(timestamp);
 *
 * assertEquals(decodeTime(ulidString), timestamp);
 * ```
 *
 * @param ulid The ULID to extract the timestamp from.
 * @return The number of milliseconds since the Unix epoch that had passed when the ULID was generated.
 */
const decodeTime = _function_decodeTime as typeof _function_decodeTime
export { decodeTime }

import { monotonicUlid as _function_monotonicUlid } from "jsr:@std/ulid@1.0.0"
/**
 * Generate a ULID that monotonically increases even for the same millisecond,
 * optionally passing the current time. If the current time is not passed, it
 * will default to `Date.now()`.
 *
 * Unlike the {@linkcode ulid} function, this function is guaranteed to return
 * strictly increasing ULIDs, even for the same seed time, but only if the seed
 * time only ever increases. If the seed time ever goes backwards, the ULID will
 * still be generated, but it will not be guaranteed to be monotonic with
 * previous ULIDs for that same seed time.
 *
 * @example Generate a monotonic ULID
 * ```ts no-assert
 * import { monotonicUlid } from "@std/ulid";
 *
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAS
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAT
 * monotonicUlid(); // 01HYFKHHX8H4BRY8BYHAV1BZ2T
 * ```
 *
 * @example Generate a monotonic ULID with a seed time
 * ```ts no-assert
 * import { monotonicUlid } from "@std/ulid";
 *
 * // Strict ordering for the same timestamp, by incrementing the least-significant random bit by 1
 * monotonicUlid(150000); // 0000004JFHJJ2Z7X64FN2B4F1Q
 * monotonicUlid(150000); // 0000004JFHJJ2Z7X64FN2B4F1R
 * monotonicUlid(150000); // 0000004JFHJJ2Z7X64FN2B4F1S
 * monotonicUlid(150000); // 0000004JFHJJ2Z7X64FN2B4F1T
 * monotonicUlid(150000); // 0000004JFHJJ2Z7X64FN2B4F1U
 *
 * // A different timestamp will reset the random bits
 * monotonicUlid(150001); // 0000004JFHJJ2Z7X64FN2B4F1P
 *
 * // A previous seed time will not guarantee ordering, and may result in a
 * // ULID lower than one with the same seed time generated previously
 * monotonicUlid(150000); // 0000004JFJ7XF6D76ES95SZR0X
 * ```
 *
 * @param seedTime The time to base the ULID on, in milliseconds since the Unix epoch. Defaults to `Date.now()`.
 * @return A ULID that is guaranteed to be strictly increasing for the same seed time.
 */
const monotonicUlid = _function_monotonicUlid as typeof _function_monotonicUlid
export { monotonicUlid }

import { ulid as _function_ulid } from "jsr:@std/ulid@1.0.0"
/**
 * Generate a ULID, optionally based on a given timestamp. If the timestamp is
 * not passed, it will default to `Date.now()`.
 *
 * Multiple calls to this function with the same seed time will not guarantee
 * that the ULIDs will be strictly increasing, even if the seed time is the
 * same. For that, use the {@linkcode monotonicUlid} function.
 *
 * @example Generate a ULID
 * ```ts no-assert
 * import { ulid } from "@std/ulid";
 *
 * ulid(); // 01HYFKMDF3HVJ4J3JZW8KXPVTY
 * ulid(); // 01HYFKMDF3D2P7G502B9Z2VKV0
 * ulid(); // 01HYFKMDZQ7JD17CRKDXQSZ3Z4
 * ```
 *
 * @example Generate a ULID with a seed time
 * ```ts no-assert
 * import { ulid } from "@std/ulid";
 *
 * ulid(150000); // 0000004JFG3EKDRE04TVVDJW7K
 * ulid(150000); // 0000004JFGN0KHBH0447AK895X
 * ulid(150000); // 0000004JFGMRDH0PN7SM8BZN06
 * ```
 *
 * @param seedTime The time to base the ULID on, in milliseconds since the Unix epoch. Defaults to `Date.now()`.
 * @return A ULID.
 */
const ulid = _function_ulid as typeof _function_ulid
export { ulid }
