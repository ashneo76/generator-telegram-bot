#!/bin/bash
PID=bot.pid
if [ -f $PID ]; then
    kill -9 $(cat $PID)
    rm -rf $PID
fi
