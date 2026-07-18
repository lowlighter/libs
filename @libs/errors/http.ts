// Imports
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"
import { accepts } from "@std/http/negotiation"

/** A generic HTTP error. */
export class HttpError extends Error {
  /** The HTTP status code associated with this error. */
  readonly code = STATUS_CODE.InternalServerError as (typeof STATUS_CODE)[keyof typeof STATUS_CODE]

  /** Convert this error to a Response object. */
  toResponse(request?: Request): Response {
    const [accepted] = request ? accepts(request) : ["*/*"]
    switch (accepted) {
      case "application/json":
        return new Response(JSON.stringify(this), { status: this.code, headers: { "Content-Type": "application/json" } })
      case "text/html":
        return new Response((this.constructor as typeof HttpError).html.replace("{{code}}", this.code.toString()).replace("{{name}}", STATUS_TEXT[this.code]).replace("{{message}}", this.message), { status: this.code, headers: { "Content-Type": "text/html" } })
      case "text/plain":
      default:
        return new Response(this.message, { status: this.code, headers: { "Content-Type": "text/plain" } })
    }
  }

  /** Convert this error to a JSON object. */
  toJSON(): Record<string, unknown> {
    return {
      error: {
        name: STATUS_TEXT[this.code],
        code: this.code,
        ...(this.message ? { details: this.message } : {}),
      },
    }
  }

  /** The HTML template for this error. */
  static html = `<!DOCTYPE html><html><head><title>{{code}} {{name}}</title></head><body><h1>{{code}} {{name}}</h1><p>{{message}}</p></body></html>`
}

/** A 400 Bad Request error. */
export class BadRequestError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.BadRequest
}

/** A 401 Unauthorized error. */
export class UnauthorizedError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Unauthorized
}

/** A 402 Payment Required error. */
export class PaymentRequiredError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.PaymentRequired
}

/** A 403 Forbidden error. */
export class ForbiddenError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Forbidden
}

/** A 404 Not Found error. */
export class NotFoundError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.NotFound
}

/** A 405 Method Not Allowed error. */
export class MethodNotAllowedError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.MethodNotAllowed
}

/** A 406 Not Acceptable error. */
export class NotAcceptableError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.NotAcceptable
}

/** A 409 Conflict error. */
export class ConflictError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Conflict
}

/** A 410 Gone error. */
export class GoneError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Gone
}

/** A 413 Content Too Large error. */
export class ContentTooLargeError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.ContentTooLarge
}

/** A 415 Unsupported Media Type error. */
export class UnsupportedMediaTypeError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.UnsupportedMediaType
}

/** A 418 I'm a Teapot error. */
export class TeapotError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Teapot
}

/** A 422 Unprocessable Entity error. */
export class UnprocessableEntityError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.UnprocessableEntity
}

/** A 423 Locked error. */
export class LockedError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.Locked
}

/** A 424 Failed Dependency error. */
export class FailedDependencyError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.FailedDependency
}

/** A 429 Too Many Requests error. */
export class TooManyRequestsError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.TooManyRequests
}

/** A 500 Internal Server Error. */
export class InternalServerError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.InternalServerError
}

/** A 501 Not Implemented error. */
export class NotImplementedError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.NotImplemented
}

/** A 507 Insufficient Storage error. */
export class InsufficientStorageError extends HttpError {
  /** The HTTP status code associated with this error. */
  override readonly code = STATUS_CODE.InsufficientStorage
}
