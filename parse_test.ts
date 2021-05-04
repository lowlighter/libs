
import { parse } from "./mod.ts"
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";

Deno.test("simple xml", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>world</hello>
`), {
  hello:"world"
}))

Deno.test("simple xml with self-closing tag", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <world/>
  </hello>
`), {
  hello:{
    world:null
  }
}))

Deno.test("simple xml with self-closing tag and attributes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <world runtime="deno"/>
  </hello>
`), {
  hello:{
    world:{
      "@runtime":"deno"
    }
  }
}))

Deno.test("simple xml with empty tag", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <world></world>
  </hello>
`), {
  hello:{
    world:null
  }
}))

Deno.test("simple xml with empty tag and attributes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <world runtime="deno"></world>
  </hello>
`), {
  hello:{
    world:{
      $:null,
      "@runtime":"deno"
    }
  }
}))

Deno.test("simple xml with attributes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello lang="en" charset="utf8">world</hello>
`), {
  hello:{
    "@lang":"en",
    "@charset":"utf8",
    $:"world",
  }
}))

Deno.test("simple xml with child nodes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <text>world</text>
    <text>monde</text>
    <text>世界</text>
    <text>🌏</text>
  </hello>
`), {
  hello:{
    text:["world", "monde", "世界", "🌏"]
  }
}))

Deno.test("simple xml with child nodes and attributes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <text lang="en">world</text>
    <text lang="fr">monde</text>
    <text lang="zh">世界</text>
    <text lang="🦕">🌏</text>
  </hello>
`), {
  hello:{
    text:[
      {"@lang":"en", $:"world"},
      {"@lang":"fr", $:"monde"},
      {"@lang":"zh", $:"世界"},
      {"@lang":"🦕", $:"🌏"},
    ]
  }
}))

Deno.test("simple xml with mixed child nodes", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <mail>
    <from>Alice</from>
    <to>Bob</to>
    <object>A Method for Obtaining Digital Signatures and Public-key Cryptosystems</object>
    <text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</text>
  </mail>
`), {
  mail:{
    from:"Alice",
    to:"Bob",
    object:"A Method for Obtaining Digital Signatures and Public-key Cryptosystems",
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor."
  }
}))

Deno.test("simple xml with comments", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <hello>
    <!-- IGNORE ME -->
    <world />
    <!-- IGNORE ME -->
  </hello>
`), {
  hello:{
    world:null
  }
}))

Deno.test("simple xml with CDATA", () => assertEquals(parse(`
  <?xml version="1.0" encoding="UTF-8"?>
  <test>
    <script type="text/javascript"><![CDATA[function matchwo(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }]]></script>
  </test>
`), {
  test:{
    script:{
      "@type":"text/javascript",
      $:`function matchwo(a,b) {
      if (a < b && a < 0) { return 1; }
      else { return 0; }
  }`
}
  }
}))
