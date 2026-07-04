// Copyright (c) - 2025+ the lowlighter/esquie authors. AGPL-3.0-or-later
import { expect, Status, type testing } from "@libs/testing"
import { inspect } from "@libs/testing/highlight"
import { is } from "@libs/is"
import { mock } from "./mock.ts"

for (
  const { args, data, body, rejects } of [
    // Using response init with optional body init
    { args: [{ status: Status.Teapot }] },
    { args: [{ status: Status.Teapot, body: { foo: true } }], data: { foo: true } },
    { args: [{ status: Status.Teapot, body: new TextEncoder().encode("foobar") }], data: "foobar" },
    // Using handler function with input validation
    { args: [Object.assign(is.object({ foo: is.string() }), { [Symbol.for("Deno.customInspect")]: () => "schema" }), () => ({ status: Status.Teapot })], rejects: /Invalid input/ },
    { args: [Object.assign(is.object({ foo: is.string() }), { [Symbol.for("Deno.customInspect")]: () => "schema" }), () => ({ status: Status.Teapot })], body: { foo: "bar" }, data: null },
    { args: [Object.assign(is.object({ foo: is.string() }), { [Symbol.for("Deno.customInspect")]: () => "schema" }), ({ foo }: { foo: string }) => ({ status: Status.Teapot, body: { [foo]: "foo" } })], body: { foo: "bar" }, data: { bar: "foo" } },
    // Using handler function with implicit object input validation
    { args: [{ foo: Object.assign(is.string(), { [Symbol.for("Deno.customInspect")]: () => "schema" }) }, () => ({ status: Status.Teapot })], rejects: /Invalid input/ },
    { args: [{ foo: Object.assign(is.string(), { [Symbol.for("Deno.customInspect")]: () => "schema" }) }, () => ({ status: Status.Teapot })], body: { foo: "bar" }, data: null },
    { args: [{ foo: Object.assign(is.string(), { [Symbol.for("Deno.customInspect")]: () => "schema" }) }, ({ foo }: { foo: string }) => ({ status: Status.Teapot, body: { [foo]: "foo" } })], body: { foo: "bar" }, data: { bar: "foo" } },
    // Using handler function
    { args: [() => ({ status: Status.Teapot })], data: null },
    { args: [() => ({ status: Status.Teapot, body: { foo: true } })], data: { foo: true } },
    { args: [() => new Response(null, { status: Status.Teapot })] },
    { args: [() => new Response(JSON.stringify({ foo: true }), { status: Status.Teapot })], data: { foo: true } },
  ]
) {
  Deno.test(`\`mock(${args.map(inspect).join(", ")})\` ${rejects ? `rejects with \`${inspect(rejects)}\`` : `returns \`new Response(${inspect(data)}, ${inspect({ status: Status.Teapot })})\``}`, async () => {
    const request = new Request(import.meta.url, { method: body ? "POST" : undefined, body: JSON.stringify(body) })
    const pending = mock(...(args as [testing, testing]))(request)
    if (rejects) {
      await expect(pending).rejects.toThrow(rejects)
      return
    }
    const response = await pending
    await expect(response.clone()).toRespondWithStatus(Status.Teapot)
    if (data)
      await expect(response).toSatisfy((response: Response) => (typeof data === "string") ? expect(response.text()).resolves.toEqual(data) : expect(response.json()).resolves.toEqual(data))
    await response.body?.cancel().catch(() => null)
  })
}

Deno.test("`mock()` supports type inference", () => {
  // deno-lint-ignore no-unused-vars
  mock({ foo: is.string() }, ({ foo }) => new Response())
  // deno-lint-ignore no-unused-vars
  mock(is.object({ foo: is.string() }), ({ foo }) => new Response())
  // deno-lint-ignore no-unused-vars
  mock(is.array(is.string()), ([a, b, c]) => new Response())
  // @ts-expect-error: Property 'foo' does not exist on type 'String'
  // deno-lint-ignore no-unused-vars
  mock(is.string(), ({ foo }) => new Response())
})
