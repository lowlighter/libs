import { expect, fn, test, type testing } from "@libs/testing"
import { construct } from "./_.ts"
import { Permissions, PermissionsStatus } from "./permissions.ts"

test()(`Permissions.constructor() is illegal`, () => {
  expect(() => new Permissions()).toThrow(TypeError)
  new Permissions(construct)
})

test()(`Permissions.query() resolves to PermissionsStatus`, async () => {
  const permissions = new Permissions(construct)
  const status = permissions.query({ name: "foo" as testing })
  await expect(status).resolves.toBeInstanceOf(PermissionsStatus)
  await expect(permissions.query({ name: "foo" as testing })).resolves.toBe(await status)
  await expect(permissions.query({ name: "" as testing })).rejects.toThrow(TypeError)
})

test()(`Permissions[constructs] allows to override permissions status`, async () => {
  const permissions = new Permissions(construct)
  let status = await permissions.query({ name: "foo" as testing })
  expect(status.state).toBe("granted")
  permissions[construct].state["foo"] = "denied"
  status = await permissions.query({ name: "foo" as testing })
  expect(status.state).toBe("denied")
})

test()(`PermissionsStatus.constructor() is illegal`, () => {
  expect(() => new PermissionsStatus()).toThrow(TypeError)
  new PermissionsStatus(construct)
})

test()(`PermissionsStatus.name is supported`, () => {
  const status = new PermissionsStatus(construct, "foo", "granted")
  expect(status).toHaveProperty("name", "foo")
  expect(status).toBeImmutable("name")
})

test()(`PermissionsStatus.state is supported`, () => {
  const status = new PermissionsStatus(construct, "foo", "granted")
  expect(status).toHaveProperty("state", "granted")
  expect(status).toBeImmutable("state")
})

test()(`PermissionsStatus.onchange is supported`, () => {
  const status = new PermissionsStatus(construct, "foo", "prompt")
  const listeners = { onchange: fn(), event: fn() } as testing
  status.onchange = listeners.onchange
  status.addEventListener("change", listeners.event)
  status[construct].state("granted")
  expect(listeners.onchange).toHaveBeenCalledTimes(1)
  expect(listeners.event).toHaveBeenCalledTimes(1)
})
