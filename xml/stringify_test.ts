import { type options as parse_options, parse } from "./parse.ts"
import { cdata, comment, type options as stringify_options, stringify } from "./stringify.ts"
import { expect, test } from "@libs/testing"

// This operation ensure that reforming a parsed XML will still yield same data
const check = (xml: string, options?: parse_options & stringify_options) => {
  expect(stringify(parse(xml, options), options), xml)
  return parse(stringify(parse(xml, options), options), options)
}

test("`stringify()` xml syntax xml prolog", () =>
  expect(
    check(
      `<?xml version="1.0" encoding="UTF-8"?>
<root/>`,
    ),
  ).toEqual(
    {
      "@version": "1.0",
      "@encoding": "UTF-8",
      root: null,
    },
  ))

test("`stringify()` xml syntax xml stylesheet", () =>
  expect(
    check(
      `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet href="styles.xsl" type="text/xsl"?>
  <root/>`,
    ),
  ).toEqual(
    {
      "@version": "1.0",
      "@encoding": "UTF-8",
      "#instructions": {
        "xml-stylesheet": {
          "@href": "styles.xsl",
          "@type": "text/xsl",
        },
      },
      root: null,
    },
  ))

test("`stringify()` xml syntax doctype", () =>
  expect(
    check(
      `<!DOCTYPE type "quoted attribute" [
          <!ELEMENT element (value)>
        ]>
  <root/>`,
    ),
  ).toEqual(
    {
      "#doctype": {
        "@type": "",
        "@quoted attribute": "",
        element: "value",
      },
      root: null,
    },
  ))

for (const indent of ["  ", ""]) {
  test(`\`stringify()\` xml example w3schools.com#3 (indent = "${indent}")`, () =>
    expect(
      check(
        `
      <?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet href="styles.xsl" type="text/xsl"?>
      <!DOCTYPE type "quoted attribute" [
        <!ELEMENT element (value)>
      ]>
      <bookstore>
        <notebook/>
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
        { revive: { booleans: true, numbers: true }, format: { indent } },
      ),
    ).toEqual(
      {
        "@version": "1.0",
        "@encoding": "UTF-8",
        "#instructions": {
          "xml-stylesheet": {
            "@href": "styles.xsl",
            "@type": "text/xsl",
          },
        },
        "#doctype": {
          "@type": "",
          "@quoted attribute": "",
          element: "value",
        },
        bookstore: {
          notebook: null,
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
    ))
}

test("`stringify()` xml types", () =>
  expect(
    check(
      `<types>
    <boolean>true</boolean>
    <null/>
    <string>hello</string>
  </types>`,
      { revive: { booleans: true } },
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

test("`stringify()` xml entities", () =>
  expect(
    check(`<string>&quot; &lt; &gt; &amp; &apos;</string>`),
  ).toEqual(
    {
      string: `" < > & '`,
    },
  ))

test(
  "`stringify()` xml entities are escaped only where needed",
  () =>
    expect(stringify({
      root: {
        "@attribute": `<text with escaped quotes (',") and ampersand &>`,
        text: `only <, > and & should be escaped, not " and '`,
      },
    }, { format: { breakline: 0 } })).toEqual(
      `
<root attribute="<text with escaped quotes (&apos;,&quot;) and ampersand &amp;>">
  <text>
    only &lt;, &gt; and &amp; should be escaped, not " and '
  </text>
</root>`.trim(),
    ),
)

test(
  "`stringify()` xml entiries are always escaped when escapeAllEntities is true",
  () =>
    expect(stringify({
      root: {
        "@attribute": `< > &, ", '`,
        text: `< > &, ", '`,
      },
    }, { replace: { entities: true }, format: { breakline: 0 } })).toEqual(
      `
<root attribute="&lt; &gt; &amp;, &quot;, &apos;">
  <text>
    &lt; &gt; &amp;, &quot;, &apos;
  </text>
</root>`.trim(),
    ),
)

test("`stringify()` xml space preserve", () =>
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

test("`stringify()` cdata is preserved on root nodes", () =>
  expect(
    stringify({ string: cdata(`hello <world>`) }),
  ).toBe("<string><![CDATA[hello <world>]]></string>"))

test("`stringify()` cdata is preserved on child nodes", () =>
  expect(
    stringify({ nested: { string: cdata(`hello <world>`) } }),
  ).toBe(`
<nested>
  <string><![CDATA[hello <world>]]></string>
</nested>`.trim()))

test("`stringify()` comments is preserved on root nodes", () =>
  expect(
    stringify({ string: comment(`hello world`) }),
  ).toBe("<string><!--hello world--></string>"))

test("`stringify()` comments is preserved on child nodes", () =>
  expect(
    stringify({ nested: { string: comment(`hello world`) } }),
  ).toBe(`
<nested>
  <string><!--hello world--></string>
</nested>`.trim()))

test("`stringify()` does not edit argument", () => {
  const document = Object.freeze({ foo: Object.freeze({ bar: "baz" }) })
  expect(stringify(document, { format: { indent: "" } })).toEqual("<foo><bar>baz</bar></foo>")
})

// Custom replacer

test("`stringify()` xml replacer", () =>
  expect(
    stringify({ root: { not: true, yes: true, delete: true, attribute: { "@delete": true } } }, {
      replace: {
        custom: ({ name, key, value }) => {
          if ((name === "delete") || (key === "@delete")) {
            return undefined
          }
          if ((name === "not") && (key === "#text")) {
            return !value
          }
          return value
        },
      },
    }),
  ).toBe(
    `
<root>
  <not>false</not>
  <yes>true</yes>
  <attribute/>
</root>`.trim(),
  ))

//Errors checks

test("`stringify()` xml syntax no root node", () => expect(() => stringify({})).toThrow(SyntaxError))

test("`stringify()` xml syntax multiple root nodes", () => expect(() => stringify({ root: null, garbage: null })).toThrow(SyntaxError))
