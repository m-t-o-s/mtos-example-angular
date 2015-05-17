function keyService ($localStorage, $rootScope, $q, mtos, mtosBroadcastService) {

  var service = {}

  service.loadServerKey = function () {
    return $localStorage.getObject('serverKey')
    .then(function (serverKey) {
      if (serverKey.privateKeyString === undefined) {
        console.log('mtos generating server key')
        return mtos.newServerKey()
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
        console.log('mtos loaded server key strings from localStorage', serverKey)
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

  service.addUserKey = function (options) {
    return mtos.newUserKey(options)
    .then(function (keypair) {
      console.log('mtos generated user key', options.username, keypair)
      var storedKey = {
        publicKeyFingerprint: keypair.publicKeyFingerprint,
        publicKeyString: keypair.publicKeyString,
        privateKeyString: keypair.privateKeyString
      }
      $localStorage.getObject('mtosUsers')
      .then(function (users) {
        console.log(users)
        users[storedKey.publicKeyFingerprint.replace(/\:/g, '')] = {
          keypair: storedKey,
          username: options.username,
          mtID: storedKey.publicKeyFingerprint.replace(/\:/g, '')
        }
        $localStorage.setObject('users', users)
      })
      return keypair
    })
  }

  return service
}

module.exports = keyService
