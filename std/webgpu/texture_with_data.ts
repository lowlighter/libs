import { createTextureWithData as _function_createTextureWithData } from "jsr:@std/webgpu@0.224.6/texture-with-data"
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
