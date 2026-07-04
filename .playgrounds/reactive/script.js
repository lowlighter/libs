;(async function () {
  await llibs.forms.setup({
    deno: `
import { Context } from "jsr:@libs/reactive/context"
const context = new Context({ foo: "bar", func() {} })

// Attach listeners
const listener = (event) => {
  delete event.detail.target
  console.log(event.detail)
}
context.addEventListener("get", listener)
context.addEventListener("set", listener)
context.addEventListener("delete", listener)
context.addEventListener("call", listener)

// Play with reactive context
const { target } = context
target.foo
target.foo = "baz"
delete target.foo
target.func("hello", "world")`,
  })
})()
