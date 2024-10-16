import type { ServerSentEventMessage as _interface_ServerSentEventMessage } from "jsr:@std/http@1.0.8/server-sent-event-stream"
/**
 * Represents a message in the Server-Sent Event (SSE) protocol.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields}
 */
interface ServerSentEventMessage extends _interface_ServerSentEventMessage {}
export type { ServerSentEventMessage }

import { ServerSentEventStream as _class_ServerSentEventStream } from "jsr:@std/http@1.0.8/server-sent-event-stream"
/**
 * Transforms server-sent message objects into strings for the client.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events}
 *
 * @example Usage
 * ```ts no-assert
 * import {
 *   type ServerSentEventMessage,
 *   ServerSentEventStream,
 * } from "@std/http/server-sent-event-stream";
 *
 * const stream = ReadableStream.from<ServerSentEventMessage>([
 *   { data: "hello there" }
 * ]).pipeThrough(new ServerSentEventStream());
 * new Response(stream, {
 *   headers: {
 *     "content-type": "text/event-stream",
 *     "cache-control": "no-cache",
 *   },
 * });
 * ```
 */
class ServerSentEventStream extends _class_ServerSentEventStream {}
export { ServerSentEventStream }
