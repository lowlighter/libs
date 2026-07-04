import { encodeBase64 } from "@std/encoding/base64"

/** Transparent 1x1 PNG data URL. */
const fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=="

/** Download a remote PNG and return it as a base64 data URL. */
export async function imgb64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      await response.body?.cancel()
      return fallback
    }
    return `data:image/png;base64,${encodeBase64(await response.arrayBuffer())}`
  } catch {
    return fallback
  }
}
