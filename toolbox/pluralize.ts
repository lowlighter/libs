// Singular → plural rules, tried top to bottom; first match wins. Covers the
// regular cases plus the few irregulars common in data models.
const rules: [RegExp, string][] = [
  [/(pe)(?:rson|ople)$/i, "$1ople"], // person → people
  [/(child)(?:ren)?$/i, "$1ren"], // child → children
  [/(m)[ae]n$/i, "$1en"], // man, woman → men, women
  [/([^aeiouy])y$/i, "$1ies"], // category → categories
  [/(s|x|z|ch|sh)$/i, "$1es"], // box, class, status → boxes, classes, statuses
  [/$/i, "s"], // default: user → users
]

/**
 * Returns the plural form of a common English noun, preserving its casing.
 *
 * Intended for deriving SQL table names from singular schema names, so it only
 * handles the regular cases and a handful of everyday irregulars.
 */
export function pluralize(noun: string): string {
  if (!noun) return noun
  for (const [regex, replacement] of rules) {
    if (!regex.test(noun)) continue
    const plural = noun.replace(regex, replacement)
    return noun === noun.toUpperCase() ? plural.toUpperCase() : plural
  }
  return noun
}
