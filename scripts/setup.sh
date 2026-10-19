#!/bin/zsh
# One-script rice setup for a fresh Mac. Run AFTER .install.sh (it installs
# Homebrew, the base packages, fonts and checks out the configs):
#
#   zsh .install.sh
#   zsh scripts/setup.sh
#
# Idempotent: every step skips work that is already done. Steps that need a
# human (TCC permission flips, wallpaper folder registration, profile
# import) print exact instructions and, where possible, open the right
# Settings pane for you. See scripts/permissions.sh for the permission pass.
set -u
REPO="${0:A:h:h}"
cd "$REPO" || exit 1

say() { print -P "%F{magenta}==>%f $*"; }
skip() { print -P "%F{blue}  (skip)%f $*"; }

# 1. Packages ---------------------------------------------------------------
say "Installing rice packages (Brewfile)…"
brew bundle --file="$REPO/scripts/Brewfile" || {
  print "brew bundle failed; fix Homebrew, then re-run."; exit 1
}

# SbarLua (sketchybar lua API) + helper binaries
if [ ! -f /opt/homebrew/lib/lua/5.4/sketchybar.so ] && \
   [ ! -f /usr/local/lib/lua/5.4/sketchybar.so ]; then
  say "Installing SbarLua…"
  (git clone https://github.com/FelixKratz/SbarLua.git /tmp/SbarLua \
    && cd /tmp/SbarLua && make install && rm -rf /tmp/SbarLua)
else
  skip "SbarLua present"
fi
if [ -d "$HOME/.config/sketchybar/helpers" ]; then
  (cd "$HOME/.config/sketchybar/helpers" && make 2>/dev/null || true)
fi

# 2. yabai macOS-27 patch ----------------------------------------------------
if [ "$(sw_vers -productVersion | cut -d. -f1)" -ge 27 ]; then
  say "Building patched yabai for macOS 27…"
  zsh "$REPO/install_yabai_macos27.sh"
else
  skip "macOS < 27, stock yabai is fine"
fi

# 3. Services ----------------------------------------------------------------
say "Starting services…"
brew services start skhd 2>/dev/null || true
yabai --start-service 2>/dev/null || true
brew services start sketchybar 2>/dev/null || true
brew services start borders 2>/dev/null || true

# 4. Ubersicht widgets --------------------------------------------------------
say "Installing Ubersicht widgets…"
WIDGETS_DIR="$HOME/Library/Application Support/Übersicht/widgets"
mkdir -p "$WIDGETS_DIR"
for w in "$REPO"/.config/ubersicht/*/; do
  mkdir -p "$WIDGETS_DIR/$(basename "$w")"
  cp "$w/index.jsx" "$WIDGETS_DIR/$(basename "$w")/index.jsx"
done
# Stock GettingStarted card draws a white box over the clock; drop it.
rm -f "$WIDGETS_DIR/GettingStarted.jsx"
open -a Übersicht 2>/dev/null || true

# 5. Wallpapers + screenshots --------------------------------------------------
say "Installing wallpaper rotation set…"
ROT="$HOME/Pictures/Wallpapers/Mocha"
mkdir -p "$ROT"
cp -n "$REPO"/assets/wallpapers/* "$ROT"/ 2>/dev/null || true
print "  $(ls "$ROT" | grep -v '^\.' | wc -l | tr -d ' ') images in $ROT"
mkdir -p "$HOME/Pictures/Screenshots"
defaults write com.apple.screencapture location -string "$HOME/Pictures/Screenshots"

# 6. Menu bar: holzBar manages, shelf drops downwards --------------------------
say "Configuring holzBar (Ice fork, macOS 27 backend)…"
defaults write com.holzcloud.holzBar UseIceBar -bool YES
defaults write com.holzcloud.holzBar IceBarLocation -int 2   # below the icon
defaults write com.holzcloud.holzBar ShowOnClick -bool NO    # sketchybar owns the strip
defaults write com.holzcloud.holzBar ShowOnHover -bool NO
if ! osascript -e 'tell application "System Events" to get the name of every login item' 2>/dev/null | grep -q holzBar; then
  osascript -e 'tell application "System Events" to make login item at end with properties {path:"/Applications/holzBar.app", hidden:false}' >/dev/null
else
  skip "holzBar login item present"
fi
open -a holzBar 2>/dev/null || true

# Native menu bar stays auto-hidden (mouse to the top reveals it, with the
# holzBar icon); sketchybar owns the strip at y=0. Takes effect at login.
defaults write NSGlobalDomain _HIHideMenuBar -bool true

# 7. Theme caches ---------------------------------------------------------------
say "Rebuilding theme caches…"
bat cache --build 2>/dev/null || true

say "Setup done. Now the permission pass (needs your clicks):"
zsh "$REPO/scripts/permissions.sh"
