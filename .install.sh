#!/bin/zsh

# Install xCode cli tools
echo "Installing commandline tools..."
xcode-select --install

# Homebrew
## Install
echo "Installing Brew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew analytics off

## Taps
echo "Tapping Brew..."
brew tap FelixKratz/formulae
brew tap asmvik/formulae

## Formulae
echo "Installing Brew Formulae..."
### Essentials
brew install gsl
brew install llvm
brew install boost
brew install libomp
brew install armadillo
brew install wget
brew install jq
brew install ripgrep
brew install bear
brew install mas
brew install gh
brew install ifstat
brew install switchaudio-osx
brew install skhd
brew install sketchybar
brew install borders
brew install yabai

### Science
brew install hdf5
brew install gnuplot
brew install texlab

### Terminal
brew install neovim
brew install helix
brew install starship
brew install zsh-autosuggestions
brew install zsh-fast-syntax-highlighting
brew install zoxide
brew install eza
brew install bat
brew install fd
brew install fzf
brew install git-delta
brew install vivid
brew install fastfetch
brew install tealdeer

### Nice to have
brew install lulu
brew install btop
brew install svim
brew install lazygit
brew install wireguard-go
brew install dooit

### Custom HEAD only forks
brew install fnnn --head # nnn fork (changed colors, keymappings)

## Casks
echo "Installing Brew Casks..."
### Terminals & Browsers
brew install --cask alacritty
brew install --cask kitty
brew install --cask orion

### Office
brew install --cask inkscape
brew install --cask libreoffice
brew install --cask zoom
brew install --cask meetingbar
brew install --cask skim
brew install --cask vlc

### Reversing
brew install --cask machoview
brew install --cask hex-fiend
brew install --cask cutter
brew install --cask sloth

### Nice to have
brew install --cask alfred
brew install --cask spotify

### Fonts
brew install --cask sf-symbols
brew install --cask font-sf-mono
brew install --cask font-sf-pro
brew install --cask font-hack-nerd-font
brew install --cask font-jetbrains-mono
brew install --cask font-fira-code

# Mac App Store Apps
echo "Installing Mac App Store Apps..."
mas install 497799835 #xCode

# macOS Settings
echo "Changing macOS defaults..."
defaults write com.apple.NetworkBrowser BrowseAllInterfaces 1
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.spaces spans-displays -bool false
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock "mru-spaces" -bool "false"
defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
defaults write com.apple.LaunchServices LSQuarantine -bool false
defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false
defaults write NSGlobalDomain KeyRepeat -int 1
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false
defaults write NSGlobalDomain AppleShowAllExtensions -bool true
defaults write NSGlobalDomain _HIHideMenuBar -bool true
defaults write NSGlobalDomain AppleHighlightColor -string "0.65098 0.85490 0.58431"
defaults write NSGlobalDomain AppleAccentColor -int 1
defaults write com.apple.screencapture location -string "$HOME/Desktop"
defaults write com.apple.screencapture disable-shadow -bool true
defaults write com.apple.screencapture type -string "png"
defaults write com.apple.finder DisableAllAnimations -bool true
defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool false
defaults write com.apple.finder ShowHardDrivesOnDesktop -bool false
defaults write com.apple.finder ShowMountedServersOnDesktop -bool false
defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool false
defaults write com.apple.Finder AppleShowAllFiles -bool true
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false
defaults write com.apple.finder _FXShowPosixPathInTitle -bool true
defaults write com.apple.finder FXPreferredViewStyle -string "Nlsv"
defaults write com.apple.finder ShowStatusBar -bool false
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool YES
defaults write com.apple.Safari AutoOpenSafeDownloads -bool false
defaults write com.apple.Safari IncludeDevelopMenu -bool true
defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true
defaults write NSGlobalDomain WebKitDeveloperExtras -bool true
defaults write com.apple.mail AddressesIncludeNameOnPasteboard -bool false
defaults write -g NSWindowShouldDragOnGesture YES

## Fix for MX Master 3S
sudo defaults write /Library/Preferences/com.apple.airport.bt.plist bluetoothCoexMgmt Hybrid

# Copying and checking out configuration files
echo "Planting Configuration Files..."
[ ! -d "$HOME/dotfiles" ] && git clone --bare git@github.com:bytesapart/dotfiles-macos.git $HOME/dotfiles
git --git-dir=$HOME/dotfiles/ --work-tree=$HOME checkout master

# Installing Fonts
git clone git@github.com:shaunsingh/SFMono-Nerd-Font-Ligaturized.git /tmp/SFMono_Nerd_Font
mv /tmp/SFMono_Nerd_Font/* $HOME/Library/Fonts
rm -rf /tmp/SFMono_Nerd_Font/

curl -L https://github.com/kvndrsslr/sketchybar-app-font/releases/download/v2.0.28/sketchybar-app-font.ttf -o $HOME/Library/Fonts/sketchybar-app-font.ttf

# Installing helix language server
git clone https://github.com/estin/simple-completion-language-server.git /tmp/simple-completion-language-server
(cd /tmp/simple-completion-language-server && cargo install --path .)
rm -rf /tmp/simple-completion-language-server


source $HOME/.zshrc
cfg config --local status.showUntrackedFiles no

# yabai on macOS 27: upstream yabai (v7.1.25) has no working scripting
# addition there (its payload rejects major version 27), so `space --focus`
# is a silent no-op. Build/install the patched fork instead; it verifies the
# Dock offsets for this machine before touching anything.
# See install_yabai_macos27.sh (checked out above) for details.
if [ "$(sw_vers -productVersion | cut -d. -f1)" -ge 27 ]; then
  echo "Installing patched yabai for macOS 27..."
  $HOME/install_yabai_macos27.sh
fi

# lazygit reads its config from Application Support on macOS, not .config
mkdir -p "$HOME/Library/Application Support/lazygit"
cp "$HOME/.config/lazygit/config.yml" "$HOME/Library/Application Support/lazygit/config.yml"

# Pretty git diffs via delta (bat theme is in .config/bat; rebuild its cache
# after the checkout above so delta can see the Catppuccin Mocha theme)
bat cache --build 2>/dev/null || true
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.line-numbers true
git config --global delta.hyperlinks true
git config --global delta.syntax-theme 'Catppuccin Mocha'
git config --global merge.conflictstyle diff3
git config --global diff.colorMoved default

# Start Services
echo "Starting Services (grant permissions)..."
brew services start skhd
yabai --start-service
brew services start sketchybar
brew services start borders
brew services start svim

csrutil status
echo "(optional) Disable SIP for advanced yabai features."
echo "Installation complete...\n"
