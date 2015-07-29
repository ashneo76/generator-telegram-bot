#!/bin/bash
if [ -f bot.pid ]; then
    PID=$(cat bot.pid)
    ps j $PID
fi
