/** Compute deno permissions flag from a `Deno.PermissionOptions`-like object. */
export function flags(permissions: Deno.PermissionOptions | boolean | null): string {
  const flags = []
  if ((permissions === true) || (permissions === "inherit")) {
    flags.push("--allow-all")
  }
  if ((typeof permissions === "object") && permissions) {
    for (const type of ["env", "ffi", "import", "net", "read", "run", "sys", "write"] as const) {
      if ((permissions[type] === true) || (permissions[type] === "inherit")) {
        flags.push(`--allow-${type}`)
        continue
      }
      if (permissions[type] === false) {
        flags.push(`--deny-${type}`)
        continue
      }
      if (Array.isArray(permissions[type])) {
        flags.push(`--allow-${type}=${permissions[type].map(String).join(",")}`)
        continue
      }
    }
  }
  return flags.join(" ")
}
