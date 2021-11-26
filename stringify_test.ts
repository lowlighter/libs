import { parse, stringify } from "./mod.ts";
import { asserts } from "./test_deps.ts";

const { assertEquals } = asserts;

/** This operation ensure that reforming a parsed XML will still yield same data */
//deno-lint-ignore no-explicit-any
const check = (xml: string, options: any = {}) => parse(stringify(parse(xml, options) as any, options), options);

Deno.test("stringify: xml syntax xml prolog", () =>
  assertEquals(
    check(
      `
  <?xml version="1.0" encoding="UTF-8"?>
  <root></root>
`,
    ),
    {
      xml: {
        "@version": 1,
        "@encoding": "UTF-8",
      },
      root: null,
    },
  ));

Deno.test("stringify: xml syntax doctype", () =>
  assertEquals(
    check(
      `
  <!DOCTYPE type "quoted attribute">
  <root></root>
`,
    ),
    {
      doctype: {
        "@type": true,
        "@quoted attribute": true,
      },
      root: null,
    },
  ));

Deno.test("stringify: xml example w3schools.com#3", () =>
  assertEquals(
    check(`
  <bookstore>
    <book category="cooking">
      <title lang="en">Everyday Italian</title>
      <author>Giada De Laurentiis</author>
      <year>2005</year>
      <price>30.00</price>
    </book>
    <book category="children">
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
  </bookstore>
`),
    {
      bookstore: {
        book: [
          {
            "@category": "cooking",
            title: { "@lang": "en", "#text": "Everyday Italian" },
            author: "Giada De Laurentiis",
            year: 2005,
            price: 30,
          },
          {
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
  ));

Deno.test("stringify: xml types", () =>
  assertEquals(
    check(
      `
  <types>
    <boolean>true</boolean>
    <null></null>
    <string>hello</string>
  </types>
`,
    ),
    {
      types: {
        boolean: true,
        null: null,
        string: "hello",
      },
    },
  ));

Deno.test("stringify: xml entities", () =>
  assertEquals(
    check(
      `
    <string>&quot; &lt; &gt; &amp; &apos;</string>
`,
    ),
    {
      string: `" < > & '`,
    },
  ));

Deno.test("stringify: xml replacer", () =>
  assertEquals(
    stringify({ root: { not: true, yes: true } }, {
      replacer({ tag, key, value }) {
        if ((tag === "not") && (key === "#text")) {
          return !value;
        }
        return value;
      },
    }),
    `
<root>
  <not>false</not>
  <yes>true</yes>
</root>
`.trim(),
  ));
