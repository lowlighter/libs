import type { TextureFormatInfo as _interface_TextureFormatInfo } from "jsr:@std/webgpu@0.224.5/describe-texture-format"
/**
 * Return type for {@linkcode describeTextureFormat}.
 */
interface TextureFormatInfo extends _interface_TextureFormatInfo {}
export type { TextureFormatInfo }

import { describeTextureFormat as _function_describeTextureFormat } from "jsr:@std/webgpu@0.224.5/describe-texture-format"
/**
 * Get various information about a specific {@linkcode GPUTextureFormat}.
 *
 * @example Basic usage
 * ```ts
 * import { describeTextureFormat } from "@std/webgpu/describe-texture-format";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(describeTextureFormat("rgba8unorm"), {
 *   requiredFeature: undefined,
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
const describeTextureFormat = _function_describeTextureFormat
export { describeTextureFormat }
