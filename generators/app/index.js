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
      this.fs.copy(
        this.templatePath('_bot.py'),
        this.destinationPath('bot.py')
      );
      this.fs.copy(
        this.templatePath('_requirements.txt'),
        this.destinationPath('requirements.txt')
      );
      this.fs.copyTpl(
        this.templatePath('_config.yml'),
        this.destinationPath('config.yml'),
        {
          name: this.props.name,
          username: this.props.username,
          token: this.props.token
        });
    },

    projectfiles: function () {
    }
  },

  install: function () {
    this.spawnCommand('pip', ['install', '-r', 'requirements.txt']);
  }
});
