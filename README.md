# XML parser for Deno

> ⚠️ Still in development

## Basic usage

```ts
import {
  parse,
  stringify,
} from "https://deno.land/x/xml/mod.ts";

const data = parse(`
<?xml version="1.0" encoding="UTF-8"?>
<hello lang="en" charset="utf8">world</hello>
`);

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

## Features

- Same interface as `JSON` native library and support `reviver` and `replacer`
- Support attributes and textnode
- Support `<![CDATA[ ]]` string
- Auto-convert nodes of same name into arrays
- Auto-convert numbers, booleans and empty nodes

