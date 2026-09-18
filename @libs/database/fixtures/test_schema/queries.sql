-- @import { User, Summary } from "./models.ts"

-- insert(user: User): User
INSERT INTO schema_users(id, team, name, active, created, settings, tags, flags, payload, count)
VALUES (${user.id}, ${user.team}, ${user.name}, ${user.active}, ${user.created}, ${user.settings}, ${user.tags}, ${user.flags}, ${user.payload}, ${user.count}) RETURNING *;

-- find(id: User["id"]): Nullable<User>
SELECT * FROM schema_users WHERE id=${1};

-- renamed(id: User["id"]): Omit<User, "id"> & {my_id: User["id"]}
SELECT id AS my_id, team, name, active, created, settings, tags, flags, payload, count FROM schema_users WHERE id=${1};

-- partial(id: User["id"]): Partial<Pick<User, "name" | "active">>
SELECT name, active FROM schema_users WHERE id=${1};

-- update(id: User["id"], name: User["name"]): User
-- #normalize()
-- @summarize(): Summary
UPDATE schema_users SET name=${name} WHERE id=${id} RETURNING *;

-- destructured({settings: {theme}, id}: Pick<User, "settings" | "id">): {id: User["id"]; theme: User["settings"]["theme"]}
SELECT CAST(${id} AS TEXT) AS id, CAST(${theme} AS TEXT) AS theme;

-- list(): User[]
SELECT * FROM schema_users ORDER BY id;

-- generic<T extends User>(input: T): T
SELECT *, 'kept' AS extra FROM schema_users WHERE id=${input.id};

-- restObject({id, ...rest}: User): User
SELECT * FROM schema_users WHERE id=${id} AND active=${rest.active};

-- readonlyModel(input: Readonly<User>): Readonly<User>
SELECT * FROM schema_users WHERE id=${input.id};
