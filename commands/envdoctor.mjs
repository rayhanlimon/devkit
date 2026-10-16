export const name = "envdoctor";
export const describe = "validate .env against code and .env.example";
export async function run(args, ctx) {
  const { execFile } = await import("node:child_process");
  return new Promise((resolve) => {
    const child = execFile(process.execPath, [ctx.sibling("envdoctor", "bin/envdoctor.js"), "check", ...args], { cwd: ctx.cwd }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      resolve(err && typeof err.code === "number" ? err.code : 0);
    });
  });
}
