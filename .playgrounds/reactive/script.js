;(async function () {
  await llibs.forms.setup({
    deno: `
import { Context } from "jsr:@libs/reactive/context"
import { Logger } from "jsr:@libs/logger"
const log = new Logger({ options:{delta:false} })
const context = new Context({ foo: "bar", func() {} })

// Attach listeners
const listener = (event) => {
  delete event.detail.target
  log.with(event.detail).log()
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
