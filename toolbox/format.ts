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

/** Strip emojis from a string. */
export function stripEmojis(string: string): string {
  return string.replace(/[\p{Emoji}\p{Emoji_Component}]+/gu, "")
}
