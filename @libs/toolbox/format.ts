/** Format a country code as a flag emoji. */
export function countryFlag(code: string): string {
  const cc = code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(cc))
    return code
  const A = 0x1f1e6
  return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65))
}

/** Normalize string to uppercase and remove diacritics. */
export function unfd(string: string): string {
  return string.toLocaleUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

/** Normalize string to lowercase and remove diacritics. */
export function lnfd(string: string): string {
  return unfd(string).toLocaleLowerCase()
}

/**
 * Strip emojis from a string.
 *
 * Keycap emojis are converted back to their base character
 * and flag emojis back to their two-letter country code.
 */
export function stripEmojis(string: string): string {
  return string
    .replace(/([#*0-9])\uFE0F?\u20E3/gu, "$1")
    .replace(/\p{Regional_Indicator}/gu, (char) => String.fromCharCode(char.codePointAt(0)! - 0x1f1e6 + 65))
    .replace(/\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier}|\u200D\p{Extended_Pictographic})*/gu, "")
}
