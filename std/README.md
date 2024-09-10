# 🦕 Deno standard library - All-in-one mirror package

[![JSR](https://jsr.io/badges/@libs/std)](https://jsr.io/@libs/std) [![JSR Score](https://jsr.io/badges/@libs/std/score)](https://jsr.io/@libs/std)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fstd?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/std) [![Coverage](https://coverage.libs.lecoq.io/std/badge.svg)](https://coverage.libs.lecoq.io/std)

This is a mirror package containing all of [jsr.io/@std](https://jsr.io/@std).
All public exports are re-exported in this package.

It is intended to be used as a single dependency entrypoint, or can be consumed through https imports on [deno.land/x/libs](https://deno.land/x/libs) mimicking the old [deno.land/std](https://deno.land/std) registry since [deno std is now exclusively published on jsr.io](https://deno.com/blog/std-on-jsr).

- [`📚 Documentation`](https://jsr.io/@libs/std/doc)

> [!IMPORTANT]
>
> ## [jsr.io](https://jsr.io)
>
> The `YYYY.MM.DD` versioning scheme (without leading zeros) is used instead of semantic versioning.
> This is because all sub-packages are versioned independently by `@std` maintainers which would make an unified versioning scheme impractical.
>
> ## [deno.land/x/libs](https://deno.land/x/libs)
>
> The `YYYY.MM.DD` versioning scheme (with leading zeros) is used instead of semantic versioning.
> It follows the same versioning as `x/libs` in its entirety as this mono-repo is versioned as a whole when published on [deno.land/x](https://deno.land/x/libs).

> [!CAUTION]
>
> When used with https imports, please not that currently this package still use `jsr:` specifiers.
> If there is really a demand to mirror back with only `https:` specifiers, please open an issue.

## 📜 License

```plaintext
Copyright (c) The Deno authors. (MIT License)
https://github.com/lowlighter/libs/blob/main/std/LICENSE

Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
