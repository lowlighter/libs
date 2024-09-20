import type { Reader as _interface_Reader } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer asynchronously.
 */
interface Reader extends _interface_Reader {}
export type { Reader }

import type { ReaderSync as _interface_ReaderSync } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to read
 * bytes into an array buffer synchronously.
 */
interface ReaderSync extends _interface_ReaderSync {}
export type { ReaderSync }

import type { Writer as _interface_Writer } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource asynchronously.
 */
interface Writer extends _interface_Writer {}
export type { Writer }

import type { WriterSync as _interface_WriterSync } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to write
 * bytes from an array buffer to a file/resource synchronously.
 */
interface WriterSync extends _interface_WriterSync {}
export type { WriterSync }

import type { Closer as _interface_Closer } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to close
 * files/resources that were previously opened.
 */
interface Closer extends _interface_Closer {}
export type { Closer }

import { SeekMode as _enum_SeekMode } from "jsr:@std/io@0.224.8/types"
/**
 * A enum which defines the seek mode for IO related APIs that support
 * seeking.
 */
const SeekMode = _enum_SeekMode as typeof _enum_SeekMode
export { SeekMode }

import type { Seeker as _interface_Seeker } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource asynchronously.
 */
interface Seeker extends _interface_Seeker {}
export type { Seeker }

import type { SeekerSync as _interface_SeekerSync } from "jsr:@std/io@0.224.8/types"
/**
 * An abstract interface which when implemented provides an interface to seek
 * within an open file/resource synchronously.
 */
interface SeekerSync extends _interface_SeekerSync {}
export type { SeekerSync }
