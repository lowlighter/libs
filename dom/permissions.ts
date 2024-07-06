// Imports
import type { Nullable, rw } from "@libs/typing"
import { type _Permissions, type _PermissionsStatus, construct, illegalConstructor } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query */
export class Permissions implements _Permissions {
  constructor(_?: typeof construct) {
    illegalConstructor(arguments)
  }

  readonly #state = {} as Record<string, PermissionState>

  readonly #permissions = new Map<string, PermissionsStatus>()

  // deno-lint-ignore require-await
  async query({ name }: PermissionDescriptor): Promise<PermissionsStatus> {
    if (!name) {
      throw new TypeError(`'${name}' (value of 'name' member of PermissionDescriptor) is not a valid value for enumeration PermissionName.`)
    }
    if (!this.#permissions.has(name)) {
      this.#permissions.set(name, new PermissionsStatus(construct, name, "granted"))
    }
    const permission = this.#permissions.get(name)!
    if (this.#state[name]) {
      permission[construct].state(this.#state[name])
    }
    return permission
  }

  get [construct](): { state: Record<string, PermissionState> } {
    return {
      state: this.#state,
    }
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus */
export class PermissionsStatus extends EventTarget implements _PermissionsStatus {
  constructor(_?: typeof construct, name?: PermissionsStatus["name"], state?: PermissionState) {
    illegalConstructor(arguments)
    super()
    this.#name = name!
    this.#state = state!
  }

  readonly #name

  get name(): string {
    return this.#name
  }

  set name(_: string) {
    return
  }

  readonly #state

  get state(): PermissionState {
    return this.#state
  }

  set state(_: PermissionState) {
    return
  }

  get [construct](): { state: (state: PermissionsStatus["state"]) => void } {
    return {
      state: (state: PermissionsStatus["state"]) => {
        const changed = this.#state !== state
        ;(this as rw).#state = state
        if (changed) {
          const event = new Event("change")
          this.onchange?.call(this, event)
          this.dispatchEvent(event)
        }
      },
    }
  }

  // deno-lint-ignore no-explicit-any
  onchange = null as Nullable<(this: _PermissionsStatus, ev: Event) => any>
}
