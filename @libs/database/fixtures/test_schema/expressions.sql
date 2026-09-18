-- @import { User as Model, Timestamp, Summary, State, Mixed } from "./models.ts"

-- primitive(input: {id: Model["id"]; name?: string; count: number; active: boolean; big: bigint; choice: "one"}): {id: Model["id"]}
SELECT CAST(${input.id} AS TEXT) AS id;

-- optional(input: Optional<Pick<Model, "id">>): Nullable<Pick<Model, "id">>
SELECT '123e4567-e89b-42d3-a456-426614174000' AS id;

-- nullable(input: Model["id"] | null | undefined): {id: Model["id"]} | null
SELECT '123e4567-e89b-42d3-a456-426614174000' AS id;

-- readonly(input: readonly Model["id"][]): ReadonlyArray<Pick<Model, "id">>
SELECT CAST(${input[0]} AS TEXT) AS id;

-- rest(...inputs: Model["id"][]): NonEmptyArray<Pick<Model, "id">>
SELECT CAST(${inputs[0]} AS TEXT) AS id;

-- arrayable(input: Arrayable<Pick<Model, "id">>): Arrayable<Pick<Model, "id">>
SELECT '123e4567-e89b-42d3-a456-426614174000' AS id;

-- promised(input: Pick<Model, "id">): Promisable<Pick<Model, "id">>
SELECT CAST(${input.id} AS TEXT) AS id;

-- parenthesized(input: (Model["id"])): NonVoid<Pick<Model, "id">>
SELECT CAST(${input} AS TEXT) AS id;

-- dates(input: {id: Model["id"]; date: Date}): {id: Model["id"]; date: Date}
SELECT CAST(${input.id} AS TEXT) AS id, CAST(${input.date} AS TEXT) AS date;

-- arrayPattern([id]: Model["id"][]): Pick<Model, "id">
SELECT CAST(${id} AS TEXT) AS id;

-- readonlyObject(input: Readonly<Pick<Model, "id">>): Readonly<Pick<Model, "id">>
SELECT CAST(${input.id} AS TEXT) AS id;

-- readonlyRows(input: Model["id"]): Readonly<Pick<Model, "id">[]>
SELECT CAST(${input} AS TEXT) AS id;

-- generic<T extends Pick<Model, "id">>(input: T): T
SELECT CAST(${input.id} AS TEXT) AS id, 'kept' AS extra;

-- objectRest({id, ...rest}: Pick<Model, "id" | "active">): Pick<Model, "id" | "active">
SELECT CAST(${id} AS TEXT) AS id, ${rest.active} AS active;

-- arrayRest([first, ...rest]: Model["id"][]): Pick<Model, "id">
SELECT CAST(${rest[0]} AS TEXT) AS id;

-- timestamp(input: Timestamp): {time: Timestamp}
SELECT CAST(${input} AS BIGINT) AS time;

-- typeonly(input: Pick<Model, "id" | "active" | "created" | "name">): Pick<Model, "id" | "active" | "created" | "name">
-- *typeonly
SELECT CAST(${input.id} AS TEXT) AS id, ${input.active} AS active, CAST(${input.created} AS TEXT) AS created, CAST(${input.name} AS TEXT) AS name;

-- uncheckedHooks(input: Summary): Summary
-- *typeonly
-- #supply()
-- @shorten(): Summary
SELECT CAST(${input.name} AS TEXT) AS name, ${input.active} AS active;

-- checked(input: Summary): Summary
SELECT CAST(${input.name} AS TEXT) AS name, ${input.active} AS active;

-- raw(input: Model["settings"]): {value: Model["settings"]}
-- *raw
-- *typeonly
SELECT CAST(${input} AS TEXT) AS value;

-- rawChecked(input: Summary): Summary
-- *raw
SELECT CAST(${input.name} AS TEXT) AS name, 1 AS active;

-- afterRaw(input: Pick<Model, "active">): Pick<Model, "active">
SELECT ${input.active} AS active;

-- enumInteger(input: State): {value: State}
SELECT CAST(${input} AS INTEGER) AS value;

-- enumMixed(input: Mixed): {value: Mixed}
SELECT CAST(${input} AS TEXT) AS value;
