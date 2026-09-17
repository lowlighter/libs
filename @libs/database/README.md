# @libs/database

A database abstraction compatible with SQLite and PostgreSQL.

```ts
import { Database } from "@libs/database"
import Query from "./users.gen.ts"

await using database = new Database(":memory:")
await database.run("CREATE TABLE users(id TEXT, domain TEXT)")
const users = await database.query(Query.getUsers("example.org"))
```

## SQL generation

Define your SQL queries and the corresponding TypeScript signatures in comments. Custom types can be imported using the `@import` directive.

```sql
-- @import { User } from "./types.ts"

-- getUsers(domain: string): User[]
SELECT * FROM users WHERE domain=${1} ORDER BY id;

-- getUser(id: string): Nullable<User>
SELECT * FROM users WHERE id={id};

-- deleteUser(id: string): User
-- @audit("USER_DELETE")
DELETE FROM users WHERE id=${1} RETURNING *;
```

Generate the TypeScript code from your SQL definitions using the provided CLI.

```sh
deno run --allow-read --allow-write @libs/database/generate users.sql
```

### Special syntax

#### `@import`

Used to import custom types from other TypeScript files.

#### Function signatures

Function signatures define the TypeScript types for your SQL queries. They are written as comments above the corresponding SQL statements

```sql
-- functionName(param1: Type1, param2: Type2): ReturnType
SELECT ...
```

Function are implicitly asynchronous.

The output type determines how the result of the SQL query is interpreted and returned to the caller.

| Declared SQL result                            | Returned value                                       |
| ---------------------------------------------- | ---------------------------------------------------- |
| `User[]`, `Array<User>`, `ReadonlyArray<User>` | All rows, including an empty array                   |
| `User`                                         | First row, throws `ReferenceError` when none matches |
| `Nullable<User>`, `User \| null`               | First row, or `null`                                 |
| `Optional<User>`, `User \| undefined`          | First row, or `undefined`                            |
| `void`                                         | Execute and discard the rows                         |

#### Bindings

Bindings are placeholders in SQL queries that are replaced with actual values at runtime.

They will become parameters in the SQL query, but they need to be properly mapped first.

The following syntax are supported for bindings:

- `${index}`: Refers to the positional parameter at the given index, 1-based (e.g. `${1}`, `${2}`)
- `${varname}`: Refers to the named parameter with the given name.
- Properties may be accessed using dot or bracket notation (e.g. `${1.foo.bar}`, `${1.items[0].bar}`, etc.)

The special `${0}` refers to the context object provided to the query. It is not properly typed and should be used with caution.

```sql
-- example(name: string)
SELECT * FROM users WHERE name = ${1};
SELECT * FROM users WHERE name = ${name};
```

#### Pre-`#hook`

Used to define pre-hooks that are executed before the corresponding SQL query. These hooks are executed before the SQL is run and before the transaction is opened (they may run inside a transaction in case of nested queries).

It receives the provided context (if any) and the SQL query parameters as arguments. If it returns a defined value, it replaces the original query parameters with the returned tuple (note that types cannot be changed).

Pre-hooks can be chained, with each hook receiving the updated query parameters from the previous one. Pre-hooks cannot have a return-type annotation.

```sql
-- print(message: string): {message: string}
-- #trim()
SELECT {name} AS message;
```

#### Post-`@hook`

Used to define post-hooks that are executed after the corresponding SQL query within a transaction.

It receives the provided context (if any) and the result of the SQL query as arguments. If it returns a defined value, that value replaces the original result.

Post-hooks can be chained, with each hook receiving the result of the previous one. If a post-hook changes the result type, it is advised to explicitly declare the output type:

```sql
-- @keep([ "id", "name" ]): { id: string, name: string }
-- @stringify(): string
```

Hooks must be registered within the database instance before executing any queries that rely on them. When using a regular function, the `this` context refers to the database instance, allowing you to execute and await further database operations within the same transaction.
