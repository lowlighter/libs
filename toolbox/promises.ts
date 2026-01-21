/** Returns the current state of a promise. */
export async function state(promise: Promise<unknown>) {
  const check = new Promise<void>((resolve) => setTimeout(resolve, 0))
  try {
    return await Promise.race([promise.then((_) => "fulfilled" as const).catch((_) => "rejected" as const), check.then((_) => "pending" as const)])
  } finally {
    await check
  }
}
