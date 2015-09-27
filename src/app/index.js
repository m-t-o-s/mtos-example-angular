'use strict'

import angular from 'angular'
import uiRouter from 'angular-ui-router'

import packageJSON from '../../package.json'
import configuration from '../../config.json'

import AppController from './app.controller'

angular.module('mtosClient', [
  uiRouter,
  require('./modules/localStorage.factory').name,
  require('./modules/localStorage-archive.service').name,
  require('./mtos').name,
  require('./modules/emojiprint.filter').name,
  require('./debug').name
])

.constant('version', packageJSON.version)
.constant('configuration', configuration)

.run(function (configuration, mtosKeyService, mtos) {
  mtosKeyService.loadServerKey()
  mtosKeyService.loadUserKeys()
})

.controller('appController', AppController)

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/debug')
  $stateProvider
  .state('default', {
    abastract: true,
    controller: 'appController',
    controllerAs: 'app',
    templateUrl: 'app/app.template.html'
  })
})
