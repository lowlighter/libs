import { decodeTime as _function_decodeTime } from "jsr:@std/ulid@1.0.0/decode-time"
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
