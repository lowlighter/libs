# 🍱 lowlighter's standalone libraries

This is a collection of carefully crafted _TypeScript_ standalone libraries. These try to be minimal, unbloated and convenient.

Most of them are written with [deno](https://deno.com) in mind, but as the code honors [web standards](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/The_web_and_web_standards) they should be usable on any runtime that follows web specifications
(including browsers).

### Index

- [🔳 QR Code generator](/qrcode)
- [🔑 Time-based One-Time Password (TOTP)](/crypto)
- [➕ Diff (patience algorithm)](/diff)
- [🔐 Symmetric encryption (using AES-GCM 256 with a PBKDF2 derived key)](/crypto)
- [📰 Logger](/logger)
- [🗜️ Bundler](/bundle)

These libraries are published at [jsr.io/@libs](https://jsr.io/@libs) *(they were previously available at [deno.land/x/libs](https://deno.land/x/libs)).

> [!IMPORTANT]\
> Love these bytes ? Consider [`💝 sponsoring me`](https://github.com/sponsors/lowlighter), even one-time contributions are greatly appreciated !

## ℹ️ About

While this repository is public, it is not really intended to be a collaborative project. Pull requests for bug fixes or improvements are still welcome, but I may not accept any feature request if it doesn't seem to fit the scope of this project.

Additionally, these libraries tends to follow my own coding style which:

- use ES next syntax
- try to be minimalistic and visually unbloated (no semicolons, infered typing, etc.)
- use caseless convention (single whole words are preferred assuming they're unambiguous depending on the local context)

## 📜 License

This work is licensed under the [MIT License](./LICENSE).

If you include a significant part of it in your own project, _**you should keep the license notice**_ with it, including the mention of the additional original authors if any.
