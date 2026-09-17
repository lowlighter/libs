// Imports
// deno-lint-ignore-file no-console
import { Database } from "@libs/database"
import Query from "./sql.generated.ts"

await using database = new Database(":memory:")
const result = await database.query(Query.hello("world"))
console.log(result)

database.register("message", (greeting: Greeting) => Promise.resolve(greeting.message))
const message = await database.query(Query.helloText("world"))
console.log(message)

type Greeting = {
  message: string
}
