-- @import { Status as State, Label } from "./values.ts"
-- @import { State as Reexported, Alias } from "./exports.ts"

-- values(value: number): {disabled: State; enabled: State; mask: State; quoted: string; path: string; empty: string; injection: string; multiline: string; value: number}
SELECT #{State.Disabled} AS disabled, #{State.Enabled} AS enabled, #{State.Mask} AS mask,
  #{Label.Quoted} AS quoted, #{ Label.Path } AS path, #{Label.Empty} AS empty,
  #{Label.Injection} AS injection, #{Label.Multiline} AS multiline, ${value} AS value;

-- repeated(value: State): {first: State; second: State; value: State}
SELECT #{State.Enabled} AS first, #{State.Enabled} AS second, ${value} AS value;

-- quoted(): {literal: string; identifier: string}
SELECT '#{Missing.Member}' AS literal, 'identifier' AS "identifier" /* #{Missing.Member} */;
-- #{Missing.Member}

-- backends(value: number): {value: number; state: State}
-- <sqlite>
SELECT ${value} AS value, #{State.Disabled} AS state;
-- </sqlite>
-- <postgres>
SELECT ${value}::integer AS value, #{State.Mask} AS state;
-- </postgres>

-- reexported(): {state: Reexported; alias: Alias}
SELECT #{Reexported.Mask} AS state, #{Alias.Active} AS alias;
