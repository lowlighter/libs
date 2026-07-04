import { mock } from "../../../../../mock.ts"

export default mock({
  headers: {
    "content-type": "application/json; charset=utf-8",
    "x-github-api-version-selected": "2022-11-28",
  },
  body: {
    "resources": {
      "core": { "limit": 60, "remaining": 60, "reset": Math.floor(Date.now() / 1000), "used": 0, "resource": "core" },
      "graphql": { "limit": 0, "remaining": 0, "reset": Math.floor(Date.now() / 1000), "used": 0, "resource": "graphql" },
      "integration_manifest": { "limit": 5000, "remaining": 5000, "reset": Math.floor(Date.now() / 1000), "used": 0, "resource": "integration_manifest" },
      "search": { "limit": 10, "remaining": 10, "reset": 1748144049, "used": 0, "resource": "search" },
    },
    "rate": { "limit": 60, "remaining": 60, "reset": Math.floor(Date.now() / 1000), "used": 0, "resource": "core" },
  },
})
