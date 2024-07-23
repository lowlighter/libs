import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/expect@0.224.5/expect"
/**
 * A constructor that accepts any args and returns any value
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { Async as _typeAlias_Async } from "jsr:@std/expect@0.224.5/expect"
/**
 * converts all the methods in an interface to be async functions
 */
type Async<T> = _typeAlias_Async<T>
export type { Async }

import type { Expected as _interface_Expected } from "jsr:@std/expect@0.224.5/expect"
/**
 * The Expected interface defines the available assertion methods.
 */
interface Expected extends _interface_Expected {}
export type { Expected }

import { expect as _namespace_expect } from "jsr:@std/expect@0.224.5/expect"
/**
 * Additional properties on the `expect` function.
 */
const expect = _namespace_expect
export { expect }
