// Imports
// deno-lint-ignore-file no-external-import
import type { SQLInputValue, StatementSync } from "node:sqlite"
import postgres from "postgres"
import { DatabaseSync } from "node:sqlite"
import { AsyncLocalStorage } from "node:async_hooks"

/**
 * A SQLite or PostgreSQL database with connection-local statement caching.
 *
 * If the database URL is a `postgres://` or `postgresql://` URL, PostgreSQL is used.
 * Otherwise, SQLite is used (`:memory:` is also supported).
 */
export class Database implements AsyncDisposable {
  /** Constructor. */
  constructor(url: string = ":memory:") {
    if (/^postgres(?:ql)?:\/\//i.test(url))
      this.#postgres = postgres(url)
    else
      this.#sqlite = new DatabaseSync(url)
  }

  /** SQLite database instance, if using SQLite. */
  readonly #sqlite?: DatabaseSync

  /** PostgreSQL database instance, if using PostgreSQL. */
  readonly #postgres?: ReturnType<typeof postgres>

  /** Database backend used by generated queries. */
  get type(): Type {
    return this.#sqlite ? Type.SQLite : Type.PostgreSQL
  }

  /** Whether the database has been closed. */
  #closed = false

  /** Reject operations after the database starts closing. */
  #assertOpen(): void {
    if (this.#closed)
      throw new Error("Database is closed")
  }

  /** Registered pre and post query hooks. */
  readonly #hooks = new Map<string, (...args: never[]) => unknown>()

  /** Register a pre or post query hook. */
  register<A extends unknown[], R>(name: string, hook: (this: Database, ...args: A) => R | Promise<R>): void {
    this.#assertOpen()
    this.#hooks.set(name, hook as (...args: never[]) => unknown)
  }

  /** Async context for the current operation. */
  readonly #context = new AsyncLocalStorage<context>()

  /** Queue of pending operations. */
  #queue = Promise.resolve()

  /** Serialize independent operations while allowing awaited hook re-entry. */
  async #schedule<T>(callback: () => Promise<T>): Promise<T> {
    const current = this.#context.getStore()
    const parent = current?.active ? current : undefined
    if (!parent)
      this.#assertOpen()
    const operation = (parent?.queue ?? this.#queue).then(async () => {
      const context: context = { active: true, transaction: parent?.transaction ?? false, connection: parent?.connection, queue: Promise.resolve() }
      try {
        return await this.#context.run(context, callback)
      } finally {
        await context.queue
        context.active = false
      }
    })
    const settled = operation.then(() => {}, () => {})
    if (parent)
      parent.queue = settled
    else
      this.#queue = settled
    return await operation
  }

  /** Execute raw SQL without returning rows. */
  run(statement: string): Promise<void> {
    return this.#schedule(async () => {
      if (this.#sqlite)
        this.#sqlite.exec(statement)
      else
        await (this.#context.getStore()?.connection ?? this.#postgres)?.unsafe(statement).simple()
    })
  }

  /** Cached prepared statements. */
  readonly #statements = new Map<string, Statement<unknown>>()

  /** Prepare a SQL statement for repeated execution. */
  prepare<T = Record<string, unknown>>(statement: string): Statement<T> {
    if (!this.#context.getStore()?.active)
      this.#assertOpen()
    const cached = this.#statements.get(statement)
    if (cached)
      return cached as Statement<T>
    let native = undefined as StatementSync | undefined
    const prepared: Statement<T> = {
      /** Bind parameters and return the declared row type. */
      run: (...parameters) =>
        this.#schedule(async () => {
          if (this.#sqlite) {
            native ??= this.#sqlite.prepare(statement)
            native.setReadBigInts(true)
            return native.all(...parameters.map(sqlite)).map((row) =>
              Object.fromEntries(Object.entries(row).map(([key, value]) => [key, typeof value === "bigint" && value >= BigInt(Number.MIN_SAFE_INTEGER) && value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : value]))
            ) as unknown as T[]
          }
          return Array.from(await (this.#context.getStore()?.connection ?? this.#postgres)?.unsafe(statement, parameters as never[], { prepare: true }) ?? []) as T[]
        }),
    }
    this.#statements.set(statement, prepared)
    return prepared
  }

  /** Execute a deferred query without a context. */
  query<T, A extends unknown[]>(query: Query<T, T, A>): Promise<T>
  /** Execute a query whose post-hooks change its result type. */
  query<T, R, A extends unknown[]>(query: Query<T, R, A>): Promise<T>
  /** Provide typed context to query hooks. */
  query<C extends Record<string, unknown>, T, A extends unknown[]>(context: C, query: Query<T, T, A>): Promise<T>
  /** Execute transforming hooks with a typed context. */
  query<C extends Record<string, unknown>, T, R, A extends unknown[]>(context: C, query: Query<T, R, A>): Promise<T>
  query<C extends Record<string, unknown>, T, R, A extends unknown[]>(value: C | Query<T, R, A>, query?: Query<T, R, A>): Promise<T> {
    const metadata: Record<string, unknown> = query === undefined ? {} : value as C
    let operation = query ?? value as Query<T, R, A>
    return this.#schedule(async () => {
      // Isolate caller-owned inputs while retaining the supplied context reference
      operation = operation.bind(structuredClone(operation.inputs))
      const context = this.#context.getStore() as context
      // Resolve registrations before allowing hooks or SQL to have side effects
      for (const hook of [...operation.hooks?.pre ?? [], ...operation.hooks?.post ?? []])
        this.#hook(hook.name)
      for (let index = 0; index < (operation.hooks?.pre?.length ?? 0); index++) {
        const hook = operation.hooks!.pre![index]
        const next = await Reflect.apply(this.#hook(hook.name), this, [{ context: metadata }, ...operation.inputs, ...hook.args])
        if (next !== undefined) {
          if (!Array.isArray(next))
            throw new TypeError(`Pre-hook "${hook.name}" must return an argument tuple or undefined`)
          operation = operation.bind(next as A)
        }
      }
      // Validate hook-transformed inputs before opening a top-level transaction
      if (operation.precheck)
        operation = await operation.precheck()
      const hooks = (operation.hooks?.post ?? []).map(({ name, args }) => ({ hook: this.#hook(name), args }))
      // Execute SQL and apply post-hooks
      const execute = async () => {
        try {
          let result: unknown = await operation.execute(this, metadata)
          for (const { hook, args } of hooks) {
            const next = await Reflect.apply(hook, this, [{ context: metadata, result }, ...args])
            if (next !== undefined)
              result = next
          }
          return operation.postcheck ? await operation.postcheck(result) : result as T
        } finally {
          // Drain sibling operations before committing or rolling back their transaction
          await context.queue
        }
      }
      if ((!hooks.length && !operation.postcheck) || context.transaction)
        return await execute()
      context.transaction = true
      try {
        if (this.#postgres) {
          return await this.#postgres.begin(async (connection) => {
            context.connection = connection
            return await execute()
          }) as T
        }
        const database = this.#sqlite as DatabaseSync
        database.exec("BEGIN")
        try {
          const result = await execute()
          database.exec("COMMIT")
          return result
        } catch (error) {
          database.exec("ROLLBACK")
          throw error
        }
      } finally {
        context.transaction = false
        context.connection = undefined
      }
    })
  }

  /** Look up a required hook before executing its query. */
  #hook(name: string): (...args: never[]) => unknown {
    const hook = this.#hooks.get(name)
    if (!hook)
      throw new ReferenceError(`Database hook "${name}" is not registered`)
    return hook
  }

  /** Internal state for closing the database. */
  #closing?: Promise<void>

  /** Drain accepted operations and close the connection once. */
  close(): Promise<void> {
    if (this.#context.getStore()?.active)
      return Promise.reject(new Error("Cannot close a database within an active query or hook"))
    if (!this.#closing) {
      this.#closed = true
      this.#closing = this.#queue.then(async () => {
        this.#statements.clear()
        this.#hooks.clear()
        this.#sqlite?.close()
        await this.#postgres?.end()
        this.#context.disable()
      })
    }
    return this.#closing
  }

  /** Release the database when leaving an await using scope. */
  async [Symbol.asyncDispose](): Promise<void> {
    await this.close()
  }
}

