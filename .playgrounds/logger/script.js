;(async function () {
  await llibs.forms.setup({
    deno: `
import { Logger } from "jsr:@libs/logger"
const log = new Logger({ level: Logger.level.debug, options: { date: true, time: true, caller: { file: true, name: true, line: true } } })

for (const level of Object.keys(Logger.level)) {
  if (level === "disabled") {
    continue
  }
  log[level]("hello world")
}`,
  })
})()
