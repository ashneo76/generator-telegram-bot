#!/bin/bash
python2 bot.py 2>1 > bot.log &
echo $! > bot.pid
