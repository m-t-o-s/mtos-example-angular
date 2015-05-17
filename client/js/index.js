'use strict'

var angular = require('angular')

angular.module('mtosClient', [
  require('./modules/localStorage.factory').name,
  require('./modules/mtos.factory').name,
  require('./modules/emojiprint.filter').name,
  require('angular-ui-router')
])

.constant('version', require('../../package.json').version)

.service('broadcastService', function ($rootScope) {
  this.broadcast = function (message) {
    $rootScope.$broadcast(message)
  }
  this.listen = function (message, callback) {
    $rootScope.$on(message, callback)
  }
})
.run(function ($localStorage, $rootScope, $q, mtos, broadcastService) {
  $localStorage.getObject('serverKey')
  .then(function (serverKey) {
    console.log('mtos loaded server key from localStorage', serverKey)
    if (serverKey.privateKeyString === undefined) {
      console.log('generating server key')
      return mtos.newServerKey()
      .then(function (keypair) {
        console.log('mtos generated server key', keypair)
        var storedKey = {
          publicKeyFingerprint: keypair.publicKeyFingerprint,
          publicKeyString: keypair.publicKeyString,
          privateKeyString: keypair.privateKeyString
        }
        return $localStorage.setObject('serverKey', storedKey)
      })
    } else {
      var deferred = $q.defer()
      deferred.resolve(serverKey)
      return deferred.promise
    }
  })
  .then(function (serverKey) {
    mtos.serverKey = serverKey
    console.log('mtos loaded server key', serverKey)
    broadcastService.broadcast('server key loaded')
    return serverKey
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
