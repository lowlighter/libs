import { bundle } from "@libs/bundle/wasm"
await bundle("wasm_xml_parser", { cwd: import.meta.dirname!, banner: "https://github.com/lowlighter/libs" })
