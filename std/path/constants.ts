import { DELIMITER as _variable_DELIMITER } from "jsr:@std/path@1.0.1/constants"
/**
 * The character used to separate entries in the PATH environment variable.
 * On Windows, this is `;`. On all other platforms, this is `:`.
 */
const DELIMITER = _variable_DELIMITER
export { DELIMITER }

import { SEPARATOR as _variable_SEPARATOR } from "jsr:@std/path@1.0.1/constants"
/**
 * The character used to separate components of a file path.
 * On Windows, this is `\`. On all other platforms, this is `/`.
 */
const SEPARATOR = _variable_SEPARATOR
export { SEPARATOR }

import { SEPARATOR_PATTERN as _variable_SEPARATOR_PATTERN } from "jsr:@std/path@1.0.1/constants"
/**
 * A regular expression that matches one or more path separators.
 */
const SEPARATOR_PATTERN = _variable_SEPARATOR_PATTERN
export { SEPARATOR_PATTERN }
