import { encodeBase64 } from "@std/encoding/base64"

/** Transparent 1x1 PNG data URL. */
const fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=="

/** Encode a PNG buffer as a base64 data URL. */
export function imgb64(image: ArrayBuffer): string
/** Download a remote PNG and return it as a base64 data URL. */
export function imgb64(image: string): Promise<string>
export function imgb64(image: string | ArrayBuffer) {
  if (image instanceof ArrayBuffer)
    return `data:image/png;base64,${encodeBase64(image)}`
  return fetchb64(image)
}

/** Download a remote PNG and return it as a base64 data URL. */
async function fetchb64(url: string) {
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
