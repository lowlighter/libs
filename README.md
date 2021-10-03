# XML parser for Deno

## Basic usage

```ts
import { parse } from "https://deno.land/x/xml/mod.ts";

console.log(parse(`
  <root>
    <!-- This is a comment -->
    <text>hello</text>
    <array>world</array>
    <array>monde</array>
    <array>世界</array>
    <array>🌏</array>
    <number>42</number>
    <boolean>true</boolean>
    <complex attribute="value">content</complex>
  </root>
`));
/*
  Same nodes are grouped into arrays, while numbers and booleans are auto-parsed (can be disabled)
  Nodes with attributes will not be flattened and you'll be able to access them with "@" prefix while
  text nodes are available through "#text" key and comment nodes are available through "#comment" key
  {
    root: {
      "#comment": "This is a comment",
      text: "hello",
      array: ["world", "monde", "世界", "🌏"],
      number: 42,
      boolean: true,
      complex: {
        "@attribute": "value",
        "#text": "content",
      }
    }
  }
*/
```

```ts
import { stringify } from "https://deno.land/x/xml/mod.ts";

console.log(stringify({
  root: {
    "#comment": "This is a comment",
    text: "hello",
    array: ["world", "monde", "世界", "🌏"],
    number: 42,
    boolean: true,
    complex: {
      "@attribute": "value",
      "#text": "content",
    },
  },
}));
```

## Features

Follow
[XML.com's **Converting between XML and
JSON**](https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html)
patterns.

- Support basic XML (tags, self-closed tags, nested tags, attributes, ...)
- Support `XML.parse` and `XML.stringify`
- Support `<?xml ?>` prolog declaration
- Support `<!DOCTYPE>` declaration
- Support `<![CDATA[ ]]` strings
- Support `<!-- -->` comments
- Support XML entities (`&amp;`, `&#38;`, `&#x26;`, ...)
- Support auto-conversion of primitives (strings, booleans, numbers, null, ...)
- Support strings or streams (`Deno.ReaderSync & Deno.SeekerSync`) inputs
- Auto-group nodes into arrays when same tag is used
- Auto-unwrap nodes when it only has text content

How reliable is `deno.land/x/xml`? Check [parse tests](/parse_test.ts) and
[stringify tests](/stringify_test.ts) 🧪

### Limitations

- When using mixed content of texts and child nodes, it will be parsed as a text
  node
- When using mixed group of nodes, `XML.stringify(XML.parse()))` may result in a
  different order
  - _Example: `<a><b/><c/><b/></a>` will result in `<a><b/><b/><c/></a>`_
  - _This may or may not be acceptable depending on your use case_

### Revivers

By default, node contents will be converted to:

- `null` when empty, unless `emptyToNull = false`
- `number` when matching finite numbers, unless `reviveNumbers = false`
- `boolean` when matching `true` or `false` (case insensitive), unless
  `reviveBooleans = false`

XML entities (e.g. `&amp;`, `&#38;`, `&#x26;`, ...) will be unescaped
automatically.
