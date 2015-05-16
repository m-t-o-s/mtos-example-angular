'use strict'

var angular = require('angular')

angular.module('mtosClient', [
  require('./modules/localStorage.factory').name,
  require('./modules/mtos.factory').name,
  require('./modules/emojiprint.filter').name,
  require('angular-ui-router')
])

.constant('version', require('../../package.json').version)

.run(function ($localStorage, $rootScope, mtos) {
  return $localStorage.getObject('serverKey')
  .then(function (serverKey) {
    console.log('mtos loaded key from localStorage', serverKey)
    if (serverKey.privateKeyString === undefined) {
      return mtos.newServerKey()
      .then(function (keypair) {
        console.log('mtos generated key', keypair)
        mtos.serverKey = keypair
        var storedKey = {
          publicKeyFingerprint: keypair.publicKeyFingerprint,
          publicKeyString: keypair.publicKeyString,
          privateKeyString: keypair.privateKeyString
        }
        return $localStorage.setObject('serverKey', storedKey)
      })
    } else {
      mtos.serverKey = serverKey
      return serverKey
    }
  })
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
