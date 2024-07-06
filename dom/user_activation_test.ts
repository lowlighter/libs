import { expect, test } from "@libs/testing"
import { construct } from "./_.ts"
import { UserActivation } from "./user_activation.ts"

test()(`UserActivation.constructor() is illegal`, () => {
  expect(() => new UserActivation()).toThrow(TypeError)
  new UserActivation(construct)
})

test()(`UserActivation.hasBeenActive is supported`, () => {
  const activation = new UserActivation(construct)
  expect(activation).toHaveProperty("hasBeenActive", false)
  expect(activation).toBeImmutable("hasBeenActive")
})

test()(`UserActivation.isActive is supported`, () => {
  const activation = new UserActivation(construct)
  expect(activation).toHaveProperty("isActive", false)
  expect(activation).toBeImmutable("isActive")
})
