'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('telegram-bot:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ username: 'test-bot' })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'test-bot/config.yml',
      'test-bot/bot.py',
      'test-bot/requirements.txt',
      'test-bot/.gitignore',
      'test-bot/start.sh',
      'test-bot/stop.sh',
      'test-bot/status.sh'
    ]);
  });
});
