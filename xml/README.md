# 📃 XML parser and stringifier

[![JSR](https://jsr.io/badges/@libs/xml)](https://jsr.io/@libs/xml) [![JSR Score](https://jsr.io/badges/@libs/xml/score)](https://jsr.io/@libs/xml)
[![NPM](https://img.shields.io/npm/v/@lowlighter%2Fxml?logo=npm&labelColor=cb0000&color=183e4e)](https://www.npmjs.com/package/@lowlighter/xml) [![Coverage](https://libs-coverage.lecoq.io/xml/badge.svg)](https://libs-coverage.lecoq.io/xml)

- [`🦕 Playground`](https://libs.lecoq.io/xml)
- [`📚 Documentation`](https://jsr.io/@libs/xml/doc)

## ✨ Features

- Based on [quick-xml](https://github.com/tafia/quick-xml) rust package (compiled to WASM)
- Support `XML.parse` and `XML.stringify`
- Support `<!-- -->` comments
- Support XML entities (`&amp;`, `&#38;`, `&#x26;`, ...)
- Support mixed content (text and nodes)
- Large output transformation options
  - Auto-flattening of nodes with a single child, text or attributes
  - Auto-revival of `boolean`, `number`, etc.
  - Auto-group same-named nodes into arrays
  - Formatting options (indentation, break lines, etc.)
  - Custom `reviver` and `replacer` functions
- Metadata stored into non-enumerable properties for advanced usage

## 🕊️ Migrating from `4.x.x` to `5.x.x`

Starting from version `5.0.0`, this library use a WASM-compiled binding of the [quick-xml](https://github.com/tafia/quick-xml) rust package. It provides better performances while allowing to support more features.

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

```diff
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

```diff
  {
-   xml: {
-     "@version": "1.0",
-     "@encoding": "UTF-8",
-   },
-   "$stylesheets": [ { "@href": "styles.xsl", "@type": "text/xsl" } ]
-   doctype: { "@attribute": true },
+   "@version": "1.0",
+   "@encoding": "UTF-8",
+   "#instructions": {
+     "xml-stylesheet": { "@href": "styles.xsl", "@type": "text/xsl" }
+   },
+   "#doctype": { "@attribute": "" },
    root: null
  }
```

### Mixed content support

This breaks any existing code that was expecting mixed content to always be a string. Now mixed content nodes will be parsed as usual, and the `#text` property will contain the "inner text" of the node.

Note that `#text` is actually a getter that recursively gets the `#text` of children nodes (ignoring comment nodes) so it'll return the inner text regardless of the node depth.

```xml
<root>some <b>bold</b> text</root>
```

```diff
  {
-   root: "some <b>bold</b> text",
+   root: {
+     "#text": "some bold text",
+     b: "bold",
  }
```

### Comments

Comments have been moved into `"#comments"` property. Note that this property is now always an array, even if there is only one comment.

Additionally, you can find comments into the `~children` property by searching for nodes with `"~name": "~comment"`. If you call the `#text` getter on a parent node containing comments, it will return the inner text without comments.

```xml
<root><!--some comment--></root>
```

```diff
  {
    root: {
-     "#comment": "some comment",
+     "#comments": [ "some comment" ],
    }
  }
```

### Parsing

#### Options

Parse options are categorized into 4 groups:

- `clean`, which can remove `attributes`, `comments`, xml `doctype` and `instructions` from the output
- `flatten`, which can flatten nodes with only a `text` node, `empty` ones or transform `attributes` only nodes into objects without the `@` prefix
- `revive`, which can `trim` content (unless `xml:space="preserve"`), unescape xml `entities`, revive `booleans` and `numbers`
  - You can also provide a `custom` reviver function (applied after other revivals) that will be called on each attribute and node
  - _Note that signature of the reviver function has changed_
- `mode`, which can be either `xml` or `html`. Choosing the latter will be more permissive than the former.

```diff
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

The `parse()` function supports any `ReaderSync` interface, which means you can pass directly a file reader for example.

```ts
import { parse } from "./parse.ts"
parse(await Deno.readTextFile("example.xml"))
```

### Stringifying

#### Options

Stringify options are now categorized into 2 groups:

- `format`, which can configure the `indent` string and automatically `breakline` when a text node is too long
- `replace`, which can forcefully escape xml `entities`
  - You can also provide a `custom` replacer function that will be called on each attribute and node
  - Note that signature of the replacer function has changed

```diff
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

Please refer to the above section about API changes. If you were handling XML properties, using the `$XML` symbol or `#comment`, you'll most likely need to update your code.

The library now provides `comment()` and `cdata()` helpers to respectively create comment and CDATA nodes.

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

Note that also you can theorethically use internal properties we strongly advise against it currently. Supporting `~children` might be added in the future ([#57](https://github.com/lowlighter/libs/issues/57)) for mixed content support, but its behavior is not defined yet. Setting
`~name` manually might lead to unexpected behaviors.

## 📜 License and credits

```
Copyright (c) Lecoq Simon <@lowlighter>. (MIT License)
https://github.com/lowlighter/libs/blob/main/LICENSE
```

This library used to be published at [deno.land/x/xml](https://deno.land/x/xml) and [jsr.io/@lowlighter/xml](https://jsr.io/@lowlighter/xml). It was moved into [jsr.io/@libs/xml](https://jsr.io/@libs/xml) starting version `5.0.0`.

Version prior to `5.0.0` used to be fully written in TypeScript but it was rewritten in Rust to improve performances and support more features.
