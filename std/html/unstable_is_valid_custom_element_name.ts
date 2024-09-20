import { isValidCustomElementName as _function_isValidCustomElementName } from "jsr:@std/html@1.0.3/unstable-is-valid-custom-element-name"
/**
 * Returns whether the given string is a valid custom element name, as per the
 * requirements defined in
 * {@link https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name}.
 *
 * @experimental
 * @example Usage
 *
 * Using a valid custom element name
 *
 * ```ts
 * import { isValidCustomElementName } from "@std/html/unstable-is-valid-custom-element-name";
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
const isValidCustomElementName = _function_isValidCustomElementName as typeof _function_isValidCustomElementName
export { isValidCustomElementName }
