import { bundle } from "jsr:@libs/bundle@3.0.1/wasm"
await bundle("wasm_xml_parser", { cwd: import.meta.dirname!, banner: "https://github.com/lowlighter/libs" })
