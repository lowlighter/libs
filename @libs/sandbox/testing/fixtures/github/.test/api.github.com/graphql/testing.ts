import { faker, is, mock } from "../../../../../mock.ts"

export default mock({ owner: is.string(), repo: is.string() }, () => ({
  body: {
    data: {
      repository: {
        issue: {
          title: faker.lorem.sentence(),
        },
      },
    },
  },
}))
