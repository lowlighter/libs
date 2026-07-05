/**
 * Minimal type definitions for {@link https://github.com/markdown-it/markdown-it | markdown-it}.
 *
 * These are vendored rather than depended upon through `@types/markdown-it`,
 * as JSR fails to generate documentation for packages depending on `@types/*` packages.
 * {@link https://github.com/jsr-io/jsr/issues/511 | See jsr-io/jsr#511 for more information}.
 *
 * @module
 */

/** markdown-it options. */
export type MarkdownItOptions = {
  /** Allow HTML tags in source. */
  html?: boolean
  /** Convert newlines in paragraphs into `<br>`. */
  breaks?: boolean
  /** Autoconvert URL-like text to links. */
  linkify?: boolean
  /** CSS language prefix for fenced blocks. */
  langPrefix?: string
  /** Highlighter function (should return escaped HTML, or an empty string to fallback to default escaping). */
  highlight?: ((code: string, language: string, attributes: string) => string) | null
}

/** markdown-it instance. */
export interface MarkdownIt {
  /** Instance options. */
  options: MarkdownItOptions
  /** Core chain. */
  core: { ruler: Ruler<CoreRule> }
  /** Block-level tokenizer. */
  block: { ruler: Ruler<BlockRule>; tokenize(state: StateBlock, startLine: number, endLine: number): void }
  /** Inline-level tokenizer. */
  inline: { ruler: Ruler<InlineRule> }
  /** Renderer. */
  renderer: { rules: Partial<Record<string, RenderRule>> }
  /** Utilities. */
  utils: { escapeHtml(html: string): string }
  /** Load a plugin. */
  use<Options extends unknown[]>(plugin: (engine: MarkdownIt, ...options: Options) => void, ...options: Options): MarkdownIt
  /** Disable rules. */
  disable(rules: string | string[], ignoreInvalid?: boolean): MarkdownIt
  /** Render markdown content into an HTML string. */
  render(content: string, env?: Record<PropertyKey, unknown>): string
}

/** markdown-it constructor. */
export interface MarkdownItConstructor {
  /** Constructor. */
  new (options?: MarkdownItOptions): MarkdownIt
}

/** Token. */
export interface Token {
  /** Type of the token. */
  type: string
  /** HTML tag name. */
  tag: string
  /** Content of the token. */
  content: string
  /** Fence info string. */
  info: string
  /** Arbitrary data. */
  meta: unknown
  /** Whether the token is block-level. */
  block: boolean
  /** Source map info as `[first_line, last_line]`. */
  map: [number, number] | null
  /** Children tokens (for inline tokens). */
  children: Token[] | null
  /** Get an attribute value. */
  attrGet(name: string): string | null
  /** Set an attribute value. */
  attrSet(name: string, value: string): void
  /** Join a value to an attribute (e.g. class names). */
  attrJoin(name: string, value: string): void
}

/** Shared rule state. */
export interface State {
  /** Source content. */
  src: string
  /** Rendering environment. */
  env: Record<PropertyKey, unknown>
  /** markdown-it instance. */
  md: MarkdownIt
  /** Tokens list. */
  tokens: Token[]
  /** Token constructor. */
  Token: new (type: string, tag: string, nesting: -1 | 0 | 1) => Token
}

/** Core rule state. */
export type StateCore = State

/** Block rule state. */
export interface StateBlock extends State {
  /** Offsets of the lines begins. */
  bMarks: number[]
  /** Offsets of the lines ends. */
  eMarks: number[]
  /** Offsets of the first non-space characters. */
  tShift: number[]
  /** Required block content indent. */
  blkIndent: number
  /** Current line. */
  line: number
  /** Maximum line. */
  lineMax: number
  /** Get lines range as a string. */
  getLines(begin: number, end: number, indent: number, keepLastLF: boolean): string
  /** Push a new token. */
  push(type: string, tag: string, nesting: -1 | 0 | 1): Token
}

/** Inline rule state. */
export interface StateInline extends State {
  /** Current position. */
  pos: number
  /** Maximum position. */
  posMax: number
  /** Push a new token. */
  push(type: string, tag: string, nesting: -1 | 0 | 1): Token
}

/** Core chain rule. */
export type CoreRule = (state: StateCore) => void

/** Block tokenizer rule. */
export type BlockRule = (state: StateBlock, startLine: number, endLine: number, silent: boolean) => boolean

/** Inline tokenizer rule. */
export type InlineRule = (state: StateInline, silent: boolean) => boolean

/** Renderer rule. */
export type RenderRule = (tokens: Token[], index: number, options: MarkdownItOptions, env: Record<PropertyKey, unknown>, self: unknown) => string

/** Rules manager. */
export interface Ruler<Rule> {
  /** Add a rule to the end of chain. */
  push(name: string, rule: Rule): void
  /** Add a rule before the specified one. */
  before(target: string, name: string, rule: Rule): void
  /** Add a rule after the specified one. */
  after(target: string, name: string, rule: Rule): void
}
