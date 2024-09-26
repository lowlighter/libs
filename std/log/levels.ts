import { LogLevels as _variable_LogLevels } from "jsr:@std/log@0.224.8/levels"
/**
 * Use this to retrieve the numeric log level by it's associated name.
 * Defaults to INFO.
 */
const LogLevels = _variable_LogLevels as typeof _variable_LogLevels
export { LogLevels }

import type { LogLevel as _typeAlias_LogLevel } from "jsr:@std/log@0.224.8/levels"
/**
 * Union of valid log levels
 */
type LogLevel = _typeAlias_LogLevel
export type { LogLevel }

import type { LevelName as _typeAlias_LevelName } from "jsr:@std/log@0.224.8/levels"
/**
 * Union of valid log level names
 */
type LevelName = _typeAlias_LevelName
export type { LevelName }

import { LogLevelNames as _variable_LogLevelNames } from "jsr:@std/log@0.224.8/levels"
/**
 * Permitted log level names
 */
const LogLevelNames = _variable_LogLevelNames as typeof _variable_LogLevelNames
export { LogLevelNames }

import { getLevelByName as _function_getLevelByName } from "jsr:@std/log@0.224.8/levels"
/**
 * Returns the numeric log level associated with the passed,
 * stringy log level name.
 */
const getLevelByName = _function_getLevelByName as typeof _function_getLevelByName
export { getLevelByName }

import { getLevelName as _function_getLevelName } from "jsr:@std/log@0.224.8/levels"
/**
 * Returns the stringy log level name provided the numeric log level.
 */
const getLevelName = _function_getLevelName as typeof _function_getLevelName
export { getLevelName }
