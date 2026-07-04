import { mock } from "../../../../../../mock.ts"

export default mock((_, request) => ({
  body: {
    fallback: true,
    method: request.method,
    url: import.meta.url,
  },
}))
