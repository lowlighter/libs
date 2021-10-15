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
[XML.com's **Converting between XML and JSON**](https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html)
patterns.

- Support basic XML features (tags, self-closed tags, nested tags, attributes, ...)
- Support `XML.parse` and `XML.stringify`
- Support `<?xml ?>` prolog declaration
- Support `<!DOCTYPE>` declaration
- Support `<![CDATA[ ]]` strings
- Support `<!-- -->` comments
- Support XML entities (`&amp;`, `&#38;`, `&#x26;`, ...)
- Support auto-conversion of primitives (strings, booleans, numbers, null, ...)
- Support strings or streams (`Deno.ReaderSync & Deno.SeekerSync`) inputs
- Support custom revivers and replacers
- Support metadata (parent, name, ...) hidden in a non-enumerable property
- Auto-group nodes into arrays when same tag is used
- Auto-unwrap nodes when it only has text content

How reliable is `deno.land/x/xml`? Check [parse tests](/parse_test.ts) and [stringify tests](/stringify_test.ts) 🧪

### Limitations

- When using mixed content of texts and child nodes, it will be parsed as a text node
- When using mixed group of nodes, `XML.stringify(XML.parse()))` may result in a different order
  - _Example: `<a><b/><c/><b/></a>` will result in `<a><b/><b/><c/></a>`_
  - _This may or may not be acceptable depending on your use case_

### Revivers

By default, node contents will be converted to:

- `null` when empty, unless `emptyToNull = false`
- `number` when matching finite numbers, unless `reviveNumbers = false`
- `boolean` when matching `true` or `false` (case insensitive), unless `reviveBooleans = false`

XML entities (e.g. `&amp;`, `&#38;`, `&#x26;`, ...) will be unescaped automatically.

It is also possible to provide a custom reviver for complex transformations:

```ts
import { parse } from "./mod.ts";
console.log(parse(
  `
  <prices>
    <product>dakimakura</product>
    <price currency="usd">10.5</price>
    <price currency="eur">10.5</price>
    <price currency="yen">10.5</price>
    <useless/>
  </prices>
`,
  {
    reviver({ value, key, tag, properties }) {
      //Apply special processing for tag, attributes and properties
      if (tag === "price") {
        if (key === "@currency") {
          return { usd: "$", eur: "€", yen: "¥" }[value as string] ?? "?";
        }
        if (key === "#text") {
          delete this["@currency"];
          return `${value}${properties?.["@currency"]}`;
        }
      }
      //Filter out useless elements
      if (tag === "useless") {
        return undefined;
      }
      return value;
    },
  },
));
/*
  Like JSON.parse's reviver, computed value can be transformed before being returned.
  - `this` will refer to the node being edited, meaning that any edition will reflect
    on final parsed value.
  - `properties` can be accessed only after all other node's properties have been
    parsed
  - returning `undefined` (or nothing) will filter out current value
  {
    prices: {
      product: "dakimakura",
      price: [ "10.5$", "10.5€", "10.5¥" ]
    }
  }
*/
```

### XML metadata

It is possible to access several metadata properties using `$XML` symbol, like parent node, name, etc.

```ts
import { $XML, parse } from "./mod.ts";
console.log($XML);
console.log(Deno.inspect(
  parse(
    `
  <root>
    <child>hello world</child>
  </root>
`,
    { flatten: false },
  ),
  { showHidden: true, compact: false },
));
/*
  Symbol("x/xml")
  {
    root: {
      child: {
        "#text": "hello world",
        [Symbol("x/xml")]: {
          name: "child",
          parent: [Circular]
        }
      },
      [Symbol("x/xml")]: {
        name: "root",
        parent: null
      }
    }
  }
*/
```

### Parsing large files

Parsing large files of several mega bytes can take some time. You can use `progress` option to pass a callback each time
a node has been parsed.

```ts
import { parse } from "./mod.ts";
const file = await Deno.open("my.xml");
const { size } = await file.stat();
console.log(parse(file, {
  progress(bytes) {
    Deno.stdout.writeSync(
      new TextEncoder().encode(
        `Parsing document: ${(100 * bytes / size).toFixed(2)}%\r`,
      ),
    );
  },
}));
```
