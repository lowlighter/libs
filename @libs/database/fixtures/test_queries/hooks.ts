// Imports
import Query from "./queries.gen.ts"
import type { Hooks } from "./queries.gen.ts"

/** Fixture hooks checked against generated declarations. */
export const hooks: Hooks = {
  pre: {},
  post: {
    /** Record an audit event without replacing the previous result. */
    async audit(user, event) {
      await this.query(Query.recordAudit(user.id, String(event)))
    },
    /** Replace a user with its identifier. */
    identifier(user) {
      return Promise.resolve(user.id)
    },
    /** Replace a greeting with its text. */
    message(greeting) {
      return Promise.resolve(greeting.message)
    },
  },
}
