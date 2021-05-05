# XML parser for Deno

## Features

> ⚠️ Still in development

Follow
[XML.com's **Converting between XML and
JSON**](https://www.xml.com/pub/a/2006/05/31/converting-between-xml-and-json.html)
patterns.

- Support basic XML (tags, self-closed tags, nested tags, attributes, ...)
- Support `XML.parse` and `XML.stringify`
- Support `<?xml ?>` prolog declaration
- Support `<!DOCTYPE>` declaration
- Support `<![CDATA[ ]]` strings
- Support XML entities (`&amp;`, `&#38;`, `&#x26;`, ...)
- Support `reviver`s for custom parsing
- Auto-group nodes into arrays when same tag is used
- Auto-unwrap nodes when it only has text content

### Limitations

- Comments are stripped and cannot be recovered
- When using mixed content of texts and child nodes, text node will be stripped
  and cannot be recovered
- When using mixed group of nodes, `XML.stringify(XML.parse()))` may result in
  different order
  - _Example: `<a><b/><c/><b/></a>` will result in `<a><b/><b/><c/></a>`_
  - _This may or may not be acceptable depending on your use case_

Not implemented yet:

- [ ] XML.stringify

## Basic usage

```ts
import { parse, stringify } from "https://deno.land/x/xml/mod.ts";

const data = parse(`<hello lang="en" charset="utf8">world</hello>`);
console.log(data);
/*
{
  hello:{
    "@lang":"en",
    "@charset":"utf8",
    $:"world",
  }
}
*/
```

### Revivers

By default, node contents will be converted to:

- `null` when empty, unless `emptyToNull = false`
- `number` when matching finite numbers, unless `reviveNumbers = false`
- `boolean` when matching `true` or `false` (case insensitive), unless
  `reviveBooleans = false`

XML entities (e.g. `&amp;`, `&#38;`, `&#x26;`, ...) will be unescaped
automatically.

You can also provide a custom reviver that will receive `key`, `value` and
`tag`.
