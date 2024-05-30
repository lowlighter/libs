// deno-lint-ignore-file no-explicit-any
// Imports
import { functions } from "./_func.ts"

/** Async function constructor. */
export const AsyncFunction = Object.getPrototypeOf(functions.async).constructor as AsyncFunctionConstructor

/** Async function constructor interface. */
export interface AsyncFunctionConstructor {
  new <T = any>(...args: string[]): (...args: unknown[]) => Promise<T>
  <T = any>(...args: string[]): (...args: unknown[]) => Promise<T>
  readonly prototype: <T = any>(...args: unknown[]) => Promise<T>
}

/** Generator function constructor. */
export const GeneratorFunction = Object.getPrototypeOf(functions.generator).constructor as GeneratorFunctionConstructor

/** Generator function constructor interface. */
export interface GeneratorFunctionConstructor {
  new <T = unknown, TReturn = any, TNext = unknown>(...args: string[]): (...args: unknown[]) => Generator<T, TReturn, TNext>
  <T = unknown, TReturn = any, TNext = unknown>(...args: string[]): (...args: unknown[]) => Generator<T, TReturn, TNext>
  readonly prototype: <T = unknown, TReturn = any, TNext = unknown>(...args: unknown[]) => Generator<T, TReturn, TNext>
}

/** Async genreator function constructor. */
export const AsyncGeneratorFunction = Object.getPrototypeOf(functions.asyncGenerator).constructor as AsyncGeneratorFunctionConstructor

/** Async generator function constructor interface. */
export interface AsyncGeneratorFunctionConstructor {
  new <T = unknown, TReturn = any, TNext = unknown>(...args: string[]): (...args: unknown[]) => AsyncGenerator<T, TReturn, TNext>
  <T = unknown, TReturn = any, TNext = unknown>(...args: string[]): (...args: unknown[]) => AsyncGenerator<T, TReturn, TNext>
  readonly prototype: <T = unknown, TReturn = any, TNext = unknown>(...args: unknown[]) => AsyncGenerator<T, TReturn, TNext>
}
