import { CborTag as _class_CborTag } from "jsr:@std/cbor@0.1.1/tag"
/**
 * Represents a CBOR tag, which pairs a tag number with content, used to convey
 * additional semantic information in CBOR-encoded data.
 * [CBOR Tags](https://www.iana.org/assignments/cbor-tags/cbor-tags.xhtml).
 *
 * @example Usage
 * ```ts
 * import { assert, assertEquals } from "@std/assert";
 * import { CborTag, decodeCbor, encodeCbor } from "@std/cbor";
 * import { decodeBase64Url, encodeBase64Url } from "@std/encoding";
 *
 * const rawMessage = new TextEncoder().encode("Hello World");
 *
 * const encodedMessage = encodeCbor(
 *   new CborTag(
 *     33, // TagNumber 33 specifies the tagContent must be a valid "base64url" "string".
 *     encodeBase64Url(rawMessage),
 *   ),
 * );
 *
 * const decodedMessage = decodeCbor(encodedMessage);
 *
 * assert(decodedMessage instanceof CborTag);
 * assert(typeof decodedMessage.tagContent === "string");
 * assertEquals(decodeBase64Url(decodedMessage.tagContent), rawMessage);
 * ```
 *
 * @template T The type of the tag's content, which can be a
 * {@link CborType}, {@link CborStreamInput}, or {@link CborStreamOutput}.
 */
class CborTag<T extends CborType | CborStreamInput | CborStreamOutput> extends _class_CborTag<T> {}
export { CborTag }
