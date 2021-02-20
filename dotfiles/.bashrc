export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"

export PATH=/usr/local/bin:/usr/local/sbin:$PATH
#export PATH="/usr/local/opt/node@8/bin:$PATH"
#export PATH="/usr/local/opt/node@10/bin:$PATH"
export PATH="/usr/local/opt/node@12/bin:$PATH"
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

# coreutils
PATH=$(brew --prefix coreutils)/libexec/gnubin:$PATH
alias ls='gls -lhF --show-control-chars --color=auto'
eval `gdircolors -b $HOME/.dir_colors`

# virtualenvwrapper
export VIRTUALENVWRAPPER_PYTHON=/usr/local/opt/python/libexec/bin/python
export WORKON_HOME=~/venv
source /usr/local/bin/virtualenvwrapper.sh
#[ -f /etc/bash_completion.d/virtualenvwrapper ] && source /etc/bash_completion.d/virtualenvwrapper
#export PIP_VIRTUALENV_BASE=$WORKON_HOME
#export PIP_RESPECT_VIRTUALENV=true

# Go
export PATH=$PATH:/usr/local/opt/go/libexec/bin

# Android
export ANT_HOME=/usr/local/opt/ant
export MAVEN_HOME=/usr/local/opt/maven
export GRADLE_HOME=/usr/local/opt/gradle
export ANDROID_HOME=/usr/local/opt/android-sdk
export ANDROID_NDK_HOME=/usr/local/opt/android-ndk

export PATH=$ANT_HOME/bin:$PATH
export PATH=$MAVEN_HOME/bin:$PATH
export PATH=$GRADLE_HOME/bin:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/build-tools/19.1.0:$PATH

# Add GHC 7.8.3 to the PATH, via http://ghcformacosx.github.io/
export GHC_DOT_APP="/Applications/ghc-7.8.3.app"
if [ -d "$GHC_DOT_APP" ]; then
    export PATH="${HOME}/.cabal/bin:${GHC_DOT_APP}/Contents/bin:${PATH}"
fi

# homebrew
export HOMEBREW_NO_AUTO_UPDATE=1

# npm
# export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
export ELECTRON_MIRROR="http://cdn.lisitede.com/npm/mirrors/electron/"
export ADBLOCK=true
export DISABLE_OPENCOLLECTIVE=true

# flutter
export PATH=/Users/xushuaizhe/sdk/flutter/bin:$PATH

alias cat='ccat'
alias gp='gulp'
alias wp='webpack'
alias wpba='./node_modules/.bin/webpack-bundle-analyzer'
alias code='/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code'
alias dc='docker-compose'
