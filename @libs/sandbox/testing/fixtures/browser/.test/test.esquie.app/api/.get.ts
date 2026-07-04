import { mock } from "../../../../../mock.ts"

export default mock((_, request) => ({
  body: {
    method: request.method,
    foo: "bar",
  },
}))
