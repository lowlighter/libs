import { findSingle as _function_findSingle } from "jsr:@std/collections@1.0.6/find-single"
/**
 * Returns an element if and only if that element is the only one matching the
 * given condition. Returns `undefined` otherwise.
 *
 * @template T The type of the elements in the input array.
 *
 * @param array The array to find a single element in.
 * @param predicate The function to test each element for a condition.
 *
 * @return The single element that matches the given condition or `undefined`
 * if there are zero or more than one matching elements.
 *
 * @example Basic usage
 * ```ts
 * import { findSingle } from "@std/collections/find-single";
 * import { assertEquals } from "@std/assert";
 *
 * const bookings = [
 *   { month: "January", active: false },
 *   { month: "March", active: false },
 *   { month: "June", active: true },
 * ];
 * const activeBooking = findSingle(bookings, (booking) => booking.active);
 * const inactiveBooking = findSingle(bookings, (booking) => !booking.active);
 *
 * assertEquals(activeBooking, { month: "June", active: true });
 * assertEquals(inactiveBooking, undefined); // There are two applicable items
 * ```
 */
const findSingle = _function_findSingle as typeof _function_findSingle
export { findSingle }
