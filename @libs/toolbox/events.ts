
export class CustomEventTarget<T = unknown> {
  /** Registered listeners mapped to their native wrappers. */
  #listeners = new Map<string, Map<Listener<T>, Listener<T>>>()

  /** Registers a listener for the specified event. */
  on(event: string, listener: Listener<T>, { once = false } = {}): void {
    const listeners = this.#listeners.getOrInsert(event, new Map())
    if (!listeners.has(listener))
      listeners.set(listener, once ? ((data:T) => listener(data)) : listener)
  }

  /** Unregisters all listeners for the specified event. */
  off(event:string): void
  /** Unregisters a listener for the specified event. */
  off(event: string, listener: Listener<T>): void
  off(event: string, listener?: Listener<T>) {
    const listeners = this.#listeners.get(event)
    if (!listener) {
      listeners?.clear()
      return
    }
    if (listeners?.has(listener))
      listeners.delete(listener)
  }

  /** Emits an event with the specified data. */
  emit(event: string, data: T): void {
    const listeners = this.#listeners.get(event)
    if (!listeners)
      return
    for (const [listener, wrapper] of listeners) {
      wrapper(data)
      if (wrapper !== listener)
        listeners.delete(listener)
    }
  }
}

/** A listener invoked with the emitted event data. */
export type Listener<T = unknown> = (data: T) => void
