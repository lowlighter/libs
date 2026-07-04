import { mock, Status } from "../../../../../../../../mock.ts"

export default mock(() => new Response(null, { status: Status.InternalServerError }))
