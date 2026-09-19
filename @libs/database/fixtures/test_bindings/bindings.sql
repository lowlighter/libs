-- renamed({id: key = "1"}: {id?: string} = {}, fallback = key, ...extra: string[]): {id: string}
SELECT ${fallback} AS id WHERE ${fallback}=${3[0]};

-- indexed(input: {items: {id: string}[]}): {id: string}
SELECT ${1.items[0]["id"]} AS id;

-- generic<T extends {id: string}>([value]: [T]): T[]
SELECT ${value.id} AS id;

-- optional(): Optional<{id: string}>
SELECT '1' AS id WHERE 1=0;

-- chain(value: string): {value: string}
-- @text(): string
-- @length(): number
-- @observe()
SELECT ${1} AS value;

-- context(): {value: Nullable<string>}
SELECT CAST(${0} AS TEXT) AS value;

-- scoped(): {value: Nullable<string>}
SELECT CAST(${0.profile.items[0]["id"]} AS TEXT) AS value;

-- named(bar: string): {value: string}
SELECT ${bar} AS value WHERE ${1} = ${bar};

-- braces(bar: string): {value: string}
SELECT {bar} AS value;

-- syntax(entrée = /x/ instanceof RegExp ? `${1 + 2}` : "fallback"): {value: string}
SELECT ${entrée} AS value;

-- enriched(): { zero: string; named: string; record: string; alias: string }
-- #enrich()
-- #inspect()
-- @inspectResult()
SELECT CAST(${0.actor} AS TEXT) AS zero,
CAST(${_.actor} AS TEXT) AS named, CAST(${0} AS TEXT) AS record, CAST(${_} AS TEXT) AS alias;

-- missingAlias(): { value: Nullable<string> }
SELECT CAST(${_.missing[0]["id"]} AS TEXT) AS value;