/** Supported database backends. */
export enum Type {
  /** SQLite. */
  SQLite,
  /** PostgreSQL. */
  PostgreSQL,
}

/** An awaited post-hook receiving stable context and result fields. */
export type PostHook<T, R, C extends Record<string, unknown> = Record<string, unknown>> = (this: Database, event: { context: C; result: T }, ...args: unknown[]) => R | void | Promise<R | void>

/** An awaited pre-hook receiving a stable context object before its inputs. */
export type Hook<A extends unknown[], R, C extends Record<string, unknown> = Record<string, unknown>> = (this: Database, event: { context: C }, ...args: [...inputs: A, ...extra: unknown[]]) => R | void | Promise<R | void>

/** A reusable statement owned by one database. */
export interface Statement<T = Record<string, unknown>> {
  /** Execute statement with bound values and return every matching result row. */
  run(...parameters: unknown[]): Promise<T[]>
}

/** A deferred database operation. */
export interface Query<T, R = T, A extends unknown[] = unknown[]> {
  /** Query inputs before SQL parameter extraction. */
  inputs: A
  /** Rebind transformed inputs without mutating the reusable query. */
  bind(inputs: A): Query<T, R, A>
  /** Execute query against the selected database. */
  execute(database: Database, context: Record<string, unknown>): Promise<R>
  /** Validate final pre-hook inputs and rebuild bindings. */
  precheck?(): Promise<Query<T, R, A>>
  /** Validate the final post-hook result within the active transaction. */
  postcheck?(value: unknown): Promise<T>
  /** Hooks. */
  hooks?: {
    /** Hooks that may replace the query argument tuple. */
    pre?: readonly Invocation[]
    /** Hooks that may replace the query result. */
    post?: readonly Invocation[]
  }
  /** Type-only witness for the final transformed result. */
  result?: [T]
}

/** A hook invocation. */
export interface Invocation<T = unknown, R = unknown> {
  /** Hook name. */
  name: string
  /** Arguments. */
  args: readonly unknown[]
  /** Type-only witness for this hook's input and output. */
  types?: [T, R]
}

/** Context for the current database operation. */
type context = { active: boolean; transaction: boolean; connection?: postgres.TransactionSql; queue: Promise<void> }

/** Normalize input values for SQLite. */
function sqlite(value: unknown): SQLInputValue {
  if ((value === null) || (typeof value === "string") || (typeof value === "number") || (typeof value === "bigint") || (value instanceof Uint8Array))
    return value
  if (typeof value === "boolean")
    return Number(value)
  if (value instanceof Date)
    return value.toISOString()
  throw new TypeError(`Unsupported SQLite parameter ${String(value)}; expected null, string, number, bigint, boolean, Date, or Uint8Array`)
}
