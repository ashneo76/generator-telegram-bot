#!/bin/bash
PID_FILE=bot.pid
if [ -f $PID_FILE ]; then
    PID=$(cat $PID_FILE)
    kill -9 $PID
    if [ $? -eq "0" ]; then
        echo "Bot stopped. PID: $PID"
        rm -rf $PID_FILE
    fi
fi
