# dsh-sarasa-mono

DeepSeek Harness (DSH) Web UI plugin: switches the UI fonts to Sarasa.

- UI / body text: **Sarasa UI SC** (falls back to **更纱黑体 UI SC**, then the shipped stack)
- Monospace surfaces (inline code, code blocks, ids): **Sarasa Mono SC**
- Terminal: **Sarasa Mono SC** where the theme reads the role variable

Requires the Sarasa fonts to be installed locally
(https://github.com/be5invis/Sarasa-Gothic/releases). Note that the Windows release
ships *Sarasa UI SC* and *Sarasa Mono SC*; there is no *Sarasa Gothic SC* family in it.

## Install

```sh
dsh plugin --profile <name> add github:smter/dsh-sarasa-mono
```

Then reload the Web page (the client bundle is cached per revision).

## Why the obvious override does not work

The shipped theme composes the UI font on `<body>`, not on `:root`:

```css
:root{ --dsw-font-family: var(--dsh-font-family-text-default); … }
body { --dsw-font-family: var(--dsh-font-family-text, var(--dsh-font-family-text-default)), var(--dsh-font-family-text-default); … }
body { font-family: var( --dsw-font-family, …) }
```

Because `body` redeclares those composed names itself, an override of
`--dsw-font-family` / `--ds-font-family-code` on `:root` never reaches `body` or
any descendant — the style element is injected, but nothing changes on screen.

The real knobs are the role variables the layout ThemePresenter writes as **inline
body styles** (from Settings → font family fields):

| role | variable | set from |
| --- | --- | --- |
| text | `--dsh-font-family-text` | `textFontFamily` |
| code | `--dsh-font-family-code` | `codeFontFamily` |
| terminal | `--dsh-font-family-terminal` | `terminalFontFamily` |

An author `!important` declaration outranks an inline style, so this plugin declares
those role variables on `html` with `!important`. A role the user already pinned in
Settings is skipped, and the sheet re-syncs when the body style changes, so a user
choice keeps winning.

`--dsw-font-mono` is also overridden: it is consumed with a fallback by a few plugin
surfaces (jobs, plugin manager, agent preset, document preview) and is defined
nowhere else.
