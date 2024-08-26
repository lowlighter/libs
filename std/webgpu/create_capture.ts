import type { CreateCapture as _interface_CreateCapture } from "jsr:@std/webgpu@0.224.5/create-capture"
/**
 * Return value for {@linkcode createCapture}.
 */
interface CreateCapture extends _interface_CreateCapture {}
export type { CreateCapture }

import { createCapture as _function_createCapture } from "jsr:@std/webgpu@0.224.5/create-capture"
/**
 * Creates a texture and buffer to use as a capture.
 *
 * @example Usage
 * ```ts no-eval
 * import { createCapture } from "@std/webgpu/create-capture";
 * import { getRowPadding } from "@std/webgpu/row-padding";
 *
 * const adapter = await navigator.gpu.requestAdapter();
 * const device = await adapter?.requestDevice()!;
 *
 * const dimensions = {
 *   width: 200,
 *   height: 200,
 * };
 *
 * const { texture, outputBuffer } = createCapture(device, dimensions.width, dimensions.height);
 *
 * const encoder = device.createCommandEncoder();
 * encoder.beginRenderPass({
 *   colorAttachments: [
 *     {
 *       view: texture.createView(),
 *       storeOp: "store",
 *       loadOp: "clear",
 *       clearValue: [1, 0, 0, 1],
 *     },
 *   ],
 * }).end();
 *
 * const { padded } = getRowPadding(dimensions.width);
 *
 * encoder.copyTextureToBuffer(
 *   {
 *     texture,
 *   },
 *   {
 *     buffer: outputBuffer,
 *     bytesPerRow: padded,
 *   },
 *   dimensions,
 * );
 *
 * device.queue.submit([encoder.finish()]);
 *
 * // outputBuffer contains the raw image data, can then be used
 * // to save as png or other formats.
 * ```
 *
 * @param device The device to use for creating the capture.
 * @param width The width of the capture texture.
 * @param height The height of the capture texture.
 * @return The texture to render to and buffer to read from.
 */
const createCapture = _function_createCapture as typeof _function_createCapture
export { createCapture }
