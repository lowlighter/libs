import { parse, stringify } from "./mod.ts"
import { expect } from "https://deno.land/std@0.223.0/expect/expect.ts"

/** This operation ensure that reforming a parsed XML will still yield same data */
//deno-lint-ignore no-explicit-any
const check = (xml: string, options: any = {}) => {
  expect(stringify(parse(xml, options), options), xml)
  //deno-lint-ignore no-explicit-any
  return parse(stringify(parse(xml, options) as any, options), options)
}

Deno.test("stringify: xml syntax xml prolog", () =>
  expect(
    check(
      `<?xml version="1.0" encoding="UTF-8"?>
<root/>`,
    ),
  ).toEqual(
    {
      xml: {
        "@version": "1.0",
        "@encoding": "UTF-8",
      },
      root: null,
    },
  ))

Deno.test("stringify: xml syntax xml stylesheet", () =>
  expect(
    check(
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="styles.xsl" type="text/xsl"?>
<root/>`,
    ),
  ).toEqual(
    {
      xml: {
        "@version": "1.0",
        "@encoding": "UTF-8",
      },
      $stylesheets: [
        {
          "@href": "styles.xsl",
          "@type": "text/xsl",
        },
      ],
      root: null,
    },
  ))

Deno.test("stringify: xml syntax doctype", () =>
  expect(
    check(
      `<!DOCTYPE type "quoted attribute">
<root/>`,
    ),
  ).toEqual(
    {
      doctype: {
        "@type": true,
        "@quoted attribute": true,
      },
      root: null,
    },
  ))

Deno.test("stringify: xml example w3schools.com#3", () =>
  expect(
    check(
      `<bookstore>
  <book category="cooking">
    <!-- Comment Node -->
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30</price>
  </book>
  <book category="children">
    <!-- First Comment Node -->
    <!-- Second Comment Node -->
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  <book category="web">
    <title lang="en">XQuery Kick Start</title>
    <author>James McGovern</author>
    <author>Per Bothner</author>
    <author>Kurt Cagle</author>
    <author>James Linn</author>
    <author>Vaidyanathan Nagarajan</author>
    <year>2003</year>
    <price>49.99</price>
  </book>
  <book category="web" cover="paperback">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
</bookstore>`,
    ),
  ).toEqual(
    {
      bookstore: {
        book: [
          {
            "#comment": "Comment Node",
            "@category": "cooking",
            title: { "@lang": "en", "#text": "Everyday Italian" },
            author: "Giada De Laurentiis",
            year: 2005,
            price: 30,
          },
          {
            "#comment": ["First Comment Node", "Second Comment Node"],
            "@category": "children",
            title: { "@lang": "en", "#text": "Harry Potter" },
            author: "J K. Rowling",
            year: 2005,
            price: 29.99,
          },
          {
            "@category": "web",
            title: { "@lang": "en", "#text": "XQuery Kick Start" },
            author: [
              "James McGovern",
              "Per Bothner",
              "Kurt Cagle",
              "James Linn",
              "Vaidyanathan Nagarajan",
            ],
            year: 2003,
            price: 49.99,
          },
          {
            "@category": "web",
            "@cover": "paperback",
            title: { "@lang": "en", "#text": "Learning XML" },
            author: "Erik T. Ray",
            year: 2003,
            price: 39.95,
          },
        ],
      },
    },
  ))

Deno.test("stringify: xml types", () =>
  expect(
    check(
      `<types>
  <boolean>true</boolean>
  <null/>
  <string>hello</string>
</types>`,
    ),
  ).toEqual(
    {
      types: {
        boolean: true,
        null: null,
        string: "hello",
      },
    },
  ))

Deno.test("stringify: xml entities", () =>
  expect(
    check(`<string>&quot; &lt; &gt; &amp; &apos;</string>`),
  ).toEqual(
    {
      string: `" < > & '`,
    },
  ))

Deno.test("stringify: xml replacer", () =>
  expect(
    stringify({ root: { not: true, yes: true } }, {
      replacer({ tag, key, value }) {
        if ((tag === "not") && (key === "#text")) {
          return !value
        }
        return value
      },
    }),
  ).toBe(
    `<root>
  <not>false</not>
  <yes>true</yes>
</root>`.trim(),
  ))

Deno.test("stringify: xml space preserve", () =>
  expect(
    check(`<text xml:space="preserve"> hello world </text>`),
  ).toEqual(
    {
      text: {
        "#text": " hello world ",
        "@xml:space": "preserve",
      },
    },
  ))

Deno.test("stringify: cdata is preserved", () =>
  expect(
    check(`<string><![CDATA[hello <world>]]></string>`),
  ).toEqual(
    {
      string: `hello <world>`,
    },
  ))
