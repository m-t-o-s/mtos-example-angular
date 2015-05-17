'use strict'

var angular = require('angular')

angular.module('mtosClient', [
  require('./modules/localStorage.factory').name,
  require('./modules/localStorage-archive.service').name,
  require('./modules/mtos').name,
  require('./modules/emojiprint.filter').name,
  require('angular-ui-router')
])

.constant('version', require('../../package.json').version)

.run(function (mtosKeyService) {
  mtosKeyService.loadServerKey()
})

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
