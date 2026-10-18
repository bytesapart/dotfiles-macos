local colors = require("colors")
local settings = require("settings")

local weather = sbar.add("item", "widgets.weather", {
  position = "right",
  update_freq = 1800,
  icon = {
    string = "☀",
    font = {
      family = settings.font.text,
      style = settings.font.style_map["Regular"],
      size = 14.0,
    },
  },
  label = {
    string = "...",
    font = {
      family = settings.font.numbers,
      style = settings.font.style_map["Bold"],
      size = 9.0,
    },
    color = colors.white,
  },
  script = "$CONFIG_DIR/items/widgets/weather.sh",
  padding_right = settings.paddings + 6,
})

weather:subscribe("mouse.clicked", function(_)
  sbar.exec("open https://wttr.in")
end)

-- Fetch immediately on (re)load instead of waiting for the first interval.
sbar.exec("NAME=widgets.weather $CONFIG_DIR/items/widgets/weather.sh")

sbar.add("bracket", "widgets.weather.bracket", { weather.name }, {
  background = { color = colors.bg1 }
})

sbar.add("item", "widgets.weather.padding", {
  position = "right",
  width = settings.group_paddings,
})
