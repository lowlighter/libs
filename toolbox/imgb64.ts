import { encodeBase64 } from "@std/encoding/base64"

/** Download a remote PNG and return it as a base64 data URL. */
export async function imgb64(url: string): Promise<string> {
  try {
    return `data:image/png;base64,${encodeBase64(await fetch(url).then((res) => res.arrayBuffer()))}`
  } catch {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=="
  }
}
