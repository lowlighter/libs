import { test } from "./_test.ts"
import { test as stub } from "./_stub.ts"
import { expect } from "./mod.ts"

test()("test() stub throws error", () => expect(stub).toThrow())
