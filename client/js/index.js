'use strict'

var angular = require('angular')

angular.module('mtos', [
  require('./modules/webtorrent').name
])
.constant('version', require('../../package.json').version)
.controller('WelcomeCtrl', require('./welcome/welcome.controller'))
