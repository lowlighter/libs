import { parse } from "./mod.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.95.0/testing/asserts.ts";

Deno.test("xml syntax tag", () =>
  assertEquals(
    parse(`
  <root>hello world</root>
`),
    {
      root: "hello world",
    },
  ));

Deno.test("xml syntax tag with attributes", () =>
  assertEquals(
    parse(`
  <root lang="en" type="greeting">hello world</root>
`),
    {
      root: {
        "@lang": "en",
        "@type": "greeting",
        $: "hello world",
      },
    },
  ));

Deno.test("xml syntax self-closing tag", () =>
  assertEquals(
    parse(`
  <root/>
`),
    {
      root: null,
    },
  ));

Deno.test("xml syntax self-closing with attributes", () =>
  assertEquals(
    parse(`
  <root lang="en" type="greeting" text="hello world"></root>
`),
    {
      root: {
        $: null,
        "@lang": "en",
        "@type": "greeting",
        "@text": "hello world",
      },
    },
  ));

Deno.test("xml syntax empty tag", () =>
  assertEquals(
    parse(`
  <root></root>
`),
    {
      root: null,
    },
  ));

Deno.test("xml syntax empty tag with attributes", () =>
  assertEquals(
    parse(`
  <root type="test"></root>
`),
    {
      root: {
        $: null,
        "@type": "test",
      },
    },
  ));

Deno.test("xml syntax simple tree", () =>
  assertEquals(
    parse(`
  <root>
    <child>
      <subchild>.....</subchild>
    </child>
  </root>
`),
    {
      root: {
        child: {
          subchild: ".....",
        },
      },
    },
  ));

Deno.test("xml syntax simple tree with same tags", () =>
  assertEquals(
    parse(`
  <root>
    <child>world</child>
    <child>monde</child>
    <child>世界</child>
    <child>🌏</child>
  </root>
`),
    {
      root: {
        child: ["world", "monde", "世界", "🌏"],
      },
    },
  ));

Deno.test("xml syntax simple tree with same tags and attributes", () =>
  assertEquals(
    parse(`
  <root>
    <child lang="en">world</child>
    <child lang="fr">monde</child>
    <child lang="zh">世界</child>
    <child lang="🦕">🌏</child>
  </root>
`),
    {
      root: {
        child: [
          { "@lang": "en", $: "world" },
          { "@lang": "fr", $: "monde" },
          { "@lang": "zh", $: "世界" },
          { "@lang": "🦕", $: "🌏" },
        ],
      },
    },
  ));

Deno.test("xml syntax simple tree with nested tags of same name", () =>
  assertEquals(
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
    {
      root: {
        child: { child: { child: { child: null } } },
      },
    },
  ));

Deno.test("xml syntax mixed content", () =>
  assertEquals(
    parse(`
  <root>some <b>bold</b> text</root>
`),
    {
      root: {
        b: "bold",
      },
    },
  ));

Deno.test("xml syntax nested mixed content", () =>
  assertEquals(
    parse(`
  <root>some <b>bold <i>italic</i> </b> text</root>
`),
    {
      root: {
        b: {
          i: "italic",
        },
      },
    },
  ));

Deno.test("xml syntax xml prolog", () =>
  assertEquals(
    parse(
      `
  <?xml version="1.0" encoding="UTF-8"?>
  <root></root>
`,
      { includeDeclaration: true },
    ),
    {
      "@version": 1,
      "@encoding": "UTF-8",
      root: null,
    },
  ));

Deno.test("xml syntax doctype", () =>
  assertEquals(
    parse(
      `
  <!DOCTYPE type "quoted attribute">
  <root></root>
`,
      { includeDoctype: true },
    ),
    {
      $doctype: {
        "@type": true,
        "@quoted attribute": true,
      },
      root: null,
    },
  ));

Deno.test("xml syntax doctype with element", () =>
  assertEquals(
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
      { includeDoctype: true },
    ),
    {
      $doctype: {
        "@type": true,
        "@quoted attribute": true,
        note: "(to,from,heading,body)",
        to: "(#PCDATA)",
        from: "(#PCDATA)",
        heading: "(#PCDATA)",
        body: "(#PCDATA)",
      },
      root: null,
    },
  ));

Deno.test("xml syntax case sensitive", () =>
  assertEquals(
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
    {
      root: {
        child: {
          subchild: [1, 2],
        },
        Child: {
          subchild: null,
          SubChild: null,
        },
        CHILD: null,
      },
    },
  ));

Deno.test("xml syntax defined entities", () =>
  assertEquals(
    parse(`
  <root>
    &lt; &gt; &amp; &apos; &quot;
  </root>
`),
    {
      root: `< > & ' "`,
    },
  ));

Deno.test("xml syntax decimal entity reference", () =>
  assertEquals(
    parse(`
  <root>
    &#38;
  </root>
`),
    {
      root: "&",
    },
  ));

Deno.test("xml syntax hexadecimal entity reference", () =>
  assertEquals(
    parse(`
  <root>
    &#x26;
  </root>
`),
    {
      root: "&",
    },
  ));

Deno.test("xml syntax comments", () =>
  assertEquals(
    parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    <!-- IGNORE ME -->
    <child type="test" />
    <!-- IGNORE ME -->
  </root>
`),
    {
      root: {
        child: {
          "@type": "test",
          $: null,
        },
      },
    },
  ));

Deno.test("xml syntax white spaces preserved", () =>
  assertEquals(
    parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    Hello     world   how
are   you?
  </root>
`),
    {
      root: `Hello     world   how
are   you?`,
    },
  ));

