//Imports
import { Stream } from "./stream.ts";

/** Parser options */
export type ParserOptions = {
  reviveBooleans?: boolean;
  reviveNumbers?: boolean;
  emptyToNull?: boolean;
};

/**
 * XML parser helper
 */
export class Parser {
  /** Constructor */
  constructor(
    stream: Stream,
    { debug = false, options = {} as ParserOptions } = {},
  ) {
    this.#stream = stream;
    this.#options = options;
    this.debug = debug;
  }

  /** Parse text stream */
  parse() {
    return this.#node({ path: [] });
  }

  /** Text stream */
  readonly #stream: Stream;

  /** Parser options */
  readonly #options: ParserOptions;

  /** Debug mode */
  debug: boolean;

  /** Debugger */
  #debug(path: string[], string: string) {
    if (this.debug) {
      console.debug(`${path.join(" > ")} | ${string}`.trim());
    }
  }

  /** Node parser */
  #node({ path }: { path: string[] }) {
    this.#stream.trim();

    if (this.#stream.peek(5) === "<?xml") {
      this.#prolog({ path });
    }

    if (this.#stream.peek(4) === "<!--") {
      return this.#comment({ path });
    }
    return this.#tag({ path });
  }

  /** Prolog parser */
  #prolog({ path }: { path: string[] }) {
    this.#debug(path, "parsing prolog");
    const prolog = {};
    this.#stream.consume({ content: "<?xml" });

    //Tag attributes
    this.#stream.trim();
    while (!/\/?>/.test(this.#stream.peek(2))) {
      Object.assign(prolog, this.#attribute({ path: [...path, "xml"] }));
    }

    //Result
    this.#stream.consume({ content: "?>" });
    this.#stream.trim();
    return { xml: prolog };
  }

  /** Tag parser */
  #tag({ path }: { path: string[] }) {
    this.#debug(path, "parsing tag");
    const tag = {} as { [key: PropertyKey]: unknown };

    //Tag name
    this.#stream.consume({ content: "<" });
    const name = this.#stream.capture({ until: /[\s\/>]/, bytes: 1 });
    this.#debug(path, `found tag ${name}`);

    //Tag attributes
    this.#stream.trim();
    while (!/\/?>/.test(this.#stream.peek(2))) {
      Object.assign(tag, this.#attribute({ path: [...path, name] }));
    }

    //Self-closed tag
    const selfclosed = (this.#stream.peek() === "/");
    if (selfclosed) {
      this.#debug(path, `tag ${name} is self-closed`);
      this.#stream.consume({ content: "/" });
    }
    this.#stream.consume({ content: ">" });

    //Pair-closed tag
    if (!selfclosed) {
      //Text node
      this.#stream.trim();
      if (this.#stream.peek() !== "<") {
        Object.assign(tag, this.#text({ path: [...path, name] }));
      } //Child nodes
      else {
        while (!/<\//.test(this.#stream.peek(2))) {
          const child = this.#node({ path: [...path, name] });
          const [key, value] = Object.entries(child).shift()!;
          if (Array.isArray(tag[key])) {
            (tag[key] as unknown[]).push(value);
          } else if (tag[key]) {
            tag[key] = [tag[key], value];
          } else {
            Object.assign(tag, child);
          }
        }
      }

      //Closing tag
      this.#stream.consume({ content: "</" });
      this.#stream.consume({ content: name });
      this.#stream.consume({ content: ">" });
      this.#debug(path, `found closing tag for ${name}`);
    }

    //Result
    this.#stream.trim();
    if ((Object.keys(tag).includes("$")) && (Object.keys(tag).length === 1)) {
      return { [name]: tag.$ };
    }
    if (!Object.keys(tag).length) {
      return { [name]: null };
    }
    return { [name]: tag };
  }

  /** Attribute parser */
  #attribute({ path }: { path: string[] }) {
    this.#debug(path, `parsing attribute`);

    //Attribute name
    const attribute = this.#stream.capture({ until: /=/, bytes: 1 });
    this.#debug(path, `found attribute ${attribute}`);

    //Attribute value
    this.#stream.consume({ content: "=" });
    const quote = this.#stream.peek();
    this.#stream.consume({ content: quote });
    const value = this.#stream.capture({
      until: new RegExp(`(?<!\\\\)${quote}`),
      bytes: 1,
    });
    this.#stream.consume({ content: quote });
    this.#debug(path, `found value ${value}`);

    //Result
    this.#stream.trim();
    return { [`$${attribute}`]: this.#revive({ value }) };
  }

  /** Text node parser */
  #text({ path }: { path: string[] }) {
    this.#debug(path, `parsing text node`);
    const text = this.#stream.capture({ until: /</, bytes: 1 }).trim();
    return { $: this.#revive({ value: text }) };
  }

  /** Comment node parser */
  #comment({ path }: { path: string[] }) {
    this.#debug(path, `parsing comment node`);
    this.#stream.consume({ content: "<!--" });
    const comment = this.#stream.capture({ until: /(?<!-)-->/, bytes: 4 });
    this.#stream.consume({ content: "-->" });
    return { ["#comment"]: comment };
  }

  /** CDATA node parser */
  #cdata({ path }: { path: string[] }) {
    this.#debug(path, `parsing comment node`);
    this.#stream.consume({ content: "<![CDATA[" });
    const data = this.#stream.capture({ until: /\]\]>/, bytes: 3 });
    this.#stream.consume({ content: "]]>" });
    return data;
  }

  /** Reviver */
  #revive({ value }: { value: string }) {
    switch (true) {
      //Convert empty values to null
      case (this.#options.emptyToNull ?? true) && /^\s*$/.test(value):
        return null;
      //Revive booleans
      case (this.#options.reviveBooleans ?? true) &&
        /^(?:true|false)$/i.test(value):
        return /^true$/i.test(value);
      //Revive numbers
      case (this.#options.reviveNumbers ?? true) &&
        Number.isFinite(Number(value)):
        return Number.parseFloat(value);
      //Unescape XML entities
      default:
        return value;
    }
  }
}
