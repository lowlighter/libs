import type { Padding as _interface_Padding } from "jsr:@std/webgpu@0.224.5/row-padding"
/**
 * Return value for {@linkcode getRowPadding}.
 */
interface Padding extends _interface_Padding {}
export type { Padding }

import { COPY_BYTES_PER_ROW_ALIGNMENT as _variable_COPY_BYTES_PER_ROW_ALIGNMENT } from "jsr:@std/webgpu@0.224.5/row-padding"
/**
 * Buffer-Texture copies must have [`bytes_per_row`] aligned to this number.
 */
const COPY_BYTES_PER_ROW_ALIGNMENT = _variable_COPY_BYTES_PER_ROW_ALIGNMENT as typeof _variable_COPY_BYTES_PER_ROW_ALIGNMENT
export { COPY_BYTES_PER_ROW_ALIGNMENT }

import { BYTES_PER_PIXEL as _variable_BYTES_PER_PIXEL } from "jsr:@std/webgpu@0.224.5/row-padding"
/**
 * Number of bytes per pixel.
 */
const BYTES_PER_PIXEL = _variable_BYTES_PER_PIXEL as typeof _variable_BYTES_PER_PIXEL
export { BYTES_PER_PIXEL }

import { getRowPadding as _function_getRowPadding } from "jsr:@std/webgpu@0.224.5/row-padding"
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

import { resliceBufferWithPadding as _function_resliceBufferWithPadding } from "jsr:@std/webgpu@0.224.5/row-padding"
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
