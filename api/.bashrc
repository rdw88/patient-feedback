alias grep='grep --color=auto'
alias ls='ls --color=auto'

PS1="\[\033[36m\](${SERVICE_ID:-base}) \[\e]0;\u@\h: \w\a\]\[\033[00m\]\u \[\033[01;31m\]:: \[\033[01;32m\]\w \[\033[36m\]»\[\033[00m\] "
