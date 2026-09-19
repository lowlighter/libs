-- @import type { User } from "../test_queries/types.ts"

-- greet(name: string): {message: string}
-- #normalize("trim")
-- @censor(): string
SELECT ${name} AS message;

-- chained(name: string): {message: string}
-- #first()
-- #second()
-- @observe(name)
SELECT ${1} AS message;

-- beforeDelete(id: string): User
-- #before("DELETE")
-- @after()
DELETE FROM users WHERE id=${1} RETURNING *;

-- rewrite({id: key}: {id: string}, suffix = "!", ...extra: string[]): {message: string}
-- #replace()
SELECT ${key} || ${suffix} || ${3[0]} AS message;

-- plain(name: string): {message: string}
-- #prepare()
SELECT ${name} AS message;

-- mutate(input: {nested: {value: string}; values: string[]; created: Date}): {message: string}
-- #mutate(input)
-- #inspect()
SELECT ${1.nested.value} || ${1.values[0]} AS message;
