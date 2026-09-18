// Imports
import Query from "./queries.gen.ts"
import type { Hooks } from "./queries.gen.ts"

/** Fixture hooks checked against generated declarations. */
export const hooks: Hooks = {
  pre: {},
  post: {
    /** Record an audit event without replacing the previous result. */
    async audit({ result: user }, event) {
      await this.query(Query.recordAudit(user.id, String(event)))
    },
    /** Replace a user with its identifier. */
    identifier({ result: user }) {
      return Promise.resolve(user.id)
    },
    /** Replace a greeting with its text. */
    message({ result: greeting }) {
      return Promise.resolve(greeting.message)
    },
  },
}
