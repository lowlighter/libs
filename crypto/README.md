# 🧮 Cryptographic utilities

[![JSR](https://jsr.io/badges/@libs/crypto)](https://jsr.io/@libs/crypto) [![JSR Score](https://jsr.io/badges/@libs/crypto/score)](https://jsr.io/@libs/crypto)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fcrypto?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/crypto) [![Coverage](https://libs-coverage.lecoq.io/crypto/badge.svg)](https://libs-coverage.lecoq.io/crypto)

## 🔑 Time-based One-Time Password (TOTP)

Issue a new TOTP secret with metadata (issuer, account, image, etc.).

- [`🦕 Playground`](https://libs.lecoq.io/crypto/totp)
- [`📚 Documentation`](https://jsr.io/@libs/crypto/doc/totp/~)

### ✨ Features

- Has no external dependencies.
- Is lightweight.

This library is based on the well-written article of [@rajat-sr](https://github.com/rajat-sr) [How To Implement Google Authenticator Two Factor Auth in JavaScript](https://hackernoon.com/how-to-implement-google-authenticator-two-factor-auth-in-javascript-091wy3vh3)

## 🔐 Symmetric encryption (using AES-GCM 256 with a PBKDF2 derived key)

- [`🦕 Playground`](https://libs.lecoq.io/crypto/encryption)
- [`📚 Documentation`](https://jsr.io/@libs/crypto/doc/encryption/~)

### ✨ Features

- Use the native [`Web Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) APIs.
- Uses a [`AES-GCM 256-bits`](https://en.wikipedia.org/wiki/Galois/Counter_Mode) with [`PBKDF2`](https://en.wikipedia.org/wiki/PBKDF2)-derived key to encrypt and decrypt messages.
  - Encrypted messages are different each time thanks to an [initialization vector](https://en.wikipedia.org/wiki/Initialization_vector).
  - The derived keys from a given `seed`/`password` are always the same.
- Includes functionalities to introduce additional entropy:
  - Support for [SHA-256](https://en.wikipedia.org/wiki/SHA-2) to guarantee integrity.
  - Support for retaining the stored size to help verify integrity _(for messages with length < 255)_
  - Support for adding padding to force length be `256` or `512` bytes and obfuscate the original size _(can be disabled using `0` as value)_

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

> [!CAUTION]
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND
>
> The author is not responsible for any damage that could be caused by the use of this library. It is your responsibility to use it properly and to understand the security implications of the choices you make.
