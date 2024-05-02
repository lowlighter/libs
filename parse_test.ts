import { $XML, parse } from "./mod.ts"
import { expect } from "jsr:@std/expect/expect"
import { fn } from "jsr:@std/expect/fn"
import type { ParserOptions } from "./utils/types.ts"

// deno-lint-ignore no-explicit-any
type test = any

Deno.test("parse: xml syntax tag", () =>
  expect(
    parse(`
  <root>hello world</root>
`),
  ).toEqual(
    {
      root: "hello world",
    },
  ))

Deno.test("parse: xml syntax tag with attributes", () =>
  expect(
    parse(`
  <root lang="en" type="greeting">hello world</root>
`),
  ).toEqual(
    {
      root: {
        "@lang": "en",
        "@type": "greeting",
        "#text": "hello world",
      },
    },
  ))

Deno.test("parse: xml syntax self-closing tag", () =>
  expect(
    parse(`
  <root/>
`),
  ).toEqual(
    {
      root: null,
    },
  ))

Deno.test("parse: xml syntax self-closing with attributes", () =>
  expect(
    parse(`
  <root lang="en" type="greeting" text="hello world"></root>
`),
  ).toEqual(
    {
      root: {
        "#text": null,
        "@lang": "en",
        "@type": "greeting",
        "@text": "hello world",
      },
    },
  ))

Deno.test("parse: xml syntax empty tag", () =>
  expect(
    parse(`
  <root></root>
`),
  ).toEqual(
    {
      root: null,
    },
  ))

Deno.test("parse: xml syntax empty tag with attributes", () =>
  expect(
    parse(`
  <root type="test"></root>
`),
  ).toEqual(
    {
      root: {
        "#text": null,
        "@type": "test",
      },
    },
  ))

Deno.test("parse: xml syntax simple tree", () =>
  expect(
    parse(`
  <root>
    <child>
      <subchild>.....</subchild>
    </child>
  </root>
`),
  ).toEqual(
    {
      root: {
        child: {
          subchild: ".....",
        },
      },
    },
  ))

Deno.test("parse: xml syntax simple tree with same tags", () =>
  expect(
    parse(`
  <root>
    <child>world</child>
    <child>monde</child>
    <child>世界</child>
    <child>🌏</child>
  </root>
`),
  ).toEqual(
    {
      root: {
        child: ["world", "monde", "世界", "🌏"],
      },
    },
  ))

Deno.test("parse: xml syntax simple tree with same tags and attributes", () =>
  expect(
    parse(`
  <root>
    <child lang="en">world</child>
    <child lang="fr">monde</child>
    <child lang="zh">世界</child>
    <child lang="🦕">🌏</child>
  </root>
`),
  ).toEqual(
    {
      root: {
        child: [
          { "@lang": "en", "#text": "world" },
          { "@lang": "fr", "#text": "monde" },
          { "@lang": "zh", "#text": "世界" },
          { "@lang": "🦕", "#text": "🌏" },
        ],
      },
    },
  ))

Deno.test("parse: xml syntax simple tree with nested tags of same name", () =>
  expect(
    parse(`
  <root>
    <child>
      <child>
        <child>
          <child/>
        </child>
      </child>
    </child>
  </root>
`),
  ).toEqual(
    {
      root: {
        child: { child: { child: { child: null } } },
      },
    },
  ))

Deno.test("parse: xml syntax mixed content", () =>
  expect(
    parse(`
  <root>some <b>bold</b> text</root>
`),
  ).toEqual(
    {
      root: "some <b>bold</b> text",
    },
  ))

Deno.test("parse: xml syntax nested mixed content", () =>
  expect(
    parse(`
  <root>some <b>bold <i>italic</i> </b> text</root>
`),
  ).toEqual(
    {
      root: "some <b>bold <i>italic</i> </b> text",
    },
  ))

