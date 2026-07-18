# 🛑 Errors

[![JSR](https://jsr.io/badges/@libs/errors)](https://jsr.io/@libs/errors) [![JSR Score](https://jsr.io/badges/@libs/errors/score)](https://jsr.io/@libs/errors)

A collection of semantic HTTP error classes.

Each error carries its HTTP status code and can be converted to a `Response` (negotiating between JSON, HTML and plain text from the request `Accept` header) or to a JSON object.

- [`📚 Documentation`](https://jsr.io/@libs/errors/doc)

## 📖 Usage

```ts
import { HttpError, InternalServerError, NotFoundError } from "@libs/errors"

Deno.serve((request) => {
  try {
    throw new NotFoundError("no such resource")
  } catch (error) {
    // `toResponse()` picks the best representation based on the request `Accept` header,
    // e.g. `application/json` yields { "error": { "name": "Not Found", "code": 404, "details": "no such resource" } }
    if (error instanceof HttpError)
      return error.toResponse(request)
    return new InternalServerError().toResponse(request)
  }
})
```

## 📜 License

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
