# dotfiles-macos

A macOS tiling desktop and terminal setup, forked from
[FelixKratz/dotfiles](https://github.com/FelixKratz/dotfiles) and retuned for
**macOS 27 (Golden Gate) on Apple Silicon**, with a
[Catppuccin Mocha](https://github.com/catppuccin/catppuccin) theme throughout.

Components: [yabai](https://github.com/asmvik/yabai) (tiling WM),
[skhd](https://github.com/asmvik/skhd) (hotkeys),
[SketchyBar](https://github.com/FelixKratz/SketchyBar) (bar, SbarLua config),
[JankyBorders](https://github.com/FelixKratz/JankyBorders),
[kitty](https://sw.kovidgoyal.net/kitty/) + zsh +
[starship](https://starship.rs/) (terminal).

## What differs from upstream

* **Working yabai on macOS 27.** Upstream yabai v7.1.25 has no macOS 27
  support in its scripting addition (`verify_os_version` caps at 26), so
  space operations (`yabai -m space --focus` etc.) silently do nothing.
  This fork carries a patch and an installer that fix it — see
  [macOS 27 yabai](#macos-27-yabai) below.
* **Install script pruned** to what this setup actually uses (no MacTeX,
  no conda/miniforge section, no WireGuard/Vimari App Store apps).
* **Catppuccin Mocha everywhere:** kitty, SketchyBar, borders, starship,
  eza, bat, fzf and delta.
* **Powerline prompt and tabs:** starship renders the left prompt as
  colored powerline segments; kitty tabs are rounded powerline pills.
* **Space hotkeys for 10 spaces** (`alt-1..9,0`), focusing the leftmost
  window after switching, and window moves (`shift+alt-N`) that follow
  the moved window. See [Keybindings](#keybindings).
* **Prettier CLI defaults:** `ls`→eza, `cat`→bat, Ctrl-T/Ctrl-R via
  fzf+fd, git diffs via delta, zoxide, fastfetch greeting. See
  [Terminal](#terminal).

## Requirements

* Apple Silicon Mac on macOS 27 (the yabai patch is 27-specific; on
  macOS ≤ 26 just use stock yabai from brew and skip that section).
* SIP partially disabled for yabai's scripting addition (see below) —
  without it, space switching by hotkey will not work.
* [Homebrew](https://brew.sh), Xcode command line tools.

## Install

**Read `.install.sh` before running it** — it installs packages *and*
changes many macOS `defaults`. Back up your existing dotfiles first.

```bash
# 1. clone as a bare repo (dotfiles live directly in $HOME)
git clone --bare https://github.com/bytesapart/dotfiles-macos.git $HOME/dotfiles
git --git-dir=$HOME/dotfiles --work-tree=$HOME checkout master   # overwrites existing files!

# 2. packages, fonts, macOS defaults, services
zsh $HOME/.install.sh
```

The everyday alias for managing the bare repo afterwards (already in
`.zshrc` upstream-style) is:

```bash
alias cfg="git --git-dir=$HOME/dotfiles/ --work-tree=$HOME"
```

### SIP setup for yabai (one-time, manual)

1. Reboot into Recovery (hold power → Options), open Terminal:
   ```bash
   csrutil enable --without fs --without debug --without nvram
   ```
2. Reboot, then in a normal terminal:
   ```bash
   sudo nvram boot-args=-arm64e_preview_abi
   ```
3. Reboot again. Verify with `csrutil status` (Filesystem / Debugging /
   NVRAM protections disabled).
4. Grant **Accessibility** to `yabai`, `skhd` and `sketchybar` under
   System Settings → Privacy & Security → Accessibility, and
   **Screen Recording** to `yabai` (needed for window opacity/animations).

## macOS 27 yabai

Root cause: the scripting-addition payload in upstream yabai rejects
`majorVersion == 27` and exits before locating any Dock functions, and
several Dock byte signatures moved in macOS 27's Dock. Tracked upstream
in [asmvik/yabai#2800](https://github.com/asmvik/yabai/issues/2800) and
[#2802](https://github.com/asmvik/yabai/issues/2802); not fixed in any
release as of writing.

This fork ships:

| File | Purpose |
| :--- | :--- |
| `yabai-macos27.patch` | The #2802 patch (on upstream master `dd84572`) |
| `yabai_verify_offsets.py` | Checks the patch's 7 Dock signatures against your Dock binary |
| `install_yabai_macos27.sh` | Verify → sign identity → build → install → sudoers → load SA |

`.install.sh` runs `install_yabai_macos27.sh` automatically on macOS 27.
Standalone use (e.g. after a macOS point update):

```bash
$HOME/install_yabai_macos27.sh
```

It refuses to proceed if any Dock signature no longer matches (a
`CHANGED` result from the verifier means offsets must be re-derived for
that macOS build). The patched binary is signed with a local self-signed
`yabai-cert` so the Accessibility grant survives rebuilds, installed to
`$(brew --prefix)/bin/yabai`, and the brew formula is pinned so
`brew upgrade` cannot clobber it. Rollback to stock yabai:

```bash
brew unpin yabai && brew link --overwrite yabai
```

Once upstream ships official macOS 27 support: unpin, `brew upgrade
yabai`, refresh `/private/etc/sudoers.d/yabai` with the new binary's
SHA-256, and this section becomes unnecessary.

## Keybindings

All in `.config/skhd/skhdrc` (left `Option` is the main modifier; `ö`/`ä`
positions below assume the upstream German-keyboard layout of this
config — the bindings use raw keycodes `0x29`/`0x27`, i.e. the keys right
of `l` and `p` on US layouts):

| Keys | Action |
| :--- | :--- |
| `alt - 1..9, 0` | Switch to space 1–10 (current display), focus its leftmost window |
| `shift + alt - 1..9, 0` | Move focused window to space 1–10, follow it, keep it focused |
| `shift + alt - p / n` | Move window to prev/next space and follow |
| `alt - j / k / l / ö` | Focus window west/south/north/east (else display) |
| `shift + alt - j / k / l / ö` | Warp window in that direction |
| `alt - h / ä` | Focus first/last window |
| `alt - f` / `shift + alt - f` | Zoom parent / zoom fullscreen |
| `alt - space` | Toggle float |
| `shift + ctrl - j/k/l/ö`, `n/p` | Stack onto neighbor / cycle stack |
| `ctrl + alt - j/k/l/ö`, `e`, `g` | Resize, balance, toggle gaps |
| `shift + alt - space` | Toggle SketchyBar |

Clicking a space in SketchyBar focuses it; right-click destroys it.

## Terminal

kitty + zsh + starship, everything in Catppuccin Mocha:

* **Prompt** (`.config/starship.toml`): left-side powerline —
  `[OS] [directory] [git branch/commit/status/metrics] [language
  versions] [docker/kubernetes] [duration · exit code · clock]`, then
  `❯` on the next line.
* **Tab bar** (`.config/kitty/kitty.conf`): rounded powerline pills,
  mauve active tab, margins and title fade.
* **Prettier commands** (`.zshrc`): `ls`/`ll`/`la`/`lt`/`tree` are
  [eza](https://eza.rocks) with icons and git status, `cat` is
  [bat](https://github.com/sharkdp/bat) (syntax highlighting, theme in
  `.config/bat`), Ctrl-T/Ctrl-R/Alt-C run [fzf](https://github.com/junegunn/fzf)
  over [fd](https://github.com/sharkdp/fd), `z <name>` is
  [zoxide](https://github.com/ajeetdsouza/zoxide), completions are
  colored via [vivid](https://github.com/sharkdp/vivid), and new
  terminals greet with `fastfetch`.
* **Git diffs** page through [delta](https://dandavison.github.io/delta/)
  with the Catppuccin Mocha bat syntax theme (`.install.sh` sets the
  `git config` values; `n`/`N` jump between files in a diff).
* **Editing:** zsh-autosuggestions (ghost text, `→` accepts) and
  fast-syntax-highlighting are loaded; history is shared across shells.
* Themes live at `.config/eza/theme.yml` and
  `.config/bat/themes/Catppuccin Mocha.tmTheme` (run `bat cache --build`
  after checkout). `tldr <cmd>` (tealdeer) gives short man pages.

## Repository layout

| Path | Contents |
| :--- | :--- |
| `.install.sh` | Full setup: brew, defaults, fonts, services |
| `.config/yabai/`, `.config/skhd/` | Window manager + hotkeys |
| `.config/sketchybar/` | Bar (SbarLua; colors in `colors.lua`) |
| `.config/borders/`, `.config/svim/` | Window borders, SketchyVim |
| `.config/kitty/`, `.config/starship.toml`, `.zshrc` | Terminal + prompt + shell |
| `.config/eza/`, `.config/bat/` | CLI themes |
| `.config/helix/`, `.config/nvim` (via SVim), `.tmux.conf` | Editors |
| `yabai-macos27.patch`, `install_yabai_macos27.sh`, `yabai_verify_offsets.py` | macOS 27 yabai fix |
| `install_sketchybar.sh` | Upstream SketchyBar-only installer |

## Credits

Fork of [FelixKratz/dotfiles](https://github.com/FelixKratz/dotfiles)
(MIT, see `LICENSE`); built on yabai by
[asmvik](https://github.com/asmvik/yabai), the macOS 27 Dock offsets by
[AhsanFazal](https://github.com/asmvik/yabai/issues/2802), and the
[Catppuccin](https://github.com/catppuccin) palette. Screenshots of the
upstream setup: see the original repository.