Deno.test("parse: xml syntax xml prolog", () =>
  expect(
    parse(
      `
  <?xml version="1.0" encoding="UTF-8"?>
  <root></root>
`,
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

Deno.test("parse: xml syntax xml stylesheet", () =>
  expect(
    parse(
      `
  <?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet href="styles.xsl" type="text/xsl"?>
  <root></root>
`,
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

Deno.test("parse: xml syntax doctype", () =>
  expect(
    parse(
      `
  <!DOCTYPE type "quoted attribute">
  <root></root>
`,
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

Deno.test("parse: xml syntax doctype with element", () =>
  expect(
    parse(
      `
  <!DOCTYPE type "quoted attribute"
    [
      <!ELEMENT note (to,from,heading,body)>
      <!ELEMENT to (#PCDATA)>
      <!ELEMENT from (#PCDATA)>
      <!ELEMENT heading (#PCDATA)>
      <!ELEMENT body (#PCDATA)>
    ]
  >
  <root></root>
`,
    ),
  ).toEqual(
    {
      doctype: {
        "@type": true,
        "@quoted attribute": true,
        note: "to,from,heading,body",
        to: "#PCDATA",
        from: "#PCDATA",
        heading: "#PCDATA",
        body: "#PCDATA",
      },
      root: null,
    },
  ))

Deno.test("parse: xml syntax case sensitive", () =>
  expect(
    parse(`
  <root>
    <child>
      <subchild>1</subchild>
      <subchild>2</subchild>
    </child>
    <Child>
      <subchild></subchild>
      <SubChild></SubChild>
    </Child>
    <CHILD></CHILD>
  </root>
`),
  ).toEqual(
    {
      root: {
        child: {
          subchild: ["1", "2"],
        },
        Child: {
          subchild: null,
          SubChild: null,
        },
        CHILD: null,
      },
    },
  ))

Deno.test("parse: xml syntax defined entities", () =>
  expect(
    parse(`
  <root>
    &lt; &gt; &amp; &apos; &quot;
  </root>
`),
  ).toEqual(
    {
      root: `< > & ' "`,
    },
  ))

Deno.test("parse: xml syntax decimal entity reference", () =>
  expect(
    parse(`
  <root>
    &#38;
  </root>
`),
  ).toEqual(
    {
      root: "&",
    },
  ))

Deno.test("parse: xml syntax hexadecimal entity reference", () =>
  expect(
    parse(`
  <root>
    &#x26;
  </root>
`),
  ).toEqual(
    {
      root: "&",
    },
  ))

Deno.test("parse: xml syntax comments", () =>
  expect(
    parse(`
  <root>
    <!-- COMMENT 1 -->
    <child type="test" />
    <!-- COMMENT 2 -->
    <!--+++++++++++++++++++++-->
  </root>
`),
  ).toEqual(
    {
      root: {
        "#comment": ["COMMENT 1", "COMMENT 2", "+++++++++++++++++++++"],
        child: {
          "@type": "test",
          "#text": null,
        },
      },
    },
  ))

Deno.test("parse: xml syntax white spaces preserved", () =>
  expect(
    parse(`
  <root>
    Hello     world   how
are   you?
  </root>
`),
  ).toEqual(
    {
      root: `Hello     world   how
are   you?`,
    },
  ))

Deno.test("parse: xml syntax CDATA", () =>
  expect(
    parse(`
  <root>
    <script type="text/javascript"><![CDATA[function match(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }]]></script>
  </root>
`),
  ).toEqual(
    {
      root: {
        script: {
          "@type": "text/javascript",
          "#text": `function match(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }`,
        },
      },
    },
  ))

Deno.test("parse: xml syntax mixed content with CDATA", () =>
  expect(
    parse(`
  <root>
    <script type="text/javascript">this is a <b>test</b> <![CDATA[function match(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }]]></script>
  </root>
`),
  ).toEqual(
    {
      root: {
        script: {
          "@type": "text/javascript",
          "#text": `this is a <b>test</b> function match(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }`,
        },
      },
    },
  ))

Deno.test("parse: xml syntax with multiple CDATA's", () =>
  expect(
    parse(`
    <root>
      <text><![CDATA[ ]]></text>
      <text><![CDATA[ ]]></text>
    </root>`),
  ).toEqual(
    {
      root: {
        text: [
          null,
          null,
        ],
      },
    },
  ))

Deno.test("parse: xml space preserve", () =>
  expect(
    parse(`
    <root>
      <text xml:space="preserve"> hello world </text>
    </root>`),
  ).toEqual(
    {
      root: {
        text: {
          "#text": " hello world ",
          "@xml:space": "preserve",
        },
      },
    },
  ))

//Errors checks

Deno.test("parse: xml syntax unique root", () =>
  expect(() =>
    parse(`
  <root>
    <child>
      <subchild>.....</subchild>
    </child>
  </root>
  <root>
    <child>
      <subchild>.....</subchild>
    </child>
  </root>
`)
  ).toThrow(SyntaxError))

Deno.test("parse: xml syntax closing tag", () =>
  expect(() =>
    parse(`
  <root>
    <child>
  </root>
`)
  ).toThrow(SyntaxError))

Deno.test("parse: xml syntax closing properly nested", () =>
  expect(() =>
    parse(`
  <root>
    <child><subchild></child></subchild>
  </root>
`)
  ).toThrow(SyntaxError))

Deno.test("parse: xml syntax attributes quoted", () =>
  expect(() =>
    parse(`
  <root>
    <child test=hey></child>
  </root>
`)
  ).toThrow(RangeError))

Deno.test("parse: xml syntax attributes properly quoted", () =>
  expect(() =>
    parse(`
  <root>
    <child test="hey></child>
  </root>
`)
  ).toThrow(RangeError))

Deno.test("parse: xml syntax first character", () => {
  expect(() => parse(`a>1</a>`)).toThrow(SyntaxError)
  expect(() => parse(`xml`)).toThrow(SyntaxError)
  expect(() => parse(`""`)).toThrow(SyntaxError)
  expect(() => parse(`{a: 1}`)).toThrow(SyntaxError)
})

//Example below were taken from https://www.w3schools.com/xml/default.asp

Deno.test("parse: xml example w3schools.com#1", () =>
  expect(
    parse(`
  <note>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
  </note>
`),
  ).toEqual(
    {
      note: {
        to: "Tove",
        from: "Jani",
        heading: "Reminder",
        body: "Don't forget me this weekend!",
      },
    },
  ))

Deno.test("parse: xml example w3schools.com#2", () =>
  expect(
    parse(`
  <note>
    <date>2015-09-01</date>
    <hour>08:30</hour>
    <to>Tove</to>
    <from>Jani</from>
    <body>Don't forget me this weekend!</body>
  </note>
`),
  ).toEqual(
    {
      note: {
        date: "2015-09-01",
        hour: "08:30",
        to: "Tove",
        from: "Jani",
        body: "Don't forget me this weekend!",
      },
    },
  ))

Deno.test("parse: xml example w3schools.com#3", () =>
  expect(
    parse(`
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
  ).toEqual(
    {
      bookstore: {
        book: [
          {
            "@category": "cooking",
            title: { "@lang": "en", "#text": "Everyday Italian" },
            author: "Giada De Laurentiis",
            year: "2005",
            price: "30.00",
          },
          {
            "@category": "children",
            title: { "@lang": "en", "#text": "Harry Potter" },
            author: "J K. Rowling",
            year: "2005",
            price: "29.99",
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
            year: "2003",
            price: "49.99",
          },
          {
            "@category": "web",
            "@cover": "paperback",
            title: { "@lang": "en", "#text": "Learning XML" },
            author: "Erik T. Ray",
            year: "2003",
            price: "39.95",
          },
        ],
      },
    },
  ))

Deno.test("parse: xml example w3schools.com#4", () =>
  expect(
    parse(`
  <nitf>
    <head>
      <title>Colombia Earthquake</title>
    </head>
    <body>
      <headline>
        <hl1>143 Dead in Colombia Earthquake</hl1>
      </headline>
      <byline>
        <bytag>By Jared Kotler, Associated Press Writer</bytag>
      </byline>
      <dateline>
        <location>Bogota, Colombia</location>
        <date>Monday January 25 1999 7:28 ET</date>
      </dateline>
    </body>
  </nitf>
`),
  ).toEqual(
    {
      nitf: {
        head: {
          title: "Colombia Earthquake",
        },
        body: {
          headline: {
            hl1: "143 Dead in Colombia Earthquake",
          },
          byline: {
            bytag: "By Jared Kotler, Associated Press Writer",
          },
          dateline: {
            location: "Bogota, Colombia",
            date: "Monday January 25 1999 7:28 ET",
          },
        },
      },
    },
  ))

Deno.test("parse: xml example w3schools.com#5", () =>
  expect(
    parse(
      `
  <current_observation>

    <credit>NOAA's National Weather Service</credit>
    <credit_URL>http://weather.gov/</credit_URL>

    <image>
      <url>http://weather.gov/images/xml_logo.gif</url>
      <title>NOAA's National Weather Service</title>
      <link>http://weather.gov</link>
    </image>

    <location>New York/John F. Kennedy Intl Airport, NY</location>
    <station_id>KJFK</station_id>
    <latitude>40.66</latitude>
    <longitude>-73.78</longitude>
    <observation_time_rfc822>Mon, 11 Feb 2008 06:51:00 -0500 EST
    </observation_time_rfc822>

    <weather>A Few Clouds</weather>
    <temp_f>11</temp_f>
    <temp_c>-12</temp_c>
    <relative_humidity>36</relative_humidity>
    <wind_dir>West</wind_dir>
    <wind_degrees>280</wind_degrees>
    <wind_mph>18.4</wind_mph>
    <wind_gust_mph>29</wind_gust_mph>
    <pressure_mb>1023.6</pressure_mb>
    <pressure_in>30.23</pressure_in>
    <dewpoint_f>-11</dewpoint_f>
    <dewpoint_c>-24</dewpoint_c>
    <windchill_f>-7</windchill_f>
    <windchill_c>-22</windchill_c>
    <visibility_mi>10.00</visibility_mi>

    <icon_url_base>http://weather.gov/weather/images/fcicons/</icon_url_base>
    <icon_url_name>nfew.jpg</icon_url_name>
    <disclaimer_url>http://weather.gov/disclaimer.html</disclaimer_url>
    <copyright_url>http://weather.gov/disclaimer.html</copyright_url>

  </current_observation>
`,
      { reviveNumbers: true },
    ),
  ).toEqual(
    {
      current_observation: {
        credit: "NOAA's National Weather Service",
        credit_URL: "http://weather.gov/",
        image: {
          url: "http://weather.gov/images/xml_logo.gif",
          title: "NOAA's National Weather Service",
          link: "http://weather.gov",
        },
        location: "New York/John F. Kennedy Intl Airport, NY",
        station_id: "KJFK",
        latitude: 40.66,
        longitude: -73.78,
        observation_time_rfc822: "Mon, 11 Feb 2008 06:51:00 -0500 EST",
        weather: "A Few Clouds",
        temp_f: 11,
        temp_c: -12,
        relative_humidity: 36,
        wind_dir: "West",
        wind_degrees: 280,
        wind_mph: 18.4,
        wind_gust_mph: 29,
        pressure_mb: 1023.6,
        pressure_in: 30.23,
        dewpoint_f: -11,
        dewpoint_c: -24,
        windchill_f: -7,
        windchill_c: -22,
        visibility_mi: 10.00,
        icon_url_base: "http://weather.gov/weather/images/fcicons/",
        icon_url_name: "nfew.jpg",
        disclaimer_url: "http://weather.gov/disclaimer.html",
        copyright_url: "http://weather.gov/disclaimer.html",
      },
    },
  ))

Deno.test("parse: xml example w3schools.com#6", () =>
  expect(
    parse(`
  <breakfast_menu>
    <food>
        <name>Belgian Waffles</name>
        <price>$5.95</price>
        <description>
        Two of our famous Belgian Waffles with plenty of real maple syrup
        </description>
        <calories>650</calories>
    </food>
    <food>
        <name>Strawberry Belgian Waffles</name>
        <price>$7.95</price>
        <description>
        Light Belgian waffles covered with strawberries and whipped cream
        </description>
        <calories>900</calories>
    </food>
    <food>
        <name>Berry-Berry Belgian Waffles</name>
        <price>$8.95</price>
        <description>
        Belgian waffles covered with assorted fresh berries and whipped cream
        </description>
        <calories>900</calories>
    </food>
    <food>
        <name>French Toast</name>
        <price>$4.50</price>
        <description>
        Thick slices made from our homemade sourdough bread
        </description>
        <calories>600</calories>
    </food>
    <food>
        <name>Homestyle Breakfast</name>
        <price>$6.95</price>
        <description>
        Two eggs, bacon or sausage, toast, and our ever-popular hash browns
        </description>
        <calories>950</calories>
    </food>
  </breakfast_menu>
`),
  ).toEqual(
    {
      breakfast_menu: {
        food: [
          {
            name: "Belgian Waffles",
            price: "$5.95",
            description: "Two of our famous Belgian Waffles with plenty of real maple syrup",
            calories: "650",
          },
          {
            name: "Strawberry Belgian Waffles",
            price: "$7.95",
            description: "Light Belgian waffles covered with strawberries and whipped cream",
            calories: "900",
          },
          {
            name: "Berry-Berry Belgian Waffles",
            price: "$8.95",
            description: "Belgian waffles covered with assorted fresh berries and whipped cream",
            calories: "900",
          },
          {
            name: "French Toast",
            price: "$4.50",
            description: "Thick slices made from our homemade sourdough bread",
            calories: "600",
          },
          {
            name: "Homestyle Breakfast",
            price: "$6.95",
            description: "Two eggs, bacon or sausage, toast, and our ever-popular hash browns",
            calories: "950",
          },
        ],
      },
    },
  ))

// Parser options

Deno.test("parse: xml parser option progress", () => {
  const progress = fn() as ParserOptions["progress"]
  parse(
    `<root></root>`,
    {
      progress,
    },
  ), {
    root: null,
  }, expect(progress).toBeCalled()
})

Deno.test("parse: xml parser option debug", () => {
  const debug = console.debug
  Object.assign(console, { debug: fn() })

  parse(
    `<root></root>`,
    { debug: true },
  ), {
    root: null,
  }, expect(console.debug).toBeCalled()
  console.debug = debug
})

Deno.test("parse: xml parser option no flatten", () =>
  expect(
    parse(
      `
<root>
  <child>
    <grand-child></grand-child>
  </child>
</root>
`,
      { flatten: false },
    ),
  ).toEqual(
    {
      root: {
        child: {
          "grand-child": {
            "#text": null,
          },
        },
      },
    },
  ))

Deno.test("parse: xml parser option revive", () =>
  expect(
    parse(
      `
  <root>
    <empty></empty>
    <number>1</number>
    <number_negative>-1</number_negative>
    <number_hex>0xAC</number_hex>
    <number_octal>0o667</number_octal>
    <boolean>true</boolean>
  </root>
`,
      { reviveBooleans: true, reviveNumbers: true },
    ),
  ).toEqual(
    {
      root: {
        empty: null,
        number: 1,
        number_negative: -1,
        number_hex: 0xac,
        number_octal: 0o667,
        boolean: true,
      },
    },
  ))

Deno.test("parse: xml parser option no-revive", () =>
  expect(
    parse(
      `
  <root>
    <empty></empty>
    <number>1</number>
    <number_negative>-1</number_negative>
    <number_hex>0xac</number_hex>
    <number_octal>0o667</number_octal>
    <boolean>true</boolean>
  </root>
`,
      { reviveBooleans: false, reviveNumbers: false, emptyToNull: false },
    ),
  ).toEqual(
    {
      root: {
        empty: "",
        number: "1",
        number_negative: "-1",
        number_hex: "0xac",
        number_octal: "0o667",
        boolean: "true",
      },
    },
  ))

Deno.test("parse: xml parser reviver", () =>
  expect(
    parse(
      `
  <root>
    <not>true</not>
    <delete/>
  </root>
`,
      {
        reviver({ tag, value }) {
          if (tag === "not") {
            return !value
          }
          if (tag === "delete") {
            return undefined
          }
          return value
        },
      },
    ),
  ).toEqual(
    {
      root: {
        not: false,
      },
    },
  ))

Deno.test("parse: xml parser reviver (properties are accessibles except within attributes)", () =>
  expect(
    parse(
      `
  <root>
    <child attr="test">true</child>
  </root>
`,
      {
        reviver({ properties }) {
          return `${properties}`
        },
      },
    ),
  ).toEqual(
    {
      root: {
        child: {
          "#text": "[object Object]",
          "@attr": "null",
        },
      },
    },
  ))

Deno.test("parse: xml parser reviver (tag node can be edited)", () =>
  expect(
    parse(
      `
  <root>
    <x2>10</x2>
    <x4 fp="1">10</x4>
    <x6 fp="2">10</x6>
  </root>
`,
      {
        reviver({ key, tag, value, properties }) {
          if ((/^x\d+$/.test(tag)) && (key === "#text")) {
            delete this["@fp"]
            return ((value as number) *
              (Number(tag.match(/(?<x>\d+)/)?.groups?.x) ?? 1)).toFixed(
                Number(properties?.["@fp"]) ?? 1,
              )
          }
          return value
        },
      },
    ),
  ).toEqual(
    {
      root: {
        x2: "20",
        x4: "40.0",
        x6: "60.00",
      },
    },
  ))

// Metadata

Deno.test("parse: xml parser option metadata", () => {
  const xml = parse(
    `
  <root>
    <child>
      <grand-child></grand-child>
    </child>
    <sibling>A</sibling>
    <sibling>B</sibling>
    <sibling>C</sibling>
    <sibling>D</sibling>
  </root>
  `,
    { flatten: false },
  ) as test

  expect(xml.root?.child?.["grand-child"]?.[$XML]?.parent).toEqual(xml.root.child)
  expect(xml.root?.child?.["grand-child"]?.[$XML]?.name).toBe("grand-child")
  expect(xml.root?.child?.[$XML]?.parent).toEqual(xml.root)
  expect(xml.root?.child?.[$XML]?.name).toBe("child")
  expect(xml.root?.[$XML]?.parent).toBeNull()
  expect(xml.root?.[$XML]?.name).toBe("root")
  expect(xml.root?.sibling?.[$XML]?.parent).toEqual(xml.root)
  expect(xml.root?.sibling?.[$XML]?.name).toBe("sibling")
})
