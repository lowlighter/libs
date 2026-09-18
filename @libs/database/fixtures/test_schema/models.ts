// Imports
import { is } from "@libs/database/is"

/** Parent table for referential action checks. */
export const Team = is.table("schema_teams", {
  id: is.int().primary({ identity: true }),
  name: is.string().min(1).unique(),
})

/** Application model with portable storage and constraints. */
export const User = is.table("schema_users", {
  id: is.uuid().primary(),
  team: is.int().nullable().references("schema_teams", "id", { delete: "null" }),
  name: is.regex(/^[A-Z]/).default("Default"),
  active: is.boolean().default(true).index(),
  created: is.date(),
  settings: is.object({ theme: is.enum(["light", "dark"]), dates: is.array(is.date()), count: is.bigint() }),
  tags: is.array(is.string()),
  flags: is.record(is.string(), is.boolean()),
  payload: is.json(),
  count: is.bigint(),
}).index(["created", "active"]).unique(["name", "team"])

/** Post-hook output schema, independent of the SQL row shape. */
export const Summary = is.object({ name: is.string().min(2), active: is.boolean() })

/** Millisecond timestamp for codec fixtures. */
export const Timestamp = is.timestamp()

/** Native numeric enum, including TypeScript's generated reverse mappings. */
export enum Status {
  /** Disabled state. */
  Disabled,
  /** Enabled state. */
  Enabled,
}

/** Native TypeScript enum storage fixture. */
export const State = is.enum(Status)
/** Mixed values remain distinct in text storage. */
export const Mixed = is.enum([1, "1"])
