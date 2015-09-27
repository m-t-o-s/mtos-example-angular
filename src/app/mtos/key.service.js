function keyService ($localStorage, $rootScope, $q, mtos, mtosBroadcastService) {
  'ngInject'
  var service = {}

  service.loadServerKey = function () {
    return $localStorage.getObject('serverKey')
    .then(function (serverKey) {
      if (serverKey.privateKeyString === undefined) {
        console.log('mtos generating server key')
        return mtos.generateServerKey()
        .then(function (keypair) {
          console.log('mtos generated server key', keypair)
          var storedKey = {
            publicKeyFingerprint: keypair.publicKeyFingerprint,
            publicKeyString: keypair.publicKeyString,
            privateKeyString: keypair.privateKeyString
          }
          $localStorage.setObject('serverKey', storedKey)
          return keypair
        })
      } else {
        var deferred = $q.defer()
        deferred.resolve(serverKey)
        return deferred.promise
      }
    })
    .then(function (serverKey) {
      if (typeof serverKey.privateKey !== 'object') {
        var usableKeys = mtos.loadKeyFromStrings(serverKey)
        serverKey.privateKey = usableKeys.privateKey
        serverKey.publicKey = usableKeys.publicKey
      }
      return serverKey
    })
    .then(function (serverKey) {
      mtos.serverKey = serverKey
      console.log('mtos loaded server key', serverKey)
      mtosBroadcastService.broadcast('server key loaded')
      return serverKey
    })
  }

  service.loadUserKeys = function () {
    return $localStorage.getObject('users')
    .then(function (users) {
      mtos.users = users
      mtosBroadcastService.broadcast('loaded users')
    })
  }

  service.addUserKey = function (options) {
    return mtos.newUserKey(options)
    .then(function (keypair) {
      var storedKey = {
        publicKeyFingerprint: keypair.publicKeyFingerprint,
        publicKeyString: keypair.publicKeyString,
        privateKeyString: keypair.privateKeyString
      }
      return $localStorage.getObject('users')
      .then(function (users) {
        users[storedKey.publicKeyFingerprint.replace(/\:/g, '')] = {
          keypair: storedKey,
          username: options.username,
          mtID: storedKey.publicKeyFingerprint.replace(/\:/g, '')
        }
        return $localStorage.setObject('users', users)
        .then(function (users) {
          return keypair
        })
      })
    })
  }

  service.unlockUserKey = function (options) {
    var deferred = $q.defer()
    deferred.resolve(mtos.loadKeyFromStrings(mtos.users[options.mtID].keypair, options))
    return deferred.promise
  }

  return service
}

module.exports = keyService