Deno.test("xml syntax CDATA", () =>
  assertEquals(
    parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    <script type="text/javascript"><![CDATA[function matchwo(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }]]></script>
  </root>
`),
    {
      root: {
        script: {
          "@type": "text/javascript",
          $: `function matchwo(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }`,
        },
      },
    },
  ));

Deno.test("xml syntax mixed content with CDATA", () =>
  assertEquals(
    parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    <script type="text/javascript">this is a <b>test</b> <![CDATA[function matchwo(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }]]></script>
  </root>
`),
    {
      root: {
        script: {
          "@type": "text/javascript",
          b: "test",
        },
      },
    },
  ));

//Errors checks

Deno.test("xml syntax unique root", () =>
  void assertThrows(() =>
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
  ));

Deno.test("xml syntax closing tag", () =>
  void assertThrows(() =>
    parse(`
  <root>
    <child>
  </root>
`)
  ));

Deno.test("xml syntax closing properly nested", () =>
  void assertThrows(() =>
    parse(`
  <root>
    <child><subchild></child></subchild>
  </root>
`)
  ));

Deno.test("xml syntax attributes quoted", () =>
  void assertThrows(() =>
    parse(`
  <root>
    <child test=hey></child>
  </root>
`)
  ));

Deno.test("xml syntax attributes properly quoted", () =>
  void assertThrows(() =>
    parse(`
  <root>
    <child test="hey></child>
  </root>
`)
  ));

//Example below were taken from https://www.w3schools.com/xml/default.asp

Deno.test("xml example w3schools.com#1", () =>
  assertEquals(
    parse(`
  <note>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
  </note>
`),
    {
      note: {
        to: "Tove",
        from: "Jani",
        heading: "Reminder",
        body: "Don't forget me this weekend!",
      },
    },
  ));

Deno.test("xml example w3schools.com#2", () =>
  assertEquals(
    parse(`
  <note>
    <date>2015-09-01</date>
    <hour>08:30</hour>
    <to>Tove</to>
    <from>Jani</from>
    <body>Don't forget me this weekend!</body>
  </note>
`),
    {
      note: {
        date: "2015-09-01",
        hour: "08:30",
        to: "Tove",
        from: "Jani",
        body: "Don't forget me this weekend!",
      },
    },
  ));

Deno.test("xml example w3schools.com#3", () =>
  assertEquals(
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
    {
      bookstore: {
        book: [
          {
            "@category": "cooking",
            title: { "@lang": "en", $: "Everyday Italian" },
            author: "Giada De Laurentiis",
            year: 2005,
            price: 30,
          },
          {
            "@category": "children",
            title: { "@lang": "en", $: "Harry Potter" },
            author: "J K. Rowling",
            year: 2005,
            price: 29.99,
          },
          {
            "@category": "web",
            title: { "@lang": "en", $: "XQuery Kick Start" },
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
            title: { "@lang": "en", $: "Learning XML" },
            author: "Erik T. Ray",
            year: 2003,
            price: 39.95,
          },
        ],
      },
    },
  ));

Deno.test("xml example w3schools.com#4", () =>
  assertEquals(
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
  ));

Deno.test("xml example w3schools.com#5", () =>
  assertEquals(
    parse(`
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
`),
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
  ));

Deno.test("xml example w3schools.com#6", () =>
  assertEquals(
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
    {
      breakfast_menu: {
        food: [
          {
            name: "Belgian Waffles",
            price: "$5.95",
            description:
              "Two of our famous Belgian Waffles with plenty of real maple syrup",
            calories: 650,
          },
          {
            name: "Strawberry Belgian Waffles",
            price: "$7.95",
            description:
              "Light Belgian waffles covered with strawberries and whipped cream",
            calories: 900,
          },
          {
            name: "Berry-Berry Belgian Waffles",
            price: "$8.95",
            description:
              "Belgian waffles covered with assorted fresh berries and whipped cream",
            calories: 900,
          },
          {
            name: "French Toast",
            price: "$4.50",
            description: "Thick slices made from our homemade sourdough bread",
            calories: 600,
          },
          {
            name: "Homestyle Breakfast",
            price: "$6.95",
            description:
              "Two eggs, bacon or sausage, toast, and our ever-popular hash browns",
            calories: 950,
          },
        ],
      },
    },
  ));

// Parser options

Deno.test("xml parser option revive", () =>
  assertEquals(
    parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    <empty></empty>
    <number>1</number>
    <number_negative>-1</number_negative>
    <boolean>true</boolean>
  </root>
`),
    {
      root: {
        empty: null,
        number: 1,
        number_negative: -1,
        boolean: true,
      },
    },
  ));

Deno.test("xml parser option no-revive", () =>
  assertEquals(
    parse(
      `
  <?xml version="1.0" encoding="UTF-8"?>
  <root>
    <empty></empty>
    <number>1</number>
    <number_negative>-1</number_negative>
    <boolean>true</boolean>
  </root>
`,
      { reviveBooleans: false, reviveNumbers: false, emptyToNull: false },
    ),
    {
      root: {
        empty: "",
        number: "1",
        number_negative: "-1",
        boolean: "true",
      },
    },
  ));
