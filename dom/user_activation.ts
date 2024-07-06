// Imports
import { type _UserActivation, illegal, type internal } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/UserActivation */
export class UserActivation implements _UserActivation {
  constructor(_?: { [internal]?: boolean }) {
    illegal(arguments)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/UserActivation/isActive
  // Note: forced as no user interaction can occur
  get isActive(): boolean {
    return false
  }

  set isActive(_: boolean) {
    return
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/UserActivation/hasBeenActive
  // Note: forced as no user interaction can occur
  get hasBeenActive(): boolean {
    return false
  }

  set hasBeenActive(_: boolean) {
    return
  }
}
