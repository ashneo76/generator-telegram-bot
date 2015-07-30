#!/bin/bash
PID_FILE=bot.pid
if [ ! -f $PID_FILE ]; then
    python2 bot.py 2>&1 &> bot.log &
    PID=$!
    echo $PID > $PID_FILE
    echo "Bot started. PID: $PID"
else
    PID=$(cat $PID_FILE)
    echo "Bot already started. PID: $PID"
fi
