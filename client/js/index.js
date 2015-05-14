'use strict'

var angular = require('angular')

angular.module('mtos', [
  require('./modules/webtorrent').name,
  require('angular-ui-router')
])

.constant('version', require('../../package.json').version)

.controller('DebugController', require('./welcome/welcome.controller'))

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/debug')
  $stateProvider
  .state('debug', {
    url: '/debug',
    controller: 'DebugController',
    templateUrl: 'js/welcome/welcome.template.html'
  })
})
