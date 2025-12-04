import type { testing } from "@libs/testing"
import { expect, test } from "@libs/testing"
import { env } from "./env.ts"

for (
  const { name, options, value, set = "foo" } of [
    // Basic usage
    { name: "LIBS_TEST_ENV", value: "foo" },
    { name: "LIBS_TEST_ENV_UNDEFINED", value: "" },
    { name: "LIBS_TEST_ENV_FORBIDDEN", value: "" },
    // With default value
    { name: "LIBS_TEST_ENV", options: { default: "bar" }, value: "foo" },
    { name: "LIBS_TEST_ENV_UNDEFINED", options: { default: "bar" }, value: "bar" },
    { name: "LIBS_TEST_ENV_FORBIDDEN", options: { default: "bar" }, value: "bar" },
    // Truthy values
    { name: "LIBS_TEST_ENV", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "1", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "true", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "True", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "TRUE", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "y", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "Y", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "yes", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "Yes", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "YES", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "on", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "On", options: { boolean: true }, value: true },
    { name: "LIBS_TEST_ENV", set: "ON", options: { boolean: true }, value: true },
    // Falsy values
    { name: "LIBS_TEST_ENV", set: "", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "0", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "false", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "False", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "FALSE", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "n", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "N", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "no", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "NO", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "NO", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "off", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "Off", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV", set: "OFF", options: { boolean: true }, value: false },
    // Undefined or forbidden env with boolean
    { name: "LIBS_TEST_ENV_UNDEFINED", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV_FORBIDDEN", options: { boolean: true }, value: false },
    { name: "LIBS_TEST_ENV_UNDEFINED", options: { boolean: true, default: "y" }, value: true },
    { name: "LIBS_TEST_ENV_FORBIDDEN", options: { boolean: true, default: "y" }, value: true },
  ]
) {
  test(`\`env(${name}, ${JSON.stringify(options)})\` with \`LIBS_TEST_ENV=${set}\` is ${value}`, () => {
    const Deno = globalThis.Deno
    try {
      Deno.env.set("LIBS_TEST_ENV", set)
      expect(env(name, options as testing)).toBe(value)
    } finally {
      Deno.env.delete("LIBS_TEST_ENV")
    }
  }, { permissions: { env: ["LIBS_TEST_ENV", "LIBS_TEST_ENV_UNDEFINED"] } })
}

test("`get()` handles errors gracefully", () => {
  const Deno = globalThis.Deno
  try {
    delete (globalThis as testing).Deno
    expect(env("LIBS_TEST_ENV_UNDEFINED")).toBe("")
  } finally {
    Object.assign(globalThis, { Deno })
  }
}, { permissions: { env: ["LIBS_TEST_ENV_UNDEFINED"] } })
