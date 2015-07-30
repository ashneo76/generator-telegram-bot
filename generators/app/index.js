'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var yaml = require('js-yaml');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the excellent ' + chalk.red('TelegramBot') + ' generator!'
    ));

    var prompts = [{
        name: 'name',
        message: 'What is the bot name?'
      },
      {
        name: 'username',
        message: 'What is the bot username?'
      },
      {
        name: 'token',
        message: 'What is the bot secret token?'
      },
      {
        name: 'auth_enabled',
        message: 'Do you want to enable authorization?',
        default: false,
        type: 'confirm'
      },
      {
        when: function(props) {
          return props.auth_enabled;
        },
        name: 'auth_max_chats',
        default: 1,
        message: 'What is the maximum number of authorized chats?'
      },
      {
        when: function(props) {
          return props.auth_enabled;
        },
        name: 'auth_timeout',
        default: 60000,
        message: 'What is the timeout for authorization tokens in milliseconds?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var botname = this.props.username;
      this.fs.copy(
        this.templatePath('_bot.py'),
        this.destinationPath(botname+'/bot.py')
      );
      this.fs.copy(
        this.templatePath('_requirements.txt'),
        this.destinationPath(botname+'/requirements.txt')
      );
      this.fs.copyTpl(
        this.templatePath('_config.yml'),
        this.destinationPath(botname+'/config.yml'),
        {
          name: this.props.name,
          username: this.props.username,
          token: this.props.token,
          auth_enabled: this.props.auth_enabled ? 'True' : 'False',
          auth_max_chats: this.props.auth_max_chats,
          auth_timeout: this.props.auth_timeout
        }
      );
      this.fs.copy(
        this.templatePath('.gitignore'),
        this.destinationPath(botname+'/.gitignore')
      );
      this.fs.copy(
        this.templatePath('_start.sh'),
        this.destinationPath(botname+'/start.sh')
      );
      this.fs.copy(
        this.templatePath('_stop.sh'),
        this.destinationPath(botname+'/stop.sh')
      );
      this.fs.copy(
        this.templatePath('_status.sh'),
        this.destinationPath(botname+'/status.sh')
      );
      this.fs.copy(
        this.templatePath('_handlers.py'),
        this.destinationPath(botname+'/handlers.py')
      );
    },

    projectfiles: function () {
    }
  },

  install: function () {
    if(!this.options.skipInstall) {
      this.spawnCommand('pip2', ['install', '-r', this.props.username+'/requirements.txt']);
    }
  }
});
