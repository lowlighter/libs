# 📃 XML parser and stringifier

[![JSR](https://jsr.io/badges/@libs/xml)](https://jsr.io/@libs/xml) [![NPM](https://img.shields.io/npm/v/@lowlighter%2Fxml?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/xml)
[![deno.land/x](https://img.shields.io/badge/deno.land%2Fx-xml-0a3040?logo=deno&labelColor=black)](https://deno.land/x/xml) [![Coverage](https://libs-coverage.lecoq.io/xml/badge.svg)](https://libs-coverage.lecoq.io/xml)

- [`🦕 Playground`](https://libs.lecoq.io/xml)
- [`📚 Documentation`](https://jsr.io/@libs/xml/doc)

## 📑 Examples

### Parsing XML to objects

```ts
import { parse } from "./parse.ts"

// Parse a string
console.log(parse(`
  <?xml version="1.0"?>
  <root>
    <text>hello</text>
    <array>world</array>
    <array>monde</array>
    <array>世界</array>
    <array>🌏</array>
    <complex attribute="value">content</complex>
  </root>
`))

// Parse a file
using file = await Deno.open("bench/assets/small.xml")
console.log(await parse(file.readable))
```

### Stringifying objects to XML

```ts
import { stringify } from "./stringify.ts"

console.log(stringify({
  "@version": "1.0",
  root: {
    text: "hello",
    array: ["world", "monde", "世界", "🌏"],
    complex: {
      "@attribute": "value",
      "#text": "content",
    },
  },
}))
```

## ✨ Features

- Based on [`@std/xml`](https://jsr.io/@std/xml).
- Support for `XML.parse` and `XML.stringify` in the style of the `JSON` global.
- Support for `<!-- -->` comments.
- Support for XML entities (`&amp;`, `&#38;`, `&#x26;`, …).
- Support for mixed content (both text and nodes).
- Support for large output transformation options:
  - Auto-flatten nodes with a single child, text or attributes
  - Auto-revive `boolean`s, `number`s, etc.
  - Auto-group same-named nodes into arrays.
  - Format (indentation, break lines, etc.)
  - Support for custom `reviver` and `replacer` functions
- Support for metadata stored into non-enumerable properties (advanced usage).

## 🕊️ Migrating from `7.x.x` to `8.x.x`

### Using `@std/xml` instead of `quick-xml` as parser

The parser is now backed by [`@std/xml`](https://jsr.io/@std/xml) instead of a WASM-compiled binding of the [quick-xml](https://github.com/tafia/quick-xml) Rust package.

This change reduces the maintenance burden of the library while relying on a standardized parser.

The WASM parser from `7.x.x` is still available in the `@libs/xml/wasm/parse` export. While the TypeScript layer will continue being updated, the underlying WASM module that serves quick-xml tokenization won't.

### Exported types are now PascalCase

```diff ts
- import type { stringify_options, stringifyable, xml_document, xml_node, xml_text } from "jsr:@libs/xml@7/stringify"
+ import type { StringifyOptions, Stringifyable, XmlDocument, XmlNode, XmlText } from "jsr:@libs/xml@8/stringify"
```

### Unsupported options in the default export

> Note: described options are still available in the legacy WASM backend from `@libs/xml/wasm/parse` export.

The `revive.entities` option of `parse` has been removed, XML entities are now always decoded. If you need values in their escaped form, re-escape them with `escape` from [`@std/html/entities`](https://jsr.io/@std/html):

```diff ts
- const document = parse(text, { revive: { entities: false } })
+ import { escape } from "jsr:@std/html/entities"
+ const document = parse(text)
+ // Apply `escape()` on values where the escaped form is needed
```

The `mode: "html"` option of `parse` has been temporarily removed, as `@std/xml` only supports strict XML.

```diff ts
- import { parse } from "jsr:@libs/xml@8/parse"
+ import { parse } from "jsr:@libs/xml@8/wasm/parse"
  const document = parse(text, { mode: "html" })
```

Passing a `ReaderSync` to `parse` is no longer supported. You can still pass a `Reader` to `parse` but the result is now asynchronous.

```diff
  using file = await Deno.open("bench/assets/small.xml")
- console.log(parse(file))
+ console.log(await parse(file.readable))
```

## 🕊️ Migrating from `6.x.x` to `7.x.x`

For both `stringify` and `parse`, the type `options` has been renamed and prefixed by their scope for more clarity.

```diff ts
- import type { options } from "jsr:@libs/xml@6/stringify"
+ import type { stringify_options } from "jsr:@libs/xml@7/stringify"
```

```diff ts
- import type { options } from "jsr:@libs/xml@6/parse"
+ import type { parse_options } from "jsr:@libs/xml@7/parse"
```

If you didn't use these typings, no further changes are required.

## 🕊️ Migrating from `5.x.x` to `6.x.x`

Version `6.x.x` and onwards require Deno `2.x.x` or later.

## 🕊️ Migrating from `4.x.x` to `5.x.x`

Prior to version version `5.0.0`, this library was fully written in TypeScript. It now uses a WASM-compiled binding of the [quick-xml](https://github.com/tafia/quick-xml) Rust package, which provides better performance while allowing us to support more features.

### Internal API changes

The `$XML` internal symbol has been replaced by a set of non-enumerable properties:

- Parent node can now be accessed through `"~parent"` property (it'll be `null` for the XML document node)
- Tag name can now be accessed through `"~name"` property
- Children nodes can now be accessed through `"~children"` property
  - CDATA can now be tested by checking whether a node has a `"~name": "~cdata"` (if flattened, you'll need to check from the parent node using `~children` property)

```xml
<root>
  <node><![CDATA[hello <world>]]></node>
</root>
```

```diff js
  <ref *1> {
-   [$XML]: { cdata: [ "root", "node" ] },
+   "~parent": null,
+   "~name": "~xml",
    root: {
      node: "hello <world>",
-     [$XML]: { name: "root", parent: null },
+     "~parent": [Circular *1],
+     "~name": "root",
+     "~children": [ { "~name": "~cdata", "#text": "hello <world>" } ],
    }
  }
```

### XML document changes

XML document properties have been moved directly to top-level rather than being stored in `xml` property.

Doctype is now stored in `"#doctype"` property, and attributes values are set to `""` rather than `true`.

Processing instructions (like XML stylesheets) are now parsed the same way as regular nodes but have been moved into `"#instructions"` property.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="styles.xsl" type="text/xsl"?>
<!DOCTYPE attribute>
<root/>
```

```diff js
  {
-   xml: {
-     "@version": "1.0",
-     "@encoding": "UTF-8",
-   },
+   "@version": "1.0",
+   "@encoding": "UTF-8",
-   "$stylesheets": [ { "@href": "styles.xsl", "@type": "text/xsl" } ]
+   "#instructions": {
+     "xml-stylesheet": { "@href": "styles.xsl", "@type": "text/xsl" }
+   },
-   doctype: { "@attribute": true },
+   "#doctype": { "@attribute": "" },
    root: null
  }
```

### Mixed content support

This breaks any existing code that was expecting mixed content to always be a string. Now, mixed content nodes will be parsed as usual, and the `#text` property will contain the "inner text" of the node.

Note that `#text` is actually a getter that recursively gets the `#text` of children nodes (ignoring comment nodes), so it'll also handle nested mixed content correctly.

```xml
<root>some <b>bold</b> text</root>
```

```diff js
  {
-   root: "some <b>bold</b> text",
+   root: {
+     "#text": "some bold text",
+     b: "bold",
+   }
  }
```

### Comments

Comments have been moved into `"#comments"` property. Note that this property is now always an array, even if there is only one comment.

Additionally, you can find comments into the `~children` property by searching for nodes with `"~name": "~comment"`. If you call the `#text` getter on a parent node containing comments, it will return the inner text without comments.

```xml
<root><!--some comment--></root>
```

```diff js
  {
    root: {
-     "#comment": "some comment",
+     "#comments": [ "some comment" ],
    }
  }
```

### Parsing

#### Options

Parsing options are categorized into 4 groups:

- `clean`, which can remove `attributes`, `comments`, xml `doctype` and `instructions` from the output
- `flatten`, which can flatten nodes with only a `text` node, `empty` ones or transform `attributes` only nodes into objects without the `@` prefix
- `revive`, which can `trim` content (unless `xml:space="preserve"`), unescape xml `entities`, revive `booleans` and `numbers`
  - You can also provide a `custom` reviver function (applied after other revivals) that will be called on each attribute and node
  - _Note that signature of the reviver function has changed_
- `mode`, which can be either `xml` or `html`. Choosing the latter will be more permissive than the former.

```diff js
  const options = {
-   reviveBooleans: true,
-   reviveNumbers: true,
-   reviver:() => {},
+   revive: { booleans: true, numbers: true, custom: () => {} },
-   emptyToNull: true,
-   flatten: true,
+   flatten: { text: true, empty: true },
-   debug: false,
-   progress: () => null,
  }
```

Please refer to the [documentation](https://jsr.io/@libs/xml/doc) for more information.

#### Parsing streams

The `parse()` function supports any `ReaderSync`, which means you can pass directly a file reader for example.

```ts ignore
import { parse } from "./parse.ts"
parse(await Deno.readTextFile("example.xml"))
```

Async parsing is not supported yet, but might be added in the future (see [#49](https://github.com/lowlighter/libs/issues/49)).

### Stringifying

#### Options

Stringifying options are now categorized into 2 groups:

- `format`, which can configure the `indent` string and automatically `breakline` when a text node is too long
  - _Since you pass a string rather than a number for indent, it means that you can also use tabs instead of space too_
- `replace`, which can forcefully escape xml `entities`
  - You can also provide a `custom` replacer function that will be called on each attribute and node
  - _Note that signature of the replacer function has changed_

```diff js
  const options = {
-   indentSize: 2,
+   format: { indent: "  " },
-   escapeAllEntities: true,
-   replacer: () => {},
+   replace: { entities: true, custom: () => {} },
-   nullToEmpty: false,
-   debug: false,
-   progress: () => null,
  }
```

Please refer to the [documentation](https://jsr.io/@libs/xml/doc) for more information.

### Stringifying content

Please refer to the above section about API changes. If you were handling XML document properties, using the `$XML` symbol or `#comment` property, or dealing with mixed nodes content, you'll most likely need to update your code.

Additionally, the library now provides `comment()` and `cdata()` helpers to respectively create comment and CDATA nodes:

```ts
import { cdata, comment, stringify } from "./stringify.ts"
stringify({
  "@version": "1.0",
  "@encoding": "UTF-8",
  root: {
    comment: comment("hello world"),
    cdata: cdata("bonjour <le monde>"),
    text: "hello world",
    node: {
      foo: true,
      bar: 42,
      baz: {
        "@attribute": "value",
      },
    },
  },
})
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <comment><!--hello world--></comment>
  <cdata><![CDATA[bonjour <le monde>]]></cdata>
  <text>hello world</text>
  <node>
    <foo>true</foo>
    <bar>42</bar>
    <baz attribute="value"/>
  </node>
</root>
```

Note that while you can _theoretically_ use internal API properties, currently, we strongly advise against doing so. Supporting `~children` might be added in the future ([#57](https://github.com/lowlighter/libs/issues/57)) for mixed content, but its behavior is not yet well
defined. Setting `~name` manually might lead to unexpected behaviors, especially if it differs from the parent key.

> [!TIP]
> For more type-safety, write `satisfies Partial<XmlDocument>` after whatever you pass into `stringify`, like so:
>
> <!-- TODO(lishaduck): Add ts highlighting once denoland/deno#24164 is resolved -->
>
> ```
> import { stringify, type XmlDocument } from "./stringify.ts"
>
> const ast = {
>   "@version": "1.0",
>   "@encoding": "UTF-8",
>   "root": {},
> } satisfies Partial<XmlDocument>
> const result = stringify(ast)
> ```
>
> We expose lax typing, but `Partial<XmlDocument>` uses the stricter typing we use internally.

## 📜 License and credits

```plaintext
Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```
