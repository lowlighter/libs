import { expect } from "@libs/testing"
import { noop } from "./noop.ts"

Deno.test("`noop()` does nothing", () => expect(noop()).toBeUndefined())
