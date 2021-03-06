#!/usr/bin/env python2

import telebot
from telebot import types

import sys
import logging
import string
import random
import yaml
import pyaml
import handlers

api = None
tb = None
config = None
logger = None
token = {}
auth_chats = []

def main():
    global tb, api, config, logger, auth_chats
    config = yaml.load(open('config.yml'))

    try:
        auth_chats = yaml.load(open('auth_chats.yml'))
    except (OSError, IOError) as e:
        auth_chats = []

    username = config['telegram']['whoami']
    tb = telebot.TeleBot(config['telegram'][username]['token'])
    tb.set_update_listener(listener)
    tb.polling(interval=1)

    logger = telebot.logger
    formatter = logging.Formatter('[%(asctime)s] %(thread)d {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s', '%m-%d %H:%M:%S')
    ch = logging.StreamHandler(sys.stdout)
    ch.setFormatter(formatter)
    logger.addHandler(ch)
    logger.setLevel(logging.INFO)

    while True:
        # TODO: expire tokens after a timeout
        pass


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
     return ''.join(random.choice(chars) for _ in range(size))

def listener(messages):
    global config, logger, token, auth_chats
    for m in messages:
        chat_id = m.chat.id
        tb.send_chat_action(chat_id, 'typing')

        res = text_res('')
        send_markup = False
        res_markup = types.ReplyKeyboardMarkup()

        if is_authorized_chat(m):
            if m.content_type == 'text':
                msg = m.text

                if msg == '/begin':
                    res = text_res('Hi there!')
                elif msg.startswith('/pair'):
                    if chat_id in auth_chats:
                        res = text_res('Already authenticated')
                    else:
                        tokens = msg.split(' ')
                        if len(auth_chats) < config['telegram']['authorization']['max_chats']:
                            res = text_res('Please enter authentication token: /auth <token>')
                            token[str(chat_id)] = {'time': None, 'key': id_generator()}
                            logger.info('Authentication token for: ' + str(chat_id) + ': ' + token[str(chat_id)]['key'])
                        else:
                            logger.info('Cannot authenticate: ' + str(chat_id) + ': ' + m.chat.username)
                elif msg.startswith('/auth'):
                    if chat_id in auth_chats:
                        res = text_res('Already authenticated')
                    else:
                        tokens = msg.split(' ')
                        if len(tokens) == 2 and str(chat_id) in token and tokens[1] == token[str(chat_id)]['key']:
                            status = add_auth_chat(chat_id)
                            if status:
                                logger.info('Authenticated chat for: {0} [{1}]'.format(m.chat.username, str(chat_id)))
                                res = text_res('Successfully authenticated.')
                                send_markup = True
                            else:
                                res = text_res('Cannot authenticate.')
                        else:
                            res = text_res('Invalid token. Please try again.')
                else:
                    res = handlers.handle(msg, config, logger)
            else:
                res = text_res('Content type not handled. Just yet!: ' + m.content_type)
        else:
            if len(auth_chats) < config['telegram']['authorization']['max_chats']:
                res = text_res('Unrecognized chat. Please authorize using /pair')
                send_markup = True
                res_markup.row('/pair')
            else:
                res = text_res('Cannot authenticate.')
                logger.info('Failed authentication attempt for: ' + str(chat_id) + ': ' + m.chat.username)

        if res is not None:
            if res['type'] == 'text':
                if send_markup:
                    tb.send_message(chat_id, res['message'], reply_markup=res_markup)
                else:
                    tb.send_message(chat_id, res['message'])
            elif res['type'] == 'image':
                with open(res['path'], 'rb') as f:
                    tb.send_photo(chat_id, f)
                    f.close()
            elif res['type'] == 'document':
                logger.debug('Starting upload:')
                with open(res['path'], 'rb') as f:
                    tb.send_document(chat_id, f)
                    f.close()
                    logger.debug('Done uploading')
            else:
                pass
        else:
            pass

def text_res(msg):
    return {'type': 'text', 'message': msg}


def is_authorized_chat(m):
    global config, auth_chats, logger

    chat_id = m.chat.id
    content_type = m.content_type
    if content_type != 'text' or not hasattr(m, 'text'):
        text = ''
    else:
        text = m.text

    auth = False
    # logger.debug(str(auth_chats))
    logger.debug('is_authorized_chat: ' + str(auth_chats))
    if config['telegram']['authorization']['enabled']:
        auth = (not auth_chats is None and chat_id in auth_chats) \
                or (content_type == 'text' and \
                    (text == '/pair' or \
                     (text.startswith('/auth') and len(text.split(' ')) == 2)))
    else:
        auth = True  # we allow everybody
    return auth


def add_auth_chat(chat_id):
    global config, auth_chats

    status = False

    if auth_chats is None:
        auth_chats = []

    if len(auth_chats) <= config['telegram']['authorization']['max_chats']:
        auth_chats.append(chat_id)
        logger.debug('add_auth_chat: ' + str(auth_chats))

        cfg_file = open('auth_chats.yml', 'w')
        cfg_file.write(pyaml.dump(auth_chats))
        cfg_file.close()
        status = True

    return status


if __name__ == '__main__':
    main()
