'use strict'

import angular from 'angular'
import uiRouter from 'angular-ui-router'
import material from 'angular-material'

import packageJSON from '../../package.json'
import configuration from '../../config.json'

import AppController from './app.controller'

import emojiprint from './emojiprint'

angular.module('mtosClient', [
  uiRouter,
  material,
  require('./modules/localStorage.factory').name,
  require('./modules/localStorage-archive.service').name,
  require('./mtos').name,
  emojiprint,
  require('./debug').name
])

.constant('version', packageJSON.version)
.constant('configuration', configuration)

.run(function (configuration, mtosKeyService, mtos) {
  'ngInject'
  mtosKeyService.loadServerKey()
  mtosKeyService.loadUserKeys()
})

.controller('appController', AppController)

.config(function ($stateProvider, $urlRouterProvider) {
  'ngInject'
  $urlRouterProvider.otherwise('/debug')
  $stateProvider
  .state('default', {
    abastract: true,
    controller: 'appController',
    controllerAs: 'app',
    templateUrl: 'app/app.template.html'
  })
})
