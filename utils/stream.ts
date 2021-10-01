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
  peek(bytes = 1) {
    const buffer = new Uint8Array(bytes);
    if (this.#content.readSync(buffer)) {
      this.#content.seekSync(-bytes, Deno.SeekMode.Current);
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
      return;
    }
    throw new Error(
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
