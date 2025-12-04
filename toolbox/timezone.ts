/** Supported timezones in the current runtime. */
export const timezones = [...Intl.supportedValuesOf("timeZone"), "UTC"] as string[]

/** Current timezone in the runtime. */
export const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone as string
