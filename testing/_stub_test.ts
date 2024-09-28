import { test } from "./_testing.ts"
import { test as stub } from "./_stub.ts"
import { expect } from "./mod.ts"

test()("`test()` stub throws error", () => expect(stub).toThrow())
