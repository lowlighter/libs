//Imports
import { Parser } from "./utils/parser.ts";
import type { ParserOptions } from "./utils/parser.ts";
import { Stream } from "./utils/stream.ts";
import { Streamable } from "./utils/streamable.ts";
import type { Flux } from "./utils/types.ts";

//Debug mode
const debug = !!new URL(import.meta.url).searchParams.get("debug");

/** XML parser */
export function parse(content: string | Flux, options?: ParserOptions) {
  if (typeof content === "string") {
    content = new Streamable(content);
  }
  return new Parser(new Stream(content), { debug, options }).parse();
}
