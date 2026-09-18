// Imports
import type { is as z } from "@libs/is"
import { decorate, metadata } from "./_metadata.ts"
import type { Metadata, Primary, References, Schema } from "./_metadata.ts"

/** Immutable database modifiers awaiting a matching shared column. */
export class Inheritance {
  #options: Metadata

  /** Store a fresh set of column modifiers. */
  constructor(options: Metadata = {}) {
    this.#options = options
    metadata.set(this, options)
  }

  /** Index the inherited column. */
  index(): Inheritance {
    const options = this.#options
    return new Inheritance({ ...options, indexes: [...options.indexes ?? [], { unique: false }] })
  }

  /** Require uniqueness for the inherited column. */
  unique(): Inheritance {
    const options = this.#options
    return new Inheritance({ ...options, indexes: [...options.indexes ?? [], { unique: true }] })
  }

  /** Declare the inherited column as a primary key. */
  primary(options: Primary = {}): Inheritance {
    return new Inheritance({ ...this.#options, primary: { ...options } })
  }

  /** Reference another table from the inherited column. */
  references(table: string, column: string, options: References = {}): Inheritance {
    return new Inheritance({ ...this.#options, references: { table, column, ...options } })
  }
}

/** Apply deferred modifiers to an isolated copy of a shared schema. */
export function resolve<T extends z.ZodType>(schema: T, value: Inheritance): Schema<T> {
  return decorate(schema.clone(), metadata.get(value))
}
