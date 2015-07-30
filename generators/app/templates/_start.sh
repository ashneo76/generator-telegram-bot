#!/bin/bash
python2 bot.py 2>&1 &> bot.log &
PID=$!
echo $PID > bot.pid
echo "Bot started. PID: $PID"
