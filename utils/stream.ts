//Imports
import type { Flux } from "./types.ts";

/**
 * Text stream helper
 */
export class Stream {
  /** Constructor */
  constructor(content: Flux) {
    this.#content = content;
  }

  /** Text decodeer */
  readonly #decoder = new TextDecoder();

  /** Text encoder */
  readonly #encoder = new TextEncoder();

  /** Content */
  readonly #content: Flux;

  /** Peek next bytes (cursor is replaced at current position after reading) */
  peek(bytes = 1, offset = 0) {
    const buffer = new Uint8Array(bytes);
    const cursor = this.#content.seekSync(0, Deno.SeekMode.Current);
    if (offset) {
      this.#content.seekSync(offset, Deno.SeekMode.Current);
    }
    if (this.#content.readSync(buffer)) {
      this.#content.seekSync(cursor, Deno.SeekMode.Start);
      return this.#decoder.decode(buffer);
    }
    throw new Deno.errors.UnexpectedEof();
  }

  /** Read next bytes (cursor is moved after reading) */
  read(bytes = 1) {
    const buffer = new Uint8Array(bytes);
    if (this.#content.readSync(buffer)) {
      return buffer;
    }
    throw new Deno.errors.UnexpectedEof();
  }

  /** Capture next bytes until matching regex sequence */
  capture(
    { until, bytes, trim = true }: {
      until: RegExp;
      bytes: number;
      trim?: boolean;
    },
  ) {
    if (trim) {
      this.trim();
    }
    const buffer = [];
    while (!until.test(this.peek(bytes))) {
      buffer.push((this.read(1))[0]);
    }
    if (trim) {
      this.trim();
    }
    return this.#decoder.decode(Uint8Array.from(buffer));
  }

  /** Consume next bytes ensuring that content is matching */
  consume({ content, trim = true }: { content: string; trim?: boolean }) {
    if (trim) {
      this.trim();
    }
    const bytes = this.#encoder.encode(content).length;
    if (content === this.peek(bytes)) {
      this.read(bytes);
      if (trim) {
        this.trim();
      }
      return;
    }
    throw new SyntaxError(
      `Expected next sequence to be "${content}", got "${
        this.peek(bytes)
      }" instead`,
    );
  }

  /** Trim content */
  trim() {
    try {
      while (/\s/.test(this.peek())) {
        this.read(1);
      }
    } catch (error) {
      if (error instanceof Deno.errors.UnexpectedEof) {
        return;
      }
      throw error;
    }
  }
}
