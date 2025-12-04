import { expect, test } from "@libs/testing"
import { noop } from "./noop.ts"

test("`noop()` does nothing", () => expect(noop()).toBeUndefined())
