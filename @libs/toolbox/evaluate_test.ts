import { expect } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { evaluate, type EvaluateOptions, EvaluationReturn, EvaluationSyntax } from "./evaluate.ts"

for (
  const { expression, context = {}, expected, error, ...options } of [
    // Explicit template literals
    { expression: "${a}", context: { a: null }, expected: null },
    { expression: "${a.b}", context: { a: {} }, expected: undefined },
    { expression: "${a+b}", context: { a: 1, b: 2 }, expected: 3 },
    { expression: "${a+b}", context: { a: 1n, b: 2n }, expected: 3n },
    { expression: "${a/0}", context: { a: 1 }, expected: Infinity },
    { expression: "${a/0}", context: { a: -1 }, expected: -Infinity },
    { expression: "${a/0}", context: { a: 0 }, expected: NaN },
    { expression: "${a||b}", context: { a: false, b: true }, expected: true },
    { expression: "${a+b}", context: { a: "foo", b: "bar" }, expected: "foobar" },
    { expression: "${`${a}${b}`}", context: { a: "foo", b: "bar" }, expected: "foobar" },
    { expression: "${{a}}", context: { a: "foo" }, expected: { a: "foo" } },
    { expression: "${{[a]:b}}", context: { a: "foo", b: "bar" }, expected: { foo: "bar" } },
    { expression: "${[a,b]}", context: { a: "foo", b: "bar" }, expected: ["foo", "bar"] },
    { expression: "${new RegExp('foo?', a)}", context: { a: "i" }, expected: /foo?/i },
    { expression: "${new Error(a)}", context: { a: "Expected error" }, expected: new Error("Expected error") },
    { expression: "${new Date(a)}", context: { a: 0 }, expected: new Date(0) },
    { expression: "${new Map(Object.entries(a))}", context: { a: { b: "foo" } }, expected: new Map([["b", "foo"]]) },
    { expression: "${new Set(Object.values(a))}", context: { a: ["foo"] }, expected: new Set(["foo"]) },
    // Implicit template literals
    { expression: "foo${a}", context: { a: "bar" }, expected: "foobar" },
    { expression: "${a}bar", context: { a: "foo" }, expected: "foobar" },
    { expression: "${a}${b}", context: { a: "foo", b: "bar" }, expected: "foobar" },
    { expression: "f${a}b${b}", context: { a: "oo", b: "ar" }, expected: "foobar" },
    { expression: "a", context: { a: "foo" }, expected: "a" },
    { expression: "\\${a}", context: { a: "foo" }, expected: "${a}" },
    // Preload option
    { expression: "${a+b}", preload: "const a = 1; const b = 2;", expected: 3 },
    // Syntax option
    { expression: "${a}", context: { a: "foo" }, syntax: EvaluationSyntax.Template, expected: "foo" },
    { expression: "${a}", context: { a: "foo" }, syntax: EvaluationSyntax.Block, error: [SyntaxError, "Unexpected token"] },
    { expression: "${a}", context: { a: "foo" }, syntax: EvaluationSyntax.Function, error: [SyntaxError, "Unexpected token"] },
    { expression: "a", context: { a: "foo" }, syntax: EvaluationSyntax.Template, expected: "a" },
    { expression: "a", context: { a: "foo" }, syntax: EvaluationSyntax.Block, expected: "foo" },
    { expression: "a", context: { a: "foo" }, syntax: EvaluationSyntax.Function, expected: undefined },
    { expression: "return a", context: { a: "foo" }, syntax: EvaluationSyntax.Template, expected: "return a" },
    { expression: "return a", context: { a: "foo" }, syntax: EvaluationSyntax.Block, error: [SyntaxError, "Unexpected token"] },
    { expression: "return a", context: { a: "foo" }, syntax: EvaluationSyntax.Function, expected: "foo" },
    { expression: "throw new EvalError('Expected error')", syntax: EvaluationSyntax.Template, expected: "throw new EvalError('Expected error')" },
    { expression: "throw new EvalError('Expected error')", syntax: EvaluationSyntax.Block, error: [SyntaxError, "Unexpected token"] },
    { expression: "throw new EvalError('Expected error')", syntax: EvaluationSyntax.Function, error: [EvalError, "Expected error"] },
    // Return option
    { expression: "${1}", return: undefined, expected: 1 },
    { expression: "${1}", return: EvaluationReturn.Unknown, expected: 1 },
    { expression: "${1}", return: EvaluationReturn.Boolean, expected: true },
    { expression: "${1}", return: EvaluationReturn.String, expected: "1" },
    // Signal option
    { expression: "${1}", signal: () => new AbortController().signal, expected: 1 },
    { expression: "${1}", signal: () => AbortSignal.abort(), error: [DOMException, "aborted"] },
    { expression: "${await new Promise(resolve => setTimeout(() => resolve(false), 125))}", signal: () => AbortSignal.timeout(50), error: [DOMException, /(?:Signal timed out)|(?:aborted due to timeout)/] },
    { expression: "${await new Promise((_, reject) => setTimeout(() => reject(new Error('Expected error')), 125))}", signal: () => AbortSignal.timeout(50), error: [DOMException, /(?:Signal timed out)|(?:aborted due to timeout)/] },
    // Sync option
    { expression: "${a+b}", context: { a: 1, b: 2 }, sync: true, expected: 3 },
    { expression: "foo${a}", context: { a: "bar" }, sync: true, expected: "foobar" },
    { expression: "a", context: { a: "foo" }, sync: true, expected: "a" },
    { expression: "${a+b}", preload: "const a = 1; const b = 2;", sync: true, expected: 3 },
    { expression: "a", context: { a: "foo" }, sync: true, syntax: EvaluationSyntax.Block, expected: "foo" },
    { expression: "a", context: { a: "foo" }, sync: true, syntax: EvaluationSyntax.Function, expected: undefined },
    { expression: "return a", context: { a: "foo" }, sync: true, syntax: EvaluationSyntax.Function, expected: "foo" },
    { expression: "throw new EvalError('Expected error')", sync: true, syntax: EvaluationSyntax.Function, error: [EvalError, "Expected error"] },
    { expression: "${1}", sync: true, return: EvaluationReturn.Boolean, expected: true },
    { expression: "${1}", sync: true, return: EvaluationReturn.String, expected: "1" },
    // Sync mode does not await promises and ignores abort signals
    { expression: "Promise.resolve(1)", syntax: EvaluationSyntax.Block, return: EvaluationReturn.String, expected: "1" },
    { expression: "Promise.resolve(1)", sync: true, syntax: EvaluationSyntax.Block, return: EvaluationReturn.String, expected: "[object Promise]" },
    { expression: "${await a}", context: { a: Promise.resolve(1) }, sync: true, error: [SyntaxError, "await is only valid in async functions"] },
    { expression: "${1}", sync: true, signal: () => AbortSignal.abort(), expected: 1 },
    // Errors
    { expression: "${}", error: [SyntaxError, "Unexpected token"] },
    { expression: "${a}", context: { __testing__: null }, error: [ReferenceError, "is not defined"] },
    { expression: "${1}", context: { __evaluate__: true }, error: [/reserved variable name/] },
    { expression: "${}", sync: true, error: [SyntaxError, "Unexpected token"] },
    { expression: "${a}", context: { __testing__: null }, sync: true, error: [ReferenceError, "is not defined"] },
    { expression: "${1}", context: { __evaluate__: true }, sync: true, error: [/reserved variable name/] },
  ] as Array<{ expression: string; context?: Record<PropertyKey, unknown>; expected?: unknown; error?: [(new (...args: string[]) => Error) | RegExp, (string | RegExp)?]; signal?: () => AbortSignal } & Omit<EvaluateOptions, "signal">>
) {
  Deno.test(`\`evaluate(${inspect(expression)}, ${inspect(context)}, ${inspect(options)})\` ${error ? `throws ${inspect(error)}` : `returns ${inspect(expected)}`}`, async () => {
    // Signals are instantiated lazily so their timers only start once the test actually runs
    const resolved = { ...options, signal: options.signal?.() }
    if (resolved.sync) {
      const sync = resolved as EvaluateOptions & { sync: true }
      if (error)
        expect(() => evaluate(expression, context, sync)).toThrow(...error)
      else
        expect(evaluate(expression, context, sync)).toEqual(expected)
    } else {
      const async = resolved as EvaluateOptions & { sync?: false }
      if (error)
        await expect(evaluate(expression, context, async)).rejects.toThrow(...error)
      else
        await expect(evaluate(expression, context, async)).resolves.toEqual(expected)
    }
    // Let pending timers from the aborted expression settle to satisfy the test sanitizer
    if ("signal" in options)
      await new Promise((resolve) => setTimeout(resolve, 250))
  })
}
