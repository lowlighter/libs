/**
 * Utilities for interacting with the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API | WebGPU API}.
 *
 * ```ts no-eval
 * import { createTextureWithData } from "@std/webgpu";
 *
 * const adapter = await navigator.gpu.requestAdapter();
 * const device = await adapter?.requestDevice()!;
 *
 * createTextureWithData(device, {
 *   format: "bgra8unorm-srgb",
 *   size: {
 *     width: 3,
 *     height: 2,
 *   },
 *   usage: GPUTextureUsage.COPY_SRC,
 * }, new Uint8Array([1, 1, 1, 1, 1, 1, 1]));
 * ```
 *
 * @module
 */
import type { CreateCapture as _interface_CreateCapture } from "jsr:@std/webgpu@0.224.7"
/**
 * Return value for {@linkcode createCapture}.
 */
interface CreateCapture extends _interface_CreateCapture {}
export type { CreateCapture }

import { createCapture as _function_createCapture } from "jsr:@std/webgpu@0.224.7"
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

import type { TextureFormatInfo as _interface_TextureFormatInfo } from "jsr:@std/webgpu@0.224.7"
/**
 * Return type for {@linkcode describeTextureFormat}.
 */
interface TextureFormatInfo extends _interface_TextureFormatInfo {}
export type { TextureFormatInfo }

import { describeTextureFormat as _function_describeTextureFormat } from "jsr:@std/webgpu@0.224.7"
/**
 * Get various information about a specific {@linkcode GPUTextureFormat}.
 *
 * @example Basic usage
 * ```ts
 * import { describeTextureFormat } from "@std/webgpu/describe-texture-format";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(describeTextureFormat("rgba8unorm"), {
 *   sampleType: "float",
 *   allowedUsages: 31,
 *   blockDimensions: [1, 1],
 *   blockSize: 4,
 *   components: 4,
 * });
 * ```
 *
 * @param format The format to get the information about.
 * @return An object describing various properties for the provided format.
 */
const describeTextureFormat = _function_describeTextureFormat as typeof _function_describeTextureFormat
export { describeTextureFormat }

import type { Padding as _interface_Padding } from "jsr:@std/webgpu@0.224.7"
/**
 * Return value for {@linkcode getRowPadding}.
 */
interface Padding extends _interface_Padding {}
export type { Padding }

import { COPY_BYTES_PER_ROW_ALIGNMENT as _variable_COPY_BYTES_PER_ROW_ALIGNMENT } from "jsr:@std/webgpu@0.224.7"
/**
 * Buffer-Texture copies must have [`bytes_per_row`] aligned to this number.
 */
const COPY_BYTES_PER_ROW_ALIGNMENT = _variable_COPY_BYTES_PER_ROW_ALIGNMENT as typeof _variable_COPY_BYTES_PER_ROW_ALIGNMENT
export { COPY_BYTES_PER_ROW_ALIGNMENT }

import { BYTES_PER_PIXEL as _variable_BYTES_PER_PIXEL } from "jsr:@std/webgpu@0.224.7"
/**
 * Number of bytes per pixel.
 */
const BYTES_PER_PIXEL = _variable_BYTES_PER_PIXEL as typeof _variable_BYTES_PER_PIXEL
export { BYTES_PER_PIXEL }

import { getRowPadding as _function_getRowPadding } from "jsr:@std/webgpu@0.224.7"
/**
 * Calculates the number of bytes including necessary padding when passing a
 * {@linkcode GPUImageCopyBuffer}.
 *
 * Ref: https://en.wikipedia.org/wiki/Data_structure_alignment#Computing_padding
 *
 * @example Usage
 * ```ts
 * import { getRowPadding } from "@std/webgpu/row-padding";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(getRowPadding(1), { unpadded: 4, padded: 256 });
 * ```
 *
 * @param width The width to get the padding for
 * @return The padded and unpadded values
 */
const getRowPadding = _function_getRowPadding as typeof _function_getRowPadding
export { getRowPadding }

import { resliceBufferWithPadding as _function_resliceBufferWithPadding } from "jsr:@std/webgpu@0.224.7"
/**
 * Creates a new buffer while removing any unnecessary empty bytes.
 * Useful for when wanting to save an image as a specific format.
 *
 * @example Usage
 * ```ts
 * import { resliceBufferWithPadding } from "@std/webgpu/row-padding";
 * import { assertEquals } from "@std/assert";
 *
 * const input = new Uint8Array([0, 255, 0, 255, 120, 120, 120]);
 * const result = resliceBufferWithPadding(input, 1, 1);
 *
 * assertEquals(result, new Uint8Array([0, 255, 0, 255]));
 * ```
 *
 * @param buffer The buffer to reslice.
 * @param width The width of the output buffer.
 * @param height The height of the output buffer.
 * @return The resliced buffer.
 */
const resliceBufferWithPadding = _function_resliceBufferWithPadding as typeof _function_resliceBufferWithPadding
export { resliceBufferWithPadding }

import { createTextureWithData as _function_createTextureWithData } from "jsr:@std/webgpu@0.224.7"
/**
 * Create a {@linkcode GPUTexture} with data.
 *
 * @example Usage
 * ```ts no-eval
 * import { createTextureWithData } from "@std/webgpu/texture-with-data";
 *
 * const adapter = await navigator.gpu.requestAdapter();
 * const device = await adapter?.requestDevice()!;
 *
 * createTextureWithData(device, {
 *   format: "bgra8unorm-srgb",
 *   size: {
 *     width: 3,
 *     height: 2,
 *   },
 *   usage: GPUTextureUsage.COPY_SRC,
 * }, new Uint8Array([1, 1, 1, 1, 1, 1, 1]));
 * ```
 *
 * @param device The device to create the texture with.
 * @param descriptor The texture descriptor to create the texture with.
 * @param data The data to write to the texture.
 * @return The newly created texture.
 */
const createTextureWithData = _function_createTextureWithData as typeof _function_createTextureWithData
export { createTextureWithData }
