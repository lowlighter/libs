import { expect, test } from "@libs/testing"
import { internal } from "./_.ts"
import { UserActivation } from "./user_activation.ts"

test(`UserActivation.constructor() is illegal`, () => {
  expect(() => new UserActivation()).toThrow(TypeError)
  new UserActivation({ [internal]: true })
})

test(`UserActivation.isActive is supported`, () => {
  const activation = new UserActivation({ [internal]: true })
  expect(activation).toHaveProperty("isActive", false)
  expect(activation).toHaveImmutableProperty("isActive")
})

test(`UserActivation.hasBeenActive is supported`, () => {
  const activation = new UserActivation({ [internal]: true })
  expect(activation).toHaveProperty("hasBeenActive", false)
  expect(activation).toHaveImmutableProperty("hasBeenActive")
})
