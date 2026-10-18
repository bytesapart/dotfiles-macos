# Source zsh plugins
source $(brew --prefix)/share/zsh-fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# Aliases for common dirs
alias home="cd ~"

# System Aliases
alias ..="cd .."
alias x="exit"

# Git Aliases
alias add="git add"
alias commit="git commit"
alias pull="git pull"
alias stat="git status"
alias gdiff="git diff HEAD"
alias vdiff="git difftool HEAD"
alias log="git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
alias cfg="git --git-dir=$HOME/dotfiles/ --work-tree=$HOME"
alias push="git push"
alias g="lazygit"

eval "$(starship init zsh)"
eval "$(zoxide init --cmd cd zsh)"

alias ssh="TERM=xterm-256color ssh"

alias n="nnn"
function nnn () {
  command nnn "$@"

  if [ -f "$NNN_TMPFILE" ]; then
          . "$NNN_TMPFILE"
  fi
}

function kill () {
  command kill -KILL $(pidof "$@")
}

function suyabai () {
  SHA256=$(shasum -a 256 /opt/homebrew/bin/yabai | awk "{print \$1;}")
  if [ -f "/private/etc/sudoers.d/yabai" ]; then
    sudo sed -i '' -e 's/sha256:[[:alnum:]]*/sha256:'${SHA256}'/' /private/etc/sudoers.d/yabai
  else
    echo "sudoers file does not exist yet"
  fi
}

# Color Scheme (Catppuccin Mocha)
export BLACK=0xff11111b
export WHITE=0xffcdd6f4
export RED=0xfff38ba8
export GREEN=0xffa6e3a1
export BLUE=0xff89b4fa
export YELLOW=0xfff9e2af
export ORANGE=0xfffab387
export MAGENTA=0xffcba6f7
export GREY=0xff7f849c
export TRANSPARENT=0x00000000
export BG0=0xff1e1e2e
export BG1=0xff313244
export BG2=0xff45475a

source "$HOME/.cargo/env"

# Only load conda into path but dont actually use the bloat that comes with it
export PATH="$HOME/miniforge3/bin:/usr/local/anaconda3/bin:$PATH:$(brew --prefix)/opt/llvm/bin"
export NNN_TMPFILE="$HOME/.config/nnn/.lastd"
export NNN_OPTS="AdHoU"
export NNN_FCOLORS='c1e2272e006033f7c6d6abc4'
export EDITOR="$(which hx)"
export VISUAL="$(which hx)"
export MANPAGER="$(which nvim) +Man!"
export XDG_CONFIG_HOME="$HOME/.config"
