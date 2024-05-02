# ➕ Diff (patience algorithm)

[`🦕 Playground`](https://dash.deno.com/playground/libs-diff)

This library is based on the previous work of [@jonTrent](https://github.com/jonTrent) which is itself based on the work of Bram Cohen.

- [Original JavaScript source code](https://github.com/jonTrent/PatienceDiff/blob/dev/PatienceDiff.js)

I wrote this library because I'm working on a side project that allows edition of text content, and I wanted to implemente some kind of versioning system _à la [git](https://git-scm.com)_. The thing is I didn't want to create a binary dependency on a binary, especially since the
tracked content are mostly small text that may be anywhere in the filesystem, including remote files which would have been outside boundaries of git versioning.

> [!NOTE]\
> `patch()` is not implemented yet because I'm currently working on another personal project that I want to finish first (it's actually the project that required both the QR code and the TOTP libraries) but it'll eventually be available in the future.

## Features

- Compute [unified patch](https://opensource.com/article/18/8/diffs-patches) between two strings
- Match [`diff`](https://www.man7.org/linux/man-pages/man1/diff.1.html) command line output
- No external dependencies
- Lightweight

## Usage

```ts
import { diff } from "./diff.ts"

// Print unified patch
console.log(diff("foo", "bar"))
```

```diff
--- a
+++ b
@@ -1 +1 @@
-foo
+bar
```
