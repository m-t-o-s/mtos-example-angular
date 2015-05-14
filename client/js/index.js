'use strict'

var angular = require('angular')

angular.module('mtos', [
  require('./modules/webtorrent').name,
  require('angular-ui-router')
])

.constant('version', require('../../package.json').version)

.controller('DebugController', require('./debug/debug.controller'))

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/debug')
  $stateProvider
  .state('debug', {
    url: '/debug',
    controller: 'DebugController',
    controllerAs: 'debug',
    templateUrl: 'js/debug/debug.template.html'
  })
})
