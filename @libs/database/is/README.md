# Database schemas

A subset of the `@libs/is` ([Zod based](https://zod.dev) validation) expanded to support database modifiers.

```ts
import { is } from "@libs/database/is"

export const User = is.table("users", {
  id: is.uuid().primary(),
  name: is.string().min(1).unique(),
  active: is.boolean().default(true),
  created: is.timestamp(),
  settings: is.object({ theme: is.enum(["light", "dark"]) }),
}).index(["created", "active"])
```

Most of Zod features are preserved, including modifiers and metadata.

## Table creation

SQL tables queries can be automatically created from the schema definitions:

```sh
deno run --allow-read --allow-write --allow-run --ignore-env @libs/database/generate --table models.ts
```

```ts
import Table from "./models.gen.ts"

await database.query(Table.create()) // all exported tables in dependency order
await database.query(Table.User()) // just User and its indexes
```

| Modifier                         | Meaning                                    |
| -------------------------------- | ------------------------------------------ |
| `.primary()`                     | Primary key                                |
| `.primary({ identity: true })`   | SQLite autoincrement / PostgreSQL identity |
| `.index()`                       | Index                                      |
| `.unique()`                      | Unique constraint                          |
| `.references("table", "column")` | Foreign key                                |
| `table.index(["a", "b"])` /      | Composite index                            |
| `table.unique(["a", "b"])` /     | Composite unique constraint                |

Referential actions for foreign keys can be specified using the `{ delete, update }` object options.

Modifiers are usually ignored (for example `.default()` does not generate a `DEFAULT` directive, nor does `.min()`/`.max()` generate `CHECK` constraints) because it is assumed these are already handled at the application level.

However, typing information is preserved to offer a transparent mapping between application-level types and database columns.

| Application value                    | SQLite  | PostgreSQL       |
| ------------------------------------ | ------- | ---------------- |
| Boolean                              | INTEGER | BOOLEAN          |
| Date                                 | TEXT    | TIMESTAMPTZ      |
| Object                               | TEXT    | JSONB            |
| Array                                | TEXT    | JSONB            |
| JSON                                 | TEXT    | JSONB            |
| BigInt                               | BIGINT  | BIGINT           |
| String                               | TEXT    | TEXT             |
| UUID                                 | TEXT    | TEXT             |
| URL                                  | TEXT    | TEXT             |
| Enum                                 | TEXT    | TEXT             |
| Enum (finite integers only)          | INTEGER | INTEGER          |
| Integer (`is.int()`)                 | INTEGER | INTEGER          |
| Number (`is.number()`)               | REAL    | DOUBLE PRECISION |
| Unix milliseconds (`is.timestamp()`) | INTEGER | BIGINT           |
| Uint8Array                           | BLOB    | BYTEA            |

## Shared application schemas

Keep common validation in a module importing only `@libs/is`. In a server-only module, wrap existing fields with `is.column(schema)` to add database constraints:

```ts
import { is } from "@libs/database/is"
import { User } from "../shared/user.ts"

export const UserTable = is.table("users", {
  ...User.shape,
  id: is.column(User.shape.id).primary(),
  name: is.column(User.shape.name).unique(),
})
```

The wrapper clones the schema, preserving its validation, defaults, and input/output types without modifying the shared original. Keep database imports out of client modules and shared barrels. Wrapping a schema does not add support for otherwise unsupported storage types.

Spreading an object's shape preserves field validation, but does not copy the parent object's refinements or unknown-property policy. Wrapping a whole object as a JSON column preserves those checks.
