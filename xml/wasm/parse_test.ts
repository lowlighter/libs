import { parse } from "./parse.ts"
import { parse as std_parse } from "../parse.ts"
import { expect, type testing } from "@libs/testing"
import { fromFileUrl } from "@std/path"

Deno.test("`parse()` wasm crashed", () => {
  expect(() => parse(Symbol("Expected error") as testing)).toThrow(EvalError)
})

Deno.test("`parse()` outputs the same structure as the std backend", () => {
  const document = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="style.xsl" type="text/xsl"?>
<!DOCTYPE root SYSTEM "root.dtd">
<root>
  <!-- comment -->
  <text>hello</text>
  <array>world</array>
  <array>monde</array>
  <array>世界</array>
  <array>🌏</array>
  <number>42</number>
  <boolean>true</boolean>
  <complex attribute="value">content</complex>
  <cdata><![CDATA[<escaped>]]></cdata>
  <entities>&lt;&amp;&gt;</entities>
</root>`
  const options = { revive: { numbers: true, booleans: true } }
  expect(parse(document, structuredClone(options))).toEqual(std_parse(document, structuredClone(options)))
})

Deno.test("`parse()` xml syntax html mode", () =>
  expect(
    parse(`<root><input type=text></input></root>`, { mode: "html" }),
  ).toEqual(
    {
      root: {
        input: {
          "@type": "text",
        },
      },
    },
  ))

Deno.test("`parse()` xml parser option no revive", () =>
  expect(
    parse(
      `
      <root>
        <trim> hello </trim>
        <preserve xml:space="preserve"> world </preserve>
        <entities>&lt; &gt; &amp; &apos; &quot;</entities>
        <boolean>true</boolean>
        <boolean>false</boolean>
        <integer>1</integer>
        <float>3.14</float>
      </root>
      `,
      { revive: { trim: false, entities: false, booleans: false, numbers: false } },
    ),
  ).toEqual(
    {
      root: {
        trim: " hello ",
        preserve: { "@xml:space": "preserve", "#text": " world " },
        entities: `&lt; &gt; &amp; &apos; &quot;`,
        boolean: ["true", "false"],
        integer: "1",
        float: "3.14",
      },
    },
  ))

// Other inputs

Deno.test("`parse()` using a reader", { permissions: { read: true } }, async () => {
  using file = await Deno.open(fromFileUrl(import.meta.resolve("../bench/assets/small.xml")))
  expect(
    parse(file),
  ).toEqual(
    {
      "#comments": [
        "From https://www.w3schools.com/xml/note.xml",
      ],
      note: {
        body: "Don't forget me this weekend!",
        from: "Jani",
        heading: "Reminder",
        to: "Tove",
      },
    },
  )
})

import "../parse_test.ts#wasm"
