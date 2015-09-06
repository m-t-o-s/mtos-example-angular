'use strict'

var angular = require('angular')

angular.module('mtosClient', [
  require('./modules/localStorage.factory').name,
  require('./modules/localStorage-archive.service').name,
  require('./modules/mtos').name,
  require('./modules/emojiprint.filter').name,
  require('angular-ui-router'),
  require('./debug').name
])

.constant('version', require('../../package.json').version)
.constant('configuration', require('../../config.json'))

.run(function (configuration, mtosKeyService, mtos) {
  mtosKeyService.loadServerKey()
  mtosKeyService.loadUserKeys()
})

.controller('appController', require('./common/app.controller'))

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/debug')
  $stateProvider
  .state('default', {
    abastract: true,
    controller: 'appController',
    controllerAs: 'app',
    templateUrl: 'js/common/app.template.html'
  })
})
