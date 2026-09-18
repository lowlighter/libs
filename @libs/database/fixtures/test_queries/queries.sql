-- @import type { User } from "./types.ts"

-- hello(name: string): {message: string}
SELECT 'Hello, ' || ${1} AS message;

-- helloText(name: string): {message: string}
-- @message(): string
SELECT 'Hello, ' || ${name} AS message;

-- users(domain = "example.org"): User[]
SELECT * FROM users WHERE domain=${domain} ORDER BY id;

-- user(id: string): Nullable<User>
SELECT * FROM users WHERE id=${1};

-- requiredUser({id: key}: {id: string}): User
SELECT * FROM users WHERE id=${key};

-- deleteUser(id: string): User
-- @audit("USER_DELETE")
-- @identifier(): string
DELETE FROM users WHERE id=${1} RETURNING *;

-- recordAudit(id: string, event: string): void
INSERT INTO audit(user_id, event) VALUES (${1}, ${2});

-- events(): {user_id: string; event: string}[]
SELECT * FROM audit ORDER BY user_id;
