#!/usr/bin/env python2

import telebot
from telebot import types

import yaml

api = None
tb = None

def main():
    global tb, api
    config = yaml.load(open('config.yml'))

    username = config['telegram']['whoami']
    tb = telebot.TeleBot(config['telegram'][username]['token'])
    tb.set_update_listener(listener)
    tb.polling(interval=1)

    while True:
        pass


def listener(messages):
    for m in messages:
        chat_id = m.chat.id
        tb.send_chat_action(chat_id, 'typing')

        res = ''
        send_markup = False
        res_markup = types.ReplyKeyboardMarkup()

        if m.content_type == 'text':
            msg = m.text

            if msg == '/begin':
                res = 'Hi there!'

        if send_markup:
            tb.send_message(chat_id, res, reply_markup=res_markup)
        else:
            tb.send_message(chat_id, res)


if __name__ == '__main__':
    main()
