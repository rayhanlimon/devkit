#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const VERSION = "0.1.0";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const COMMANDS_DIR = path.join(ROOT, "commands");
function help(cmds) {
  console.log("devkit " + VERSION + " - one CLI for the rayhanlimon dev-toolbox");
  console.log("");
  console.log("Usage: devkit <command> [args...]  |  devkit --list");
  console.log("");
  console.log("Commands:");
  for (const c of cmds) console.log("  " + c.name.padEnd(12) + c.describe);
  console.log("");
  console.log("Each command delegates to its standalone tool; exit codes pass through.");
}
async function load() {
  const files = await fs.promises.readdir(COMMANDS_DIR).catch(() => []);
  const cmds = [];
  for (const f of files.filter((x) => x.endsWith(".mjs"))) {
    const mod = await import(path.join(COMMANDS_DIR, f));
    if (mod.name && mod.run) cmds.push(mod);
  }
  return cmds.sort((a, b) => (a.name < b.name ? -1 : 1));
}
function sibling(tool, rel) {
  const override = process.env.DEVKIT_SIBLINGS;
  const base = override ? path.resolve(override) : path.resolve(ROOT, "..");
  return path.join(base, tool, rel);
}
const argv = process.argv.slice(2);
const cmds = await load();
if (!argv.length || argv[0] === "--help" || argv[0] === "-h" || argv[0] === "--list") { help(cmds); process.exit(0); }
if (argv[0] === "--version" || argv[0] === "-v") { console.log(VERSION); process.exit(0); }
const target = cmds.find((c) => c.name === argv[0]);
if (!target) { console.error("devkit: unknown command " + JSON.stringify(argv[0])); help(cmds); process.exit(2); }
const code = await target.run(argv.slice(1), { cwd: process.cwd(), sibling });
process.exit(typeof code === "number" ? code : 0);
