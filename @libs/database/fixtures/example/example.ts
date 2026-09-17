// Imports
// deno-lint-ignore-file no-console
import { Database } from "@libs/database"
import Query from "./example.gen.ts"

await using database = new Database(":memory:")
const result = await database.query(Query.hello("world"))
console.log(result)

database.register("trim", (value: string) => Promise.resolve(value.trim()))
database.register("message", (greeting: Greeting) => Promise.resolve(greeting.message))
const message = await database.query(Query.helloText("world"))
console.log(message)

/** A greeting returned by the example queries. */
export type Greeting = {
  /** Greeting text. */
  message: string
}
