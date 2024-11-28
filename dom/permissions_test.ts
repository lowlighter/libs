import { expect, fn, test, type testing } from "@libs/testing"
import { internal } from "./_.ts"
import { Permissions, PermissionsStatus } from "./permissions.ts"

test(`Permissions.constructor() is illegal`, () => {
  expect(() => new Permissions()).toThrow(TypeError)
  new Permissions({ [internal]: true })
})

test(`Permissions.query() resolves to PermissionsStatus`, async () => {
  const permissions = new Permissions({ [internal]: true })
  await expect(permissions.query({ name: "" as testing })).rejects.toThrow(TypeError)
  await expect(permissions.query({ name: "foo" as testing })).resolves.toBeInstanceOf(PermissionsStatus)
})

test(`Permissions[constructs] allows to override permissions status`, async () => {
  const permissions = new Permissions({ [internal]: true })
  permissions[internal].state["bar"] = "granted"
  expect((await permissions.query({ name: "foo" as testing })).state).toBeOneOf(["granted", "prompt", "denied"])
  expect((await permissions.query({ name: "bar" as testing })).state).toBe("granted")
})

test(`PermissionsStatus.constructor() is illegal`, () => {
  expect(() => new PermissionsStatus()).toThrow(TypeError)
  new PermissionsStatus({ [internal]: true })
})

test(`PermissionsStatus.name is supported`, () => {
  const status = new PermissionsStatus({ [internal]: true, name: "foo", state: "granted" })
  expect(status).toHaveProperty("name", "foo")
  expect(status).toHaveImmutableProperty("name")
})

test(`PermissionsStatus.state is supported`, () => {
  const status = new PermissionsStatus({ [internal]: true, name: "foo", state: "granted" })
  expect(status).toHaveProperty("state", "granted")
  expect(status).toHaveImmutableProperty("state")
})

test(`PermissionsStatus.onchange is supported`, () => {
  const status = new PermissionsStatus({ [internal]: true, name: "foo", state: "prompt" })
  status.onchange = fn() as testing
  expect(status.onchange).not.toHaveBeenCalled()
  status[internal].state("granted")
  expect(status.onchange).toHaveBeenCalled()
})
