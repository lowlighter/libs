/** A listener registered on an {@linkcode Emitter}. */
export type Listener<T> = (event: T) => void

/**
 * A minimal synchronous event emitter over a single event union type.
 *
 * ```ts ignore
 * const emitter = new Emitter<{ type: "move" } | { type: "zoom" }>()
 * const off = emitter.on((event) => console.log(event.type))
 * emitter.emit({ type: "move" })
 * off()
 * ```
 */
export class Emitter<T> {
  /** The registered listeners. */
  readonly #listeners = new Set<Listener<T>>()

  /** Registers a listener and returns its unsubscriber. */
  on(listener: Listener<T>): () => void {
    this.#listeners.add(listener)
    return () => this.off(listener)
  }

  /** Unregisters a listener. */
  off(listener: Listener<T>): void {
    this.#listeners.delete(listener)
  }

  /** Emits an event to every registered listener. */
  emit(event: T): void {
    for (const listener of this.#listeners)
      listener(event)
  }

  /** Removes every registered listener. */
  clear(): void {
    this.#listeners.clear()
  }
}
