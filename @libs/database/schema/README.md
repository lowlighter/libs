# Database schemas

A subset of the `@libs/is` ([Zod based](https://zod.dev) validation) expanded to support database modifiers.

```ts
import { is } from "@libs/database/schema"

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
deno run --allow-read --allow-write --ignore-env @libs/database/generate --table models.ts
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

| Application value                         | SQLite                      | PostgreSQL  |
| ----------------------------------------- | --------------------------- | ----------- |
| Boolean                                   | INTEGER, revived as boolean | BOOLEAN     |
| Date                                      | ISO text                    | TIMESTAMPTZ |
| Object / array / record / JSON            | JSON text                   | JSONB       |
| Bigint column                             | BIGINT                      | BIGINT      |
| String / UUID / enum / URL / ISO datetime | TEXT                        | TEXT        |
