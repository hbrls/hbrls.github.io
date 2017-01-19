export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"

export PATH=/usr/local/bin:$PATH

# coreutils
PATH=$(brew --prefix coreutils)/libexec/gnubin:$PATH
alias ls='ls -lhF --show-control-chars --color=auto'
eval `gdircolors -b $HOME/.dir_colors`

# virtualenvwrapper
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python
export VIRTUALENVWRAPPER_VIRTUALENV_ARGS='--no-site-packages'
export WORKON_HOME=~/venvs
[ -f /usr/local/bin/virtualenvwrapper.sh ] && source /usr/local/bin/virtualenvwrapper.sh
[ -f /etc/bash_completion.d/virtualenvwrapper ] && source /etc/bash_completion.d/virtualenvwrapper
export PIP_VIRTUALENV_BASE=$WORKON_HOME
export PIP_RESPECT_VIRTUALENV=true

# Add GHC 7.8.3 to the PATH, via http://ghcformacosx.github.io/
export GHC_DOT_APP="/Applications/ghc-7.8.3.app"
if [ -d "$GHC_DOT_APP" ]; then
    export PATH="${HOME}/.cabal/bin:${GHC_DOT_APP}/Contents/bin:${PATH}"
fi

alias cat='ccat'
alias gp='gulp'
alias wp='webpack --bail'
