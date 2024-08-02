import { isValidCustomElementName as _function_isValidCustomElementName } from "jsr:@std/html@1.0.1/is-valid-custom-element-name"
/**
 * Returns whether the given string is a valid custom element name, as per the
 * requirements defined in
 * {@link https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 *
 * Using a valid custom element name
 *
 * ```ts
 * import { isValidCustomElementName } from "@std/html/is-valid-custom-element-name";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(isValidCustomElementName("custom-element"), true);
 * assertEquals(isValidCustomElementName("font-face"), false);
 * assertEquals(isValidCustomElementName("custom-element@"), false);
 * ```
 *
 * @param elementName The element name to be validate
 * @return `true` if the element name is valid, `false` otherwise.
 */
const isValidCustomElementName = _function_isValidCustomElementName
export { isValidCustomElementName }
