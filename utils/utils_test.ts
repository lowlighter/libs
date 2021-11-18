import { Streamable } from "./streamable.ts";
import { Stream } from "./stream.ts";
import { SeekMode } from "./types.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.111.0/testing/asserts.ts";

Deno.test("streamable: readSync", () => {
  const stream = new Streamable("hello world");
  assertEquals(stream.seekSync(0, SeekMode.Current), 0);
  const buffer = new Uint8Array(5);
  stream.readSync(buffer);
  assertEquals(new TextDecoder().decode(buffer), "hello");
});

Deno.test("streamable: seekSync", () => {
  const stream = new Streamable("hello world");
  assertEquals(stream.seekSync(5, SeekMode.Start), 5);
  assertEquals(stream.seekSync(-2, SeekMode.Current), 3);
  assertEquals(stream.seekSync(+2, SeekMode.Current), 5);
  assertEquals(stream.seekSync(-1, SeekMode.End), 10);
});

Deno.test("streamable: seekSync", () => {
  const stream = new Streamable("hello world");
  assertEquals(stream.seekSync(5, SeekMode.Start), 5);
  assertEquals(stream.seekSync(-2, SeekMode.Current), 3);
  assertEquals(stream.seekSync(+2, SeekMode.Current), 5);
  assertEquals(stream.seekSync(-1, SeekMode.End), 10);
});

Deno.test("stream: cursor", () => {
  const stream = new Stream(new Streamable("hello world"));
  assertEquals(stream.cursor, 0);
  stream.read(5);
  assertEquals(stream.cursor, 5);
});

Deno.test("stream: peek", () => {
  const stream = new Stream(new Streamable("hello world"));
  assertEquals(stream.cursor, 0);
  assertEquals(stream.peek(5), "hello");
  assertEquals(stream.cursor, 0);
  assertEquals(stream.peek(5, 6), "world");
});

Deno.test("stream: read", () => {
  const stream = new Stream(new Streamable("hello world"));
  assertEquals(stream.cursor, 0);
  assertEquals(stream.read(5), new TextEncoder().encode("hello"));
  assertEquals(stream.cursor, 5);
  assertEquals(stream.read(6), new TextEncoder().encode(" world"));
  assertThrows(() => stream.read(1000), Deno.errors.UnexpectedEof);
});

Deno.test("stream: capture", () => {
  const stream = new Stream(new Streamable("hello world"));
  assertEquals(stream.cursor, 0);
  assertEquals(stream.capture({ until: / /, bytes: 1 }), "hello");
  assertEquals(stream.cursor, 6);
  assertEquals(stream.capture({ until: /(?<=wo)rld/, bytes: 5, length: 3 }), "wo");
});

Deno.test("stream: consume", () => {
  const stream = new Stream(new Streamable("hello world"));
  assertEquals(stream.cursor, 0);
  stream.consume({ content: "hello " });
  assertEquals(stream.cursor, 6);
});

Deno.test("stream: trim", () => {
  const stream = new Stream(new Streamable("   hello world"));
  assertEquals(stream.cursor, 0);
  stream.trim();
  assertEquals(stream.cursor, 3);
  stream.consume({ content: "hello world" });
  stream.trim();
  assertEquals(stream.cursor, 14);
  stream.peek = () => {
    throw new EvalError();
  };
  assertThrows(() => stream.trim(), EvalError);
});
