export const name = "untrack";
export const describe = "fix .gitignore not working (tracked-but-ignored files)";
export async function run(args, ctx) {
  const { execFile } = await import("node:child_process");
  return new Promise((resolve) => {
    execFile(process.execPath, [ctx.sibling("untrack", "bin/untrack.js"), ...args], { cwd: ctx.cwd }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      resolve(err && typeof err.code === "number" ? err.code : 0);
    });
  });
}
