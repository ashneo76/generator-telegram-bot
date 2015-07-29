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
          token: this.props.token
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
