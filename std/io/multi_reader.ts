import { MultiReader as _class_MultiReader } from "jsr:@std/io@0.224.5/multi-reader"
/**
 * Reader utility for combining multiple readers.
 *
 * @example Usage
 * ```ts
 * import { MultiReader } from "@std/io/multi-reader";
 * import { StringReader } from "@std/io/string-reader";
 * import { readAll } from "@std/io/read-all";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const r1 = new StringReader("hello");
 * const r2 = new StringReader("world");
 * const mr = new MultiReader([r1, r2]);
 *
 * const res = await readAll(mr);
 *
 * assertEquals(new TextDecoder().decode(res), "helloworld");
 * ```
 *
 * @deprecated This will be removed in 1.0.0. Use the {@link https://developer.mozilla.org/en-US/docs/Web/API/Streams_API | Web Streams API} instead.
 */
class MultiReader extends _class_MultiReader {}
export { MultiReader }
