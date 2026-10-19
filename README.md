# dsh-sarasa-mono

DeepSeek Harness (DSH) UI plugin: switches the web UI fonts to Sarasa.

- Monospace surfaces (inline code, code blocks, terminals, ids): **Sarasa Mono SC**
- UI / body text: **Sarasa Gothic SC** (falls back to **Sarasa UI SC / 更纱黑体 UI SC**)

It works by overriding the `--dsw-font-family`, `--ds-font-family-code` and
`--dsw-font-mono` CSS variables on `:root` from a tiny client plugin mounted
in the `shell.overlay` slot.

## Install

```sh
dsh plugin --profile <name> add github:smter/dsh-sarasa-mono
```

Requires the Sarasa fonts to be installed locally
(https://github.com/be5invis/Sarasa-Gothic/releases).
