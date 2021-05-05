# XML parser for Deno

## Features

> ⚠️ Still in development

- Support `XML.parse` and `XML.stringify`
- Support `<![CDATA[ ]]` string
- Support `reviver`s for custom parsing
- Auto-group nodes into arrays when same tag is used
- Auto-unwrap nodes when it only has text content

### Limitations

- Comments are stripped and cannot be recovered
- `XML.stringify(XML.parse()))` may result in different order when using grouped mixed nodes (e.g. `<a><b/><c/><b/></a>` will result in `<a><b/><b/><c/></a>`)

Not implemented yet:
- [ ] XML.stringify
- [ ] Mixed node content parsing
- [ ] Doctype support

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
- `boolean` when matching `true` or `false` (case insensitive), unless `reviveBooleans = false`

XML entities (e.g. `&amp;`, `&#38;`, `&#x26;`, ...) will be unescaped automatically.

You can also provide a custom reviver that will receive `key`, `value` and `tag`.

