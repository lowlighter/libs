import { expect } from "@libs/testing/expect"
import {
  BadRequestError,
  ConflictError,
  ContentTooLargeError,
  FailedDependencyError,
  ForbiddenError,
  GoneError,
  HttpError,
  InsufficientStorageError,
  InternalServerError,
  LockedError,
  MethodNotAllowedError,
  NotAcceptableError,
  NotFoundError,
  NotImplementedError,
  PaymentRequiredError,
  TeapotError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
} from "./http.ts"

Deno.test("HttpError.toResponse() returns a Response object with the correct status code and content type", () => {
  const error = new HttpError()
  expect(error.toResponse().status).toBe(500)
  expect(error.toResponse(new Request("https://example.com", { headers: { "Accept": "text/plain" } })).headers.get("Content-Type")).toBe("text/plain")
  expect(error.toResponse(new Request("https://example.com", { headers: { "Accept": "text/html" } })).headers.get("Content-Type")).toBe("text/html")
  expect(error.toResponse(new Request("https://example.com", { headers: { "Accept": "application/json" } })).headers.get("Content-Type")).toBe("application/json")
})

Deno.test("HttpError.toJSON() returns a JSON object with the correct error details", () => {
  expect(new HttpError().toJSON()).toEqual({
    error: {
      name: "Internal Server Error",
      code: 500,
    },
  })
  expect(new HttpError("Test").toJSON()).toEqual({
    error: {
      name: "Internal Server Error",
      code: 500,
      details: "Test",
    },
  })
})

Deno.test("BadRequestError has the correct status code", () => expect(new BadRequestError().code).toBe(400))
Deno.test("UnauthorizedError has the correct status code", () => expect(new UnauthorizedError().code).toBe(401))
Deno.test("PaymentRequiredError has the correct status code", () => expect(new PaymentRequiredError().code).toBe(402))
Deno.test("ForbiddenError has the correct status code", () => expect(new ForbiddenError().code).toBe(403))
Deno.test("NotFoundError has the correct status code", () => expect(new NotFoundError().code).toBe(404))
Deno.test("MethodNotAllowedError has the correct status code", () => expect(new MethodNotAllowedError().code).toBe(405))
Deno.test("NotAcceptableError has the correct status code", () => expect(new NotAcceptableError().code).toBe(406))
Deno.test("ConflictError has the correct status code", () => expect(new ConflictError().code).toBe(409))
Deno.test("GoneError has the correct status code", () => expect(new GoneError().code).toBe(410))
Deno.test("ContentTooLargeError has the correct status code", () => expect(new ContentTooLargeError().code).toBe(413))
Deno.test("UnsupportedMediaTypeError has the correct status code", () => expect(new UnsupportedMediaTypeError().code).toBe(415))
Deno.test("TeapotError has the correct status code", () => expect(new TeapotError().code).toBe(418))
Deno.test("UnprocessableEntityError has the correct status code", () => expect(new UnprocessableEntityError().code).toBe(422))
Deno.test("LockedError has the correct status code", () => expect(new LockedError().code).toBe(423))
Deno.test("FailedDependencyError has the correct status code", () => expect(new FailedDependencyError().code).toBe(424))
Deno.test("TooManyRequestsError has the correct status code", () => expect(new TooManyRequestsError().code).toBe(429))
Deno.test("InternalServerError has the correct status code", () => expect(new InternalServerError().code).toBe(500))
Deno.test("NotImplementedError has the correct status code", () => expect(new NotImplementedError().code).toBe(501))
Deno.test("InsufficientStorageError has the correct status code", () => expect(new InsufficientStorageError().code).toBe(507))
