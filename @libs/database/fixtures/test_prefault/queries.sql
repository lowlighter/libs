-- @import { Options, Nested, Converted } from "./schema.ts"

-- readValue(options: Options): { value: number }
SELECT CAST(${1.value} AS INTEGER) AS value;

-- named(options: Options): { value: number }
SELECT CAST(${options.value} AS INTEGER) AS value;

-- nested(options: Nested): { value: number }
SELECT CAST(${1.options.value} AS INTEGER) AS value;

-- explicit(options: Options = {}): { value: number }
SELECT CAST(${1.value} AS INTEGER) AS value;

-- hooked(options: Options): { value: number }
-- #supply()
SELECT CAST(${1.value} AS INTEGER) AS value;

-- converted(options: Converted): { value: number }
-- *raw
SELECT CAST(${1.value} AS INTEGER) AS value;
