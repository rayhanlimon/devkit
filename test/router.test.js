import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
const REPO_ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const SIBLINGS = process.env.DEVKIT_SIBLINGS || REPO_ROOT.replace(/\/devkit$/, "");
function run(args, cwd) {
  return new Promise((resolve) => {
    execFile(process.execPath, [BIN, ...args], { cwd, timeout: 15000, env: { ...process.env, DEVKIT_SIBLINGS: SIBLINGS } }, (err, stdout, stderr) => {
      resolve({ code: err && err.code != null ? err.code : 0, out: String(stdout), errText: String(stderr) });
    });
  });
}
const BIN = new URL("../bin/devkit.js", import.meta.url).pathname;
test("--list shows wired commands", async () => {
  const r = await run(["--list"], REPO_ROOT);
  assert.equal(r.code, 0);
  assert.match(r.out, /envdoctor/);
  assert.match(r.out, /untrack/);
});
test("unknown command exits 2", async () => {
  const r = await run(["nope-xyz"], REPO_ROOT);
  assert.equal(r.code, 2);
});
test("delegates to envdoctor (exit passthrough)", async () => {
  const r = await run(["envdoctor", "--help"], REPO_ROOT);
  assert.equal(r.code, 0);
  assert.match(r.out, /envdoctor/);
});
test("delegates to untrack (exit passthrough)", async () => {
  const r = await run(["untrack", "--version"], REPO_ROOT);
  assert.equal(r.code, 0);
  assert.match(r.out.trim(), /^\d+\.\d+\.\d+$/);
});
test("--version looks like semver", async () => {
  const r = await run(["--version"], REPO_ROOT);
  assert.match(r.out.trim(), /^\d+\.\d+\.\d+$/);
});
test("--help lists usage", async () => {
  const r = await run(["--help"], REPO_ROOT);
  assert.equal(r.code, 0);
  assert.match(r.out, /Usage/);
});
test("commands sorted alphabetically", async () => {
  const r = await run(["--list"], REPO_ROOT);
  assert.ok(r.out.indexOf("envdoctor") < r.out.indexOf("untrack"));
});
test("sibling override respected", async () => {
  const r = await run(["envdoctor", "--version"], REPO_ROOT);
  assert.equal(r.code, 0);
  assert.match(r.out.trim(), /^\d+\.\d+\.\d+$/);
});
