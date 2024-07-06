// Imports
import { type _UserActivation, type construct, illegalConstructor } from "./_.ts"

/** https://developer.mozilla.org/en-US/docs/Web/API/UserActivation */
export class UserActivation implements _UserActivation {
  constructor(_?: typeof construct) {
    illegalConstructor(arguments)
  }

  get hasBeenActive(): boolean {
    return false
  }

  set hasBeenActive(_: boolean) {
    return
  }

  get isActive(): boolean {
    return false
  }

  set isActive(_: boolean) {
    return
  }
}
