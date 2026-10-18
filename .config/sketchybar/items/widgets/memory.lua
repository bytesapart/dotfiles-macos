local colors = require("colors")
local settings = require("settings")

local mem = sbar.add("item", "widgets.memory", {
  position = "right",
  icon = {
    string = "mem",
    font = {
      style = settings.font.style_map["Bold"],
      size = 9.0,
    },
  },
  label = {
    string = "??%",
    font = {
      family = settings.font.numbers,
      style = settings.font.style_map["Bold"],
      size = 9.0,
    },
    align = "right",
    padding_right = 0,
    width = 0,
    y_offset = 4,
  },
  padding_right = settings.paddings + 6,
  update_freq = 10,
  popup = { align = "center" },
})

local mem_used = sbar.add("item", {
  position = "popup." .. mem.name,
  icon = { string = "Used:", width = 100, align = "left" },
  label = { string = "??.? GB", width = 100, align = "right" },
})

local mem_wired = sbar.add("item", {
  position = "popup." .. mem.name,
  icon = { string = "Wired:", width = 100, align = "left" },
  label = { string = "??.? GB", width = 100, align = "right" },
})

local mem_comp = sbar.add("item", {
  position = "popup." .. mem.name,
  icon = { string = "Compressed:", width = 100, align = "left" },
  label = { string = "??.? GB", width = 100, align = "right" },
})

local function gb(mb)
  return string.format("%.1f GB", mb / 1024)
end

mem:subscribe({ "routine", "forced", "system_woke" }, function()
  sbar.exec(
    "PSZ=$(pagesize); "
      .. "TOTAL_MB=$(($(sysctl -n hw.memsize) / 1048576)); "
      .. "FREE=$(vm_stat | awk '/Pages free/ {gsub(/\\./, \"\", $3); print $3}'); "
      .. "INACT=$(vm_stat | awk '/Pages inactive/ {gsub(/\\./, \"\", $3); print $3}'); "
      .. "WIRED=$(vm_stat | awk '/Pages wired down/ {gsub(/\\./, \"\", $4); print $4}'); "
      .. "COMP=$(vm_stat | awk '/Pages occupied by compressor/ {gsub(/\\./, \"\", $5); print $5}'); "
      .. "USED_MB=$((TOTAL_MB - (FREE + INACT) * PSZ / 1048576)); "
      .. 'echo "$((USED_MB * 100 / TOTAL_MB))|$((USED_MB))|$((WIRED * PSZ / 1048576))|$((COMP * PSZ / 1048576))"',
    function(output)
      local pct, used, wired, comp =
        output:match("(%d+)|(%d+)|(%d+)|(%d+)")
      if not pct then
        return
      end
      pct = tonumber(pct)

      local color = colors.blue
      if pct > 50 then
        if pct < 70 then
          color = colors.yellow
        elseif pct < 85 then
          color = colors.orange
        else
          color = colors.red
        end
      end

      mem:set({
        icon = { color = color },
        label = pct .. "%",
      })
      mem_used:set({ label = gb(tonumber(used)) })
      mem_wired:set({ label = gb(tonumber(wired)) })
      mem_comp:set({ label = gb(tonumber(comp)) })
    end
  )
end)

mem:subscribe("mouse.clicked", function(env)
  if env.BUTTON == "right" then
    sbar.exec("open -a 'Activity Monitor'")
  else
    mem:set({ popup = { drawing = "toggle" } })
  end
end)

sbar.add("bracket", "widgets.memory.bracket", { mem.name }, {
  background = { color = colors.bg1 },
})

sbar.add("item", "widgets.memory.padding", {
  position = "right",
  width = settings.group_paddings,
})
