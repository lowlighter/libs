-- @import type { Greeting } from "./example.ts"

-- hello(name: string): Greeting
SELECT 'Hello, ' || ${1} AS message;

-- helloText(name: string): Greeting
-- #trim()
-- @message(): string
SELECT 'Hello, ' || ${name} AS message;
