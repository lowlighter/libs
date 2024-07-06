// Imports
import type { Nullable } from "@libs/typing"
import { type _Permissions, type _PermissionsStatus, dispatch, illegal, internal } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/Permissions */
export class Permissions implements _Permissions {
  constructor(_?: { [internal]?: boolean }) {
    illegal(arguments)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query
  // Note: arbitrary set to "denied" by default
  query({ name }: PermissionDescriptor): Promise<PermissionsStatus> {
    if (!name) {
      return Promise.reject(new TypeError(`'${name}' (value of 'name' member of PermissionDescriptor) is not a valid value for enumeration PermissionName.`))
    }
    const state = this.#state[name] ?? "denied"
    return Promise.resolve(new PermissionsStatus({ [internal]: true, name, state }))
  }

  /** Internal acessor. */
  get [internal](): { state: Record<string, PermissionState> } {
    return {
      state: this.#state,
    }
  }

  /** Custom permissions state that can be set through {@link internal}. */
  readonly #state = {} as Record<string, PermissionState>
}

/** https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus */
export class PermissionsStatus extends EventTarget implements _PermissionsStatus {
  constructor({ name, state } = {} as { [internal]?: boolean; name?: PermissionsStatus["name"]; state?: PermissionState }) {
    illegal(arguments)
    super()
    this.#name = name!
    this.#state = state!
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/name
  get name(): string {
    return this.#name
  }

  set name(_: string) {
    return
  }

  readonly #name

  // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state
  get state(): PermissionState {
    return this.#state
  }

  set state(_: PermissionState) {
    return
  }

  #state

  /** Internal acessor. */
  get [internal](): { state: (state: PermissionsStatus["state"]) => void } {
    return {
      state: (state: PermissionsStatus["state"]) => {
        const changed = this.#state !== state
        this.#state = state
        if (changed) {
          dispatch(this, new Event("change"))
        }
      },
    }
  }

  // deno-lint-ignore no-explicit-any
  onchange = null as Nullable<(this: _PermissionsStatus, event: Event) => any>
}
