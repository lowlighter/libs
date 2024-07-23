import { TimeError as _class_TimeError } from "jsr:@std/testing@0.225.3/time"
/**
 * An error related to faking time.
 *
 * @example Usage
 * ```ts
 * import { FakeTime, TimeError } from "@std/testing/time";
 * import { assertThrows } from "@std/assert/assert-throws";
 *
 * assertThrows(() => {
 *   new FakeTime(NaN);
 * }, TimeError);
 * ```
 */
class TimeError extends _class_TimeError {}
export { TimeError }

import type { FakeTimeOptions as _interface_FakeTimeOptions } from "jsr:@std/testing@0.225.3/time"
/**
 * The option for {@linkcode FakeTime}
 */
interface FakeTimeOptions extends _interface_FakeTimeOptions {}
export type { FakeTimeOptions }

import { FakeTime as _class_FakeTime } from "jsr:@std/testing@0.225.3/time"
/**
 * Overrides the real Date object and timer functions with fake ones that can be
 * controlled through the fake time instance.
 *
 * Note: there is no setter for the `start` property, as it cannot be changed
 * after initialization.
 *
 * @example Usage
 * ```ts
 * import {
 *   assertSpyCalls,
 *   spy,
 * } from "@std/testing/mock";
 * import { FakeTime } from "@std/testing/time";
 *
 * function secondInterval(cb: () => void): number {
 *   return setInterval(cb, 1000);
 * }
 *
 * Deno.test("secondInterval calls callback every second and stops after being cleared", () => {
 *   using time = new FakeTime();
 *
 *   const cb = spy();
 *   const intervalId = secondInterval(cb);
 *   assertSpyCalls(cb, 0);
 *   time.tick(500);
 *   assertSpyCalls(cb, 0);
 *   time.tick(500);
 *   assertSpyCalls(cb, 1);
 *   time.tick(3500);
 *   assertSpyCalls(cb, 4);
 *
 *   clearInterval(intervalId);
 *   time.tick(1000);
 *   assertSpyCalls(cb, 4);
 * });
 * ```
 */
class FakeTime extends _class_FakeTime {}
export { FakeTime }
