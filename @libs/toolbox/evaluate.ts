// Imports
import { AsyncFunction } from "@libs/typing/func"

/** Reserved identifier used internally by {@linkcode evaluate()} to share state with the evaluated expression. */
const reserved = "__evaluate__"

/** Evaluate an expression and return a string. */
export function evaluate(expression: string, context: Readonly<Record<PropertyKey, unknown>>, options: EvaluateOptions & { sync: true; return: typeof EvaluationReturn.String }): string
/** Evaluate an expression and return a boolean. */
export function evaluate(expression: string, context: Readonly<Record<PropertyKey, unknown>>, options: EvaluateOptions & { sync: true; return: typeof EvaluationReturn.Boolean }): boolean
/** Evaluate an expression against a context. */
export function evaluate(expression: string, context?: Readonly<Record<PropertyKey, unknown>>, options?: EvaluateOptions & { sync: true }): unknown
/** Evaluate an expression and return a string. */
export async function evaluate(expression: string, context: Readonly<Record<PropertyKey, unknown>>, options: EvaluateOptions & { sync?: false; return: typeof EvaluationReturn.String }): Promise<string>
/** Evaluate an expression and return a boolean. */
export async function evaluate(expression: string, context: Readonly<Record<PropertyKey, unknown>>, options: EvaluateOptions & { sync?: false; return: typeof EvaluationReturn.Boolean }): Promise<boolean>
/**
 * Evaluate an expression against a context.
 *
 * The context is exposed to the expression through a `with` scope, meaning its entries can be referenced directly by name.
 *
 * ```ts
 * import { evaluate } from "./evaluate.ts"
 * console.assert(await evaluate("${a + b}", { a: 1, b: 2 }) === 3)
 * console.assert(await evaluate("foo${a}", { a: "bar" }) === "foobar")
 * ```
 */
export function evaluate(expression: string, context?: Readonly<Record<PropertyKey, unknown>>, options?: EvaluateOptions & { sync?: false }): Promise<unknown>
export function evaluate(expression: string, context: Readonly<Record<PropertyKey, unknown>> = {}, { sync = false, preload, syntax = EvaluationSyntax.Template, return: coerce, signal }: EvaluateOptions = {}) {
  // Check whether the expression needs to be executed
  let execute = syntax !== EvaluationSyntax.Template
  if (syntax === EvaluationSyntax.Template) {
    // Unwrap expressions of the form `${...}`
    if (expression.startsWith("${") && expression.endsWith("}") && (coerce !== EvaluationReturn.String)) {
      let depth = 1
      let i = 2
      for (; (i < expression.length) && (depth > 0); i++)
        depth += (expression[i] === "{") ? 1 : (expression[i] === "}") ? -1 : 0
      if ((depth === 0) && (i === expression.length)) {
        expression = expression.slice(2, -1).trim()
        execute = true
      }
    }
    // Quote implicit template literals
    if ((!execute) && (/\$\{[\s\S]*\}/.test(expression))) {
      expression = `\`${expression}\``
      execute = true
    }
  }
  if (!execute)
    return sync ? expression : Promise.resolve(expression)

  // Prevent internal state corruption from namespace collisions
  if (reserved in context) {
    const error = new ReferenceError(`"${reserved}" is a reserved variable name`)
    if (sync)
      throw error
    return Promise.reject(error)
  }

  // Evaluate the expression
  if (sync) {
    try {
      if (syntax === EvaluationSyntax.Function)
        expression = `(()=>{${expression}})()`
      const fn = new Function(reserved, `${preload};with(${reserved}.context){${reserved}.result=${expression}}return ${reserved}.result`)
      const result = fn({ context, result: undefined })
      return coerce === EvaluationReturn.String ? `${result}` : coerce === EvaluationReturn.Boolean ? !!result : result
    } catch (error) {
      if (error instanceof Error)
        delete error.stack
      throw error
    }
  }
  if (syntax === EvaluationSyntax.Function)
    expression = `await(async()=>{${expression}})()`
  return (async () => {
    const fn = new AsyncFunction(reserved, `${preload};with(${reserved}.context){${reserved}.result=${expression}}return ${reserved}.result`)
    const result = await abortable(fn({ context, result: undefined }), signal)
    return coerce === EvaluationReturn.String ? `${result}` : coerce === EvaluationReturn.Boolean ? !!result : result
  })().catch((error) => {
    if (error instanceof Error)
      delete error.stack
    throw error
  })
}

/** Race a promise against an abort signal, rejecting with the signal reason upon abortion. */
async function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal)
    return promise
  const { promise: aborted, reject } = Promise.withResolvers<never>()
  const onabort = () => reject(signal.reason)
  signal.addEventListener("abort", onabort, { once: true })
  try {
    signal.throwIfAborted()
    return await Promise.race([promise, aborted])
  } finally {
    signal.removeEventListener("abort", onabort)
    // Mark a possible late settlement as handled to avoid unhandled rejections after abortion
    promise.catch(() => {})
  }
}

/** Syntaxes supported by {@linkcode evaluate()}. */
export enum EvaluationSyntax {
  /** Treat the expression as an implicit template literal: expressions wrapped in `${...}` are evaluated, anything else is returned as-is. */
  Template,
  /** Treat the expression as a single JavaScript expression. */
  Block,
  /** Treat the expression as an asynchronous function body, where `return` statements yield the result. */
  Function,
}

/** Coercions applicable to an {@linkcode evaluate()} result. */
export enum EvaluationReturn {
  /** Return the result as-is. */
  Unknown,
  /** Coerce the result to a boolean. */
  Boolean,
  /** Coerce the result to a string. */
  String,
}

/** Options for {@linkcode evaluate()}. */
export type EvaluateOptions = {
  /** Code evaluated before the expression, useful to declare constants or helper functions. */
  preload?: string
  /** Syntax used to interpret the expression (defaults to {@linkcode EvaluationSyntax.Template}). */
  syntax?: EvaluationSyntax
  /** Coercion applied to the result (defaults to {@linkcode EvaluationReturn.Unknown}). */
  return?: EvaluationReturn
  /** Abort signal (ignored if running in sync mode). */
  signal?: AbortSignal
  /** Whether to evaluate in a synchronous manner. */
  sync?: boolean
}
