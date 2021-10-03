//Imports
import { Stream } from "./stream.ts";

/** Parser options */
export type ParserOptions = {
  reviveBooleans?: boolean;
  reviveNumbers?: boolean;
  emptyToNull?: boolean;
  debug?: boolean;
  progress?: (bytes: number) => void;
};

/**
 * XML parser helper
 */
export class Parser {
  /** Constructor */
  constructor(stream: Stream, options: ParserOptions = {}) {
    this.#stream = stream;
    this.#options = options;
  }

  /** Parse text stream */
  parse() {
    const xml = this.#document();
    try {
      this.#stream.peek();
    } catch (error) {
      if (error instanceof Deno.errors.UnexpectedEof) {
        return xml;
      }
    }
    throw new SyntaxError(
      "XML documents should only have a single root element",
    );
  }

  /** Parser options */
  readonly #options: ParserOptions;

  /** Debugger */
  #debug(path: string[], string: string) {
    if (this.#options.debug) {
      console.debug(`${path.join(" > ")} | ${string}`.trim());
    }
  }

  #document() {
    const document = {};
    const path = ["document"];
    this.#trim();

    if (this.#peek(Parser.tokens.prolog.start)) {
      Object.assign(document, this.#prolog({ path }));
    }
    if (this.#peek(Parser.tokens.doctype.start)) {
      Object.assign(document, this.#doctype({ path }));
    }

    Object.assign(document, this.#node({ path }));
    this.#trim();

    return document;
  }

  /** Node parser */
  #node({ path }: { path: string[] }) {
    if (this.#options.progress) {
      this.#options.progress(this.#stream.cursor);
    }
    if (this.#peek(Parser.tokens.comment.start)) {
      return { [Parser.schema.comment]: this.#comment({ path }) };
    }
    return this.#tag({ path });
  }

  /** Prolog parser */
  #prolog({ path }: { path: string[] }) {
    this.#debug(path, "parsing prolog");
    const prolog = {};
    this.#consume(Parser.tokens.prolog.start);

    //Tag attributes
    while (!/\/?>/.test(this.#stream.peek(2))) {
      Object.assign(prolog, this.#attribute({ path: [...path, "prolog"] }));
    }

    //Result
    this.#consume(Parser.tokens.prolog.end);
    return { xml: prolog };
  }

  /** Doctype parser */
  #doctype({ path }: { path: string[] }) {
    this.#debug(path, "parsing doctype");
    const doctype = {};
    this.#consume(Parser.tokens.doctype.start);

    //Tag attributes
    while (!this.#peek(Parser.tokens.doctype.end)) {
      if (this.#peek(Parser.tokens.doctype.elements.start)) {
        this.#consume(Parser.tokens.doctype.elements.start);
        while (!this.#peek(Parser.tokens.doctype.elements.end)) {
          Object.assign(
            doctype,
            this.#doctypeElement({ path: [...path, "doctype"] }),
          );
        }
        this.#consume(Parser.tokens.doctype.elements.end);
      } else {
        Object.assign(doctype, this.#property({ path: [...path, "doctype"] }));
      }
    }

    //Result
    this.#stream.consume({ content: ">" });
    return { doctype };
  }

  /** Doctype element parser */
  #doctypeElement({ path }: { path: string[] }) {
    this.#debug(path, "parsing doctype element");

    //Element name
    this.#consume(Parser.tokens.doctype.element.start);
    const element = Object.keys(this.#property({ path: [...path, "doctype"] }))
      .shift()!.substring(Parser.schema.property.prefix.length);
    this.#debug(path, `found doctype element "${element}"`);

    //Element value
    this.#consume(Parser.tokens.doctype.element.value.start);
    const value = this.#capture(Parser.tokens.doctype.element.value.regex.end);
    this.#consume(Parser.tokens.doctype.element.value.end);
    this.#debug(path, `found doctype element value "${value}"`);

    //Result
    this.#consume(Parser.tokens.doctype.element.end);
    return { [element]: value };
  }

  /** Tag parser */
  #tag({ path }: { path: string[] }) {
    this.#debug(path, "parsing tag");
    const tag = {} as { [key: PropertyKey]: unknown };

    //Tag name
    this.#consume(Parser.tokens.tag.start);
    const name = this.#capture(Parser.tokens.tag.regex.name);
    this.#debug(path, `found tag "${name}"`);

    //Tag attributes
    while (!/\/?>/.test(this.#stream.peek(2))) {
      Object.assign(tag, this.#attribute({ path: [...path, name] }));
    }

    //Self-closed tag
    const selfclosed = this.#peek(Parser.tokens.tag.close.self);
    if (selfclosed) {
      this.#debug(path, `tag "${name}" is self-closed`);
      this.#consume(Parser.tokens.tag.close.self);
    }
    this.#consume(Parser.tokens.tag.end);

    //Pair-closed tag
    if (!selfclosed) {
      //Text node
      if (
        (this.#peek(Parser.tokens.cdata.start)) ||
        (!this.#peek(Parser.tokens.tag.start))
      ) {
        Object.assign(tag, this.#text({ close: name, path: [...path, name] }));
      } //Child nodes
      else {
        while (!/<\//.test(this.#stream.peek(2))) {
          const child = this.#node({ path: [...path, name] });
          const [key, value] = Object.entries(child).shift()!;
          if (Array.isArray(tag[key])) {
            (tag[key] as unknown[]).push(value);
            this.#debug([...path, name], `add new child "${key}" to array`);
          } else if (key in tag) {
            tag[key] = [tag[key], value];
            this.#debug(
              [...path, name],
              `multiple children named "${key}", using array notation`,
            );
          } else {
            Object.assign(tag, child);
            this.#debug([...path, name], `add new child "${key}"`);
          }
        }
      }

      //Closing tag
      this.#consume(Parser.tokens.tag.close.start);
      this.#consume(name);
      this.#consume(Parser.tokens.tag.close.end);
      this.#debug(path, `found closing tag for "${name}"`);
    }

    //Result
    if (!Object.keys(tag).includes(Parser.schema.text)) {
      const children = Object.keys(tag).filter((key) =>
        (!key.startsWith(Parser.schema.attribute.prefix)) &&
        (key !== Parser.schema.text)
      );
      if (!children.length) {
        this.#debug(
          path,
          `tag "${name}" has implictely obtained a text node as it has no children but has attributes`,
        );
        tag[Parser.schema.text] = this.#revive({ value: "" });
      }
    }
    if (
      (Object.keys(tag).includes(Parser.schema.text)) &&
      (Object.keys(tag).length === 1)
    ) {
      this.#debug(
        path,
        `tag "${name}" has been implicitely flattened as it only has a text node`,
      );
      return { [name]: tag[Parser.schema.text] };
    }
    return { [name]: tag };
  }

  /** Attribute parser */
  #attribute({ path }: { path: string[] }) {
    this.#debug(path, "parsing attribute");

    //Attribute name
    const attribute = this.#capture(Parser.tokens.tag.attribute.regex.name);
    this.#debug(path, `found attribute "${attribute}"`);

    //Attribute value
    this.#consume("=");
    const quote = this.#stream.peek();
    this.#consume(quote);
    const value = this.#capture({
      until: new RegExp(quote),
      bytes: quote.length,
    });
    this.#consume(quote);
    this.#debug(path, `found attribute value "${value}"`);

    //Result
    return {
      [`${Parser.schema.attribute.prefix}${attribute}`]: this.#revive({
        value,
      }),
    };
  }

  /** Property parser */
  #property({ path }: { path: string[] }) {
    this.#debug(path, "parsing property");

    //Property name
    const quote = this.#stream.peek();
    const delimiter = /["']/.test(quote) ? quote : " ";
    if (delimiter.trim().length) {
      this.#consume(delimiter);
    }
    const property = this.#capture({
      until: new RegExp(delimiter),
      bytes: delimiter.length,
    });
    this.#debug(path, `found property ${property}`);
    if (delimiter.trim().length) {
      this.#consume(delimiter);
    }

    //Result
    return { [`${Parser.schema.property.prefix}${property}`]: true };
  }

  /** Text parser */
  #text({ close, path }: { close: string; path: string[] }) {
    this.#debug(path, "parsing text");
    let text = "";
    const comments = [];

    //Content
    while (
      (this.#peek(Parser.tokens.cdata.start)) ||
      (!this.#peeks([
        Parser.tokens.tag.close.start,
        close,
        Parser.tokens.tag.close.end,
      ]))
    ) {
      //CDATA
      if (this.#peek(Parser.tokens.cdata.start)) {
        text += this.#cdata({ path: [...path, "#text"] });
      } //Comments
      else if (this.#peek(Parser.tokens.comment.start)) {
        comments.push(this.#comment({ path: [...path, "#text"] }));
      } //Raw text
      else {
        text += this.#capture(Parser.tokens.text.regex.end);
        if (
          (this.#peek(Parser.tokens.cdata.start)) ||
          (this.#peek(Parser.tokens.comment.start))
        ) {
          continue;
        }
        if (
          !this.#peeks([
            Parser.tokens.tag.close.start,
            close,
            Parser.tokens.tag.close.end,
          ])
        ) {
          text += Parser.tokens.tag.close.start;
          this.#consume(Parser.tokens.tag.close.start);
        }
      }
    }
    this.#debug(path, `parsed text "${text}"`);
    if (comments.length) {
      this.#debug(path, `parsed comments ${JSON.stringify(comments)}`);
    }

    //Result
    return {
      [Parser.schema.text]: this.#revive({ value: text.trim() }),
      ...(comments.length ? { [Parser.schema.comment]: comments } : {}),
    };
  }

  /** CDATA parser */
  #cdata({ path }: { path: string[] }) {
    this.#debug(path, "parsing cdata");
    this.#consume(Parser.tokens.cdata.start);
    const data = this.#capture(Parser.tokens.cdata.regex.end);
    this.#consume(Parser.tokens.cdata.end);
    return data;
  }

  /** Comment parser */
  #comment({ path }: { path: string[] }) {
    this.#debug(path, "parsing comment");
    this.#consume(Parser.tokens.comment.start);
    const comment = this.#capture(Parser.tokens.comment.regex.end);
    this.#consume(Parser.tokens.comment.end);
    return comment;
  }

  //================================================================================

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
        value = value.replace(
          /&#(?<hex>x?)(?<code>\d+);/g,
          (_, hex, code) => String.fromCharCode(parseInt(code, hex ? 16 : 10)),
        );
        for (const [entity, character] of Object.entries(Parser.entities)) {
          value = value.replaceAll(entity, character);
        }
        return value;
    }
  }

  //================================================================================

  /** Text stream */
  readonly #stream: Stream;

  /** Peek and validate against token */
  #peek(token: string) {
    return this.#stream.peek(token.length) === token;
  }

  /** Peek and validate against tokens */
  #peeks(tokens: string[]) {
    let offset = 0;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      while (true) {
        //Ignore whitespaces
        if (/\s/.test(this.#stream.peek(1, offset))) {
          offset++;
          continue;
        }
        //Validate token
        if (this.#stream.peek(token.length, offset) === token) {
          offset += token.length;
          break;
        }
        return false;
      }
    }
    return true;
  }

  /** Consume token */
  #consume(token: string) {
    return this.#stream.consume({ content: token });
  }

  /** Capture until next token */
  #capture(token: { until: RegExp; bytes: number }) {
    return this.#stream.capture(token);
  }

  /** Trim stream */
  #trim() {
    return this.#stream.trim();
  }

  //================================================================================

  /** Schemas */
  private static readonly schema = {
    comment: "#comment",
    text: "#text",
    attribute: {
      prefix: "@",
    },
    property: {
      prefix: "@",
    },
  } as const;

  /** Tokens */
  private static readonly tokens = {
    prolog: {
      start: "<?xml",
      end: "?>",
    },
    doctype: {
      start: "<!DOCTYPE",
      end: ">",
      elements: {
        start: "[",
        end: "]",
      },
      element: {
        start: "<!ELEMENT",
        end: ">",
        value: {
          start: "(",
          end: ")",
          regex: {
            end: { until: /\)/, bytes: 1 },
          },
        },
      },
    },
    comment: {
      start: "<!--",
      end: "-->",
      regex: {
        end: { until: /(?<!-)-->/, bytes: 4 },
      },
    },
    cdata: {
      start: "<![CDATA[",
      end: "]]>",
      regex: {
        end: {
          until: /\]\]>/,
          bytes: 3,
        },
      },
    },
    tag: {
      start: "<",
      end: ">",
      close: {
        start: "</",
        end: ">",
        self: "/",
      },
      attribute: {
        regex: {
          name: { until: /=/, bytes: 1 },
        },
      },
      regex: {
        name: { until: /[\s\/>]/, bytes: 1 },
        start: { until: /</, bytes: 1 },
      },
    },
    text: {
      regex: {
        end: { until: /(<\/)|(<!)/, bytes: 2 },
      },
    },
  } as const;

  /** Entities */
  private static readonly entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&quot;": '"',
    "&amp;": "&", //Keep last
  } as const;
}
