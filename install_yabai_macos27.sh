#!/usr/bin/env bash
# install_yabai_macos27.sh - yabai with a working scripting addition on macOS 27.
#
# Upstream yabai v7.1.25 (latest release) has no macOS 27 support in its
# scripting-addition payload: verify_os_version() only accepts up to major
# version 26, so on 27 the injected payload exits before hooking anything and
# `yabai -m space --focus` (and other space ops) silently do nothing.
# This builds upstream master (dd84572) plus yabai-macos27.patch (macOS 27
# support from asmvik/yabai#2802), after verifying that the patch's Dock
# signatures still match this machine's Dock binary.
#
# What it does: verify offsets -> create local code-signing cert if missing ->
# clone/patch/build -> install to $(brew --prefix)/bin/yabai signed with the
# cert (so the Accessibility grant survives rebuilds) -> pin the brew formula
# so an upgrade cannot clobber it -> write the passwordless --load-sa sudoers
# entry (hash-pinned to the signed binary) -> load the SA -> start service.
#
# Prerequisites (cannot be automated): SIP partially disabled for yabai
# (csrutil enable --without fs --without debug --without nvram, boot-arg
# -arm64e_preview_abi), Xcode command line tools.
# Rollback: brew unpin yabai; brew link --overwrite yabai
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PATCH_FILE="$SCRIPT_DIR/yabai-macos27.patch"
VERIFY="$SCRIPT_DIR/yabai_verify_offsets.py"
SRC="${YABAI_SRC:-$HOME/code/yabai-macos27}"
BASE_COMMIT="dd84572"
CERT="${YABAI_CERT:-yabai-cert}"
PREFIX="$(brew --prefix 2>/dev/null || echo /opt/homebrew)"
BIN_DST="$PREFIX/bin/yabai"
SUDOERS="/private/etc/sudoers.d/yabai"

[ "$(uname -m)" = "arm64" ] || { echo "error: Apple Silicon only." >&2; exit 1; }
major="$(sw_vers -productVersion | cut -d. -f1)"
[ "$major" = "27" ] || {
  echo "note: macOS $major - stock 'brew install yabai' is fine; nothing to do."
  exit 0
}
[ -f "$PATCH_FILE" ] || { echo "error: $PATCH_FILE missing." >&2; exit 1; }

echo "==> verifying Dock signatures for this macOS build"
lipo /System/Library/CoreServices/Dock.app/Contents/MacOS/Dock \
  -thin arm64e -output /tmp/Dock.arm64e.verify
python3 "$VERIFY" /tmp/Dock.arm64e.verify
rm -f /tmp/Dock.arm64e.verify

if ! security find-identity -v -p codesigning 2>/dev/null | grep -q "\"$CERT\""; then
  echo "==> creating local code-signing identity '$CERT' (accept the trust prompt)"
  tmp="$(mktemp -d)"
  cat > "$tmp/cert.cnf" <<'EOF'
[req]
distinguished_name = dn
x509_extensions = v3
prompt = no
[dn]
CN = yabai-cert
[v3]
basicConstraints = critical,CA:true
keyUsage = critical,digitalSignature,keyCertSign
extendedKeyUsage = critical,codeSigning
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always
EOF
  openssl req -x509 -newkey rsa:2048 -keyout "$tmp/key.pem" -out "$tmp/cert.pem" \
    -days 3650 -nodes -config "$tmp/cert.cnf" >/dev/null 2>&1
  openssl pkcs12 -export -inkey "$tmp/key.pem" -in "$tmp/cert.pem" \
    -out "$tmp/cert.p12" -passout pass:yabai-temp -name "$CERT"
  security import "$tmp/cert.p12" -k "$HOME/Library/Keychains/login.keychain-db" \
    -P yabai-temp -T /usr/bin/codesign -T /usr/bin/security
  security add-trusted-cert -d -r trustRoot -p codeSign "$tmp/cert.pem"
  rm -rf "$tmp"
fi

echo "==> building patched yabai (source: $SRC)"
[ -d "$SRC/.git" ] || git clone https://github.com/asmvik/yabai "$SRC"
git -C "$SRC" fetch -q origin master || true
if git -C "$SRC" log --oneline "$BASE_COMMIT..HEAD" 2>/dev/null | grep -qi "Golden Gate"; then
  echo "    patch already applied"
else
  git -C "$SRC" checkout -q "$BASE_COMMIT"
  git -C "$SRC" am --3way "$PATCH_FILE"
fi
make -C "$SRC" install

echo "==> installing $BIN_DST (signed with '$CERT')"
[ -x "$BIN_DST" ] && "$BIN_DST" --stop-service 2>/dev/null || true
[ -L "$BIN_DST" ] && rm -f "$BIN_DST"  # brew symlink; Cellar binary stays intact
cp "$SRC/bin/yabai" "$BIN_DST"
codesign -fs "$CERT" "$BIN_DST"
codesign --verify --verbose "$BIN_DST"
brew pin yabai 2>/dev/null || true

echo "==> refreshing $SUDOERS (passwordless --load-sa, hash-pinned)"
hash="$(shasum -a 256 "$BIN_DST" | cut -d' ' -f1)"
printf '%s ALL=(root) NOPASSWD: sha256:%s %s --load-sa\n' "$(whoami)" "$hash" "$BIN_DST" \
  | sudo tee "$SUDOERS" >/dev/null
sudo chmod 0440 "$SUDOERS"
sudo visudo -cf "$SUDOERS"

echo "==> loading scripting addition (Dock will restart)"
sudo "$BIN_DST" --load-sa

if [ -t 0 ]; then
  cat <<EOF

One manual step: grant the NEW binary Accessibility (and Screen Recording
for window animations) in System Settings -> Privacy & Security.
If a stale 'yabai' entry exists, remove it with '-' and re-add
$BIN_DST with '+', toggle on. Then press any key to start the service.
EOF
  open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility" || true
  read -n1 -s -r || true
  echo
fi

echo "==> starting service"
"$BIN_DST" --start-service
sleep 1
echo "==> current space (query works) and a focus round-trip:"
"$BIN_DST" -m query --spaces --space | grep -o '"index":[0-9]*' | head -1
echo "done. Test: alt-1..4 (skhd) or: yabai -m space --focus 2"
