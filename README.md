# devkit

One CLI for the rayhanlimon dev-toolbox. Install once, get every tool: `devkit envdoctor`, `devkit untrack`, and more landing weekly.

Each command delegates to its standalone tool (same flags, same exit codes) — devkit is a thin router, not a rewrite. Prefer a single tool? Install it directly; nothing is locked in.

## Install

Requires Node 18+. No dependencies.

```sh
npm install -g devkit
# or from source (sibling tools resolve via DEVKIT_SIBLINGS, default: parent dir):
git clone https://github.com/rayhanlimon/devkit && cd devkit
DEVKIT_SIBLINGS=/home/shadow/git node bin/devkit.js --list
```

## Usage

```sh
devkit --list                        # all commands
devkit envdoctor --help              # any tool help passes through
devkit envdoctor check .             # validate .env
devkit untrack scan                  # audit tracked-but-ignored files
```

Exit codes pass through from the underlying tool.

## Commands (Milestone 1)

| Command | Tool | Status |
|---------|------|--------|
| `envdoctor` | [envdoctor](https://github.com/rayhanlimon/envdoctor) | wired |
| `untrack` | [untrack](https://github.com/rayhanlimon/untrack) | wired |
| `jsonlog-view` | [jsonlog-view](https://github.com/rayhanlimon/jsonlog-view) | next |
| `portfree` | [portfree](https://github.com/rayhanlimon/portfree) | next |
| `diskhog` | [diskhog](https://github.com/rayhanlimon/diskhog) | next |

## Roadmap

- [ ] Milestone 2: wire remaining three commands + `devkit update` (git-pull all siblings)
- [ ] Milestone 3: npm bundle publishing all tools as optional deps
- [ ] Plugin dir: `~/.devkit/commands` user extensions

## Development

```sh
npm test   # node --test test/*.test.js (8 tests, zero deps)
```

New command = one file in `commands/` exporting `{ name, describe, run(args, ctx) }` + a delegation test.

## License

MIT — see [LICENSE](LICENSE).
