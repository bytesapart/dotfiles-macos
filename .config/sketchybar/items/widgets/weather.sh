#!/bin/sh
# Weather for the SketchyBar weather widget. Location is auto-detected from
# IP by wttr.in; override by setting e.g. WEATHER_LOCATION="Oslo" in the
# environment sketchybar runs in (the launchd plist EnvironmentVariables).
LOC="${WEATHER_LOCATION:-}"
OUT=$(curl -s --max-time 8 "wttr.in/${LOC}?format=%c+%t" 2>/dev/null)
[ -z "$OUT" ] && OUT="? --"
sketchybar --set "$NAME" label="$OUT"
