#!/bin/zsh
# Permission pass: macOS TCC gates cannot be flipped by a script, so this
# opens each exact Settings pane and waits for your click. Safe to re-run.
set -u
REPO="${0:A:h:h}"

say() { print -P "%F{magenta}==>%f $*"; }
ok() { print -P "%F{green}  ok:%f $*"; }
ask() { print -n "%F{yellow}  ?%f $1 [Enter when done] "; read -r _; }

ax_open() { open "x-apple.systempreferences:com.apple.preference.security?$1"; }

# 1. Accessibility: yabai (scripting addition) --------------------------------
say "1/4 Accessibility → yabai"
ax_open "Privacy_Accessibility"
ask "Toggle yabai ON (needs your password), then"
# Functional SA probe: space create/destroy is instant and silent without SA.
sa_ok() {
  local before after created
  before=$(yabai -m query --spaces 2>/dev/null | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null)
  [ -z "$before" ] && return 1
  yabai -m space --create >/dev/null 2>&1
  sleep 1
  after=$(yabai -m query --spaces 2>/dev/null | python3 -c 'import json,sys; print(len(json.load(sys.stdin)))' 2>/dev/null)
  [ "$after" = "$((before + 1))" ] || return 1
  created=$(yabai -m query --spaces | python3 -c 'import json,sys; print(max(s["index"] for s in json.load(sys.stdin)))')
  yabai -m space --destroy "$created" >/dev/null 2>&1
  return 0
}
if sa_ok; then
  ok "scripting addition live (space create/destroy works)"
else
  print "  loading SA (needs sudo)…"; sudo yabai --load-sa || true
  sa_ok && ok "scripting addition live" || print "  flip the yabai toggle and re-run me"
fi

# 2. Accessibility: skhd (hotkeys) ----------------------------------------------
say "2/4 Accessibility → skhd"
ax_open "Privacy_Accessibility"
ask "Toggle skhd (/opt/homebrew/bin/skhd) ON, then"
pgrep -x skhd >/dev/null && ok "skhd running" || { brew services start skhd; ok "skhd started"; }

# 3. Accessibility: holzBar (menu bar manager) -----------------------------------
say "3/4 Accessibility → holzBar"
ax_open "Privacy_Accessibility"
ask "Toggle holzBar ON, then"
pgrep -x holzBar >/dev/null || open -a holzBar
sleep 4
if defaults read com.holzcloud.holzBar MacOS27LayoutSeeded 2>/dev/null | grep -q 1; then
  ok "holzBar scanned the menu bar (permission live)"
else
  print "  holzBar has not scanned yet; flip the toggle and re-run me."
fi

# 4. Screen Recording: holzBar (optional: menu bar appearance editing) ------------
say "4/4 Screen Recording → holzBar (optional)"
ax_open "Privacy_ScreenCapture"
ask "Toggle holzBar ON if you want it to theme the bar, then"

# 5. Login Items ------------------------------------------------------------------
say "Login items"
open -a "System Settings" 2>/dev/null || true
ask "Settings → General → Login Items: enable holzBar (+ skhd/sketchybar helpers as you like), then"
osascript -e 'tell application "System Events" to get the name of every login item' 2>/dev/null | tr ',' '\n' | grep -i holzbar >/dev/null \
  && ok "holzBar starts at login" || print "  add /Applications/holzBar.app yourself"

# 6. One-time GUI finishes ----------------------------------------------------------
say "Two one-time GUI finishes (cannot be scripted):"
print "  a) Wallpaper rotation: Settings → Wallpaper → Add Photo… → Choose Folder… →"
print "     $HOME/Pictures/Wallpapers/Mocha → Shuffle, Every 30 Minutes, Randomly, Show on all Spaces."
print "  b) holzBar icon layout: run:  open \"holzbar://settings\""
print "     → Menu Bar Layout → Import Profile… → $REPO/assets/holzbar-mocha.holzbarprofile"
print "     (puts every menu icon in the dropdown shelf; holzBar stays the manager)."
print "  c) Log out and back in once so the unhidden native menu bar + sketchybar stack."

say "Permission pass complete."
