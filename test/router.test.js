import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
function run(args, cwd) {
  return new Promise((resolve) => {
    execFile(process.execPath, [BIN, ...args], { cwd, timeout: 15000, env: { ...process.env, DEVKIT_SIBLINGS: "/home/shadow/git" } }, (err, stdout, stderr) => {
      resolve({ code: err && err.code != null ? err.code : 0, out: String(stdout), errText: String(stderr) });
    });
  });
}
const BIN = new URL("../bin/devkit.js", import.meta.url).pathname;
test("--list shows wired commands", async () => {
  const r = await run(["--list"], "/home/shadow/git/devkit");
  assert.equal(r.code, 0);
  assert.match(r.out, /envdoctor/);
  assert.match(r.out, /untrack/);
});
test("unknown command exits 2", async () => {
  const r = await run(["nope-xyz"], "/home/shadow/git/devkit");
  assert.equal(r.code, 2);
});
test("delegates to envdoctor (exit passthrough)", async () => {
  const r = await run(["envdoctor", "--help"], "/home/shadow/git/devkit");
  assert.equal(r.code, 0);
  assert.match(r.out, /envdoctor/);
});
test("delegates to untrack outside repo (exit 2 passthrough)", async () => {
  await (await import("node:fs")).promises.mkdir("/home/shadow/git/devkit/.test-tmp", { recursive: true });
  const r = await run(["untrack", "scan"], "/home/shadow/git/devkit/.test-tmp");
  assert.equal(r.code, 2);
});
test("--version looks like semver", async () => {
  const r = await run(["--version"], "/home/shadow/git/devkit");
  assert.match(r.out.trim(), /^\d+\.\d+\.\d+$/);
});
test("--help lists usage", async () => {
  const r = await run(["--help"], "/home/shadow/git/devkit");
  assert.equal(r.code, 0);
  assert.match(r.out, /Usage/);
});
test("commands sorted alphabetically", async () => {
  const r = await run(["--list"], "/home/shadow/git/devkit");
  assert.ok(r.out.indexOf("envdoctor") < r.out.indexOf("untrack"));
});
test("sibling override respected", async () => {
  const r = await run(["envdoctor", "--version"], "/home/shadow/git/devkit");
  assert.equal(r.code, 0);
  assert.match(r.out.trim(), /^\d+\.\d+\.\d+$/);
});
