// Start and configure the PostgreSQL service supplied by GitHub's Linux runners
if (Deno.env.get("CI") === "1") {
  for (const args of [["systemctl", "start", "postgresql.service"], ["-u", "postgres", "psql", "-v", "ON_ERROR_STOP=1", "-c", "ALTER USER postgres WITH PASSWORD 'postgres'"]]) {
    const result = await new Deno.Command("sudo", { args, stdout: "inherit", stderr: "inherit" }).output()
    if (!result.success)
      throw new EvalError(`Failed to configure the CI PostgreSQL service: sudo ${args[0]}`)
  }
}
