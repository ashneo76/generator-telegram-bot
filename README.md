# generator-telegram-bot [![Build Status](https://secure.travis-ci.org/ashneo76/generator-telegram-bot.png?branch=master)](https://travis-ci.org/ashneo76/generator-telegram-bot)

> [Yeoman](http://yeoman.io) generator


## Getting Started

```bash
npm install -g yo
npm install -g generator-telegram-bot
yo telegram-bot
``` 
* This will create your bot directory.
* To start a bot use `./start.sh` and to stop use: `./stop.sh`
* The logs are stored in `bot.log`
* Perform message parsing in `handlers.py`


## Changelog

#### 0.0.20
  * Add support for sending documents
  * Add logger.debug appropriately

#### 0.0.19
  * Fix the silliest bug of my life

#### 0.0.18
  * Add support for sending non-text messages

#### 0.0.17
  * Add support for non-text messages to the bot

#### 0.0.16
  * Add logger availability to handlers

#### 0.0.15
  * Add support for empty responses

#### 0.0.14
  * Add handlers.py for modularity and code separation

#### 0.0.13
  * Breaking change. Please delete auth_chats.yml, restart and reauthorize
