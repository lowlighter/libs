import { faker, is, mock } from "../../../../../mock.ts"

export default mock({ owner: is.string(), repo: is.string() }, () => ({
  body: {
    data: {
      repository: {
        issues: {
          nodes: [{
            title: faker.lorem.sentence(),
          }],
          pageInfo: {
            hasNextPage: false,
            endCursor: btoa(`cursor:v2:${faker.string.alphanumeric(7)}`),
          },
        },
      },
    },
  },
}))
