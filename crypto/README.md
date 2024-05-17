# 🧮 Crypto utilities

[![JSR](https://jsr.io/badges/@libs/crypto)](https://jsr.io/@libs/crypto) [![JSR Score](https://jsr.io/badges/@libs/crypto/score)](https://jsr.io/@libs/crypto)

## 🔑 Time-based One-Time Password (TOTP)

- [`🦕 Playground`](https://dash.deno.com/playground/libs-totp)
- [`📚 Documentation`](https://jsr.io/@libs/crypto/doc/totp/~)

### ✨ Features

- Issue a new TOTP secret with metadata (issuer, account, image, etc.)
- No external dependencies
- Lightweight

### 📜 License and credits

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

This library is based on the well-written article of [@rajat-sr](https://github.com/rajat-sr) on [hackernoon](https://hackernoon.com) :

- [How To Implement Google Authenticator Two Factor Auth in JavaScript](https://hackernoon.com/how-to-implement-google-authenticator-two-factor-auth-in-javascript-091wy3vh3)

## 🔐 Symmetric encryption (using AES-GCM 256 with a PBKDF2 derived key)

- [`🦕 Playground`](https://dash.deno.com/playground/libs-encryption)
- [`📚 Documentation`](https://jsr.io/@libs/crypto/doc/encryption/~)

### ✨ Features

- Use native [`Web Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) APIs
- Use [`AES-GCM 256-bits`](https://en.wikipedia.org/wiki/Galois/Counter_Mode) with [`PBKDF2`](https://en.wikipedia.org/wiki/PBKDF2) derived key to encrypt and decrypt messages
  - Encrypted messages are different each time thanks to [initialization vector](https://en.wikipedia.org/wiki/Initialization_vector)
  - The derived key from a given `seed`/`password` are always the same
- Added functionalities which also introduce additional entropy:
  - With [SHA-256](https://en.wikipedia.org/wiki/SHA-2) to guarantee integrity
  - With stored size to guarantee integrity _(for messages with length < 255)_
  - With padding to force length be `256` or `512` bytes and obfuscate the original size _(can be disabled using `0` as value)_

### 📜 License and credits

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

> [!CAUTION]
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND
>
> The author is not responsible for any damage that could be caused by the use of this library. It is your responsibility to use it properly and to understand the security implications of the choices you make.
