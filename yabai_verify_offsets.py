#!/usr/bin/env python3
"""Check that yabai's macOS 27 scripting-addition signatures exist in Dock.

Replicates hex_find_seq() from src/osax/payload.m: starting at each target's
offset, scan forward SCAN_WINDOW bytes for the first pattern match. A pattern
token is a wildcard iff its first character is '?' (so '??' and '?8' both
mean "any byte"), matching the C parser which only tests the high nibble.

Usage: yabai_verify_offsets.py <thinned Dock binary (arm64e)>
Exit code 0 iff every target resolves (OK or MOVED to a printed new offset);
a target with no match anywhere is CHANGED and needs re-derivation in a
disassembler before a patched yabai can work on this macOS build.
"""
import re
import sys

SCAN_WINDOW = 0x1286A0  # hard cap in hex_find_seq()
GRANULARITY = 0x10000  # offsets are match addresses rounded down to this

# Values from the macOS 27 (Golden Gate) patch in yabai-macos27.patch,
# verified against macOS 27.0 beta (26A5353q) and 27.0.1 (26A434), arm64e.
TARGETS = [
    {"name": "dock_spaces", "offset": 0x30000,
     "pattern": "?8 ?? ?? ?? 08 ?? ?? 91 00 01 40 F9 E2 03 13 AA ?? ?? ?? 94 ?? ?? ?? ?? 08"},
    {"name": "dppm", "offset": 0x40000,
     "pattern": "?? ?? 00 ?? 08 ?? ?? 91 00 01 40 F9 E2 03 16 AA E3 03 19 AA ?? ?? ?? 94"},
    {"name": "fix_animation", "offset": 0x210000,
     "pattern": "00 10 6A 1E A8 ?? ?? D1 ?? 01 ?? F8"},
    {"name": "add_space", "offset": 0x210000,
     "pattern": "7F 23 03 D5 E1 03 1E AA ?? ?? ?? 97 FE 03 01 AA ?? ?? ?? A9 FD 43 01 91 F3 03 14 AA F5 03 00 AA 96 8E 43 F8"},
    {"name": "remove_space", "offset": 0x170000,
     "pattern": "7F 23 03 D5 FF ?? ?? D1 FC ?? ?? A9 FA ?? ?? A9 F8 ?? ?? A9 F6 ?? ?? A9 F4 ?? ?? A9 FD ?? ?? A9 FD ?? ?? 91 ?? 03 03 AA F5 03 02 AA F4 03 01 AA"},
    {"name": "move_space", "offset": 0x170000,
     "pattern": "7F 23 03 D5 E3 03 1E AA ?? ?? ?? 97 FE 03 03 AA FD 7B ?? A9 FD ?? ?? 91 F6 03 14 AA"},
    {"name": "set_front_window", "offset": 0x10000,
     "pattern": "?? ?? ?? 34 7F 23 03 D5 FF C3 01 D1 ?? ?? ?? A9 ?? ?? ?? A9 ?? ?? ?? A9 FD 83 01 91 F3 03 01 AA F5 03 00 AA"},
]


def pattern_to_regex(pat):
    parts = [b"." if t[0] == "?" else re.escape(bytes([int(t, 16)]))
             for t in pat.split()]
    return re.compile(b"".join(parts), re.DOTALL)


def main(path):
    data = open(path, "rb").read()
    print(f"binary: {path}  ({len(data)} bytes)\n")
    print(f"{'target':<18} {'offset':>8}  {'#match':>6}  {'match@':>9}  status")
    print("-" * 72)
    ok = moved = changed = 0
    for t in TARGETS:
        matches = [m.start() for m in pattern_to_regex(t["pattern"]).finditer(data)]
        val = next((m for m in matches
                    if t["offset"] <= m < t["offset"] + SCAN_WINDOW), None)
        if val is not None:
            status, ok = "OK", ok + 1
            shown = val
        elif matches:
            status, moved = f"MOVED -> use 0x{matches[0] // GRANULARITY * GRANULARITY:x}", moved + 1
            shown = matches[0]
        else:
            status, changed, shown = "CHANGED", changed + 1, None
        print(f"{t['name']:<18} 0x{t['offset']:05x}  {len(matches):>6}  "
              f"{('0x%x' % shown) if shown is not None else '-':>9}  {status}")
    print(f"\n{ok} OK, {moved} moved, {changed} changed (of {len(TARGETS)} targets)")
    return 1 if changed else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
