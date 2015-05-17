function keyService ($localStorage, $rootScope, $q, mtos, mtosBroadcastService) {

  var service = {}

  service.loadServerKey = function () {
    return $localStorage.getObject('serverKey')
    .then(function (serverKey) {
      console.log('mtos loaded server key from localStorage', serverKey)
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
      mtosBroadcastService.broadcast('server key loaded')
      return serverKey
    })
  }

  return service
}

module.exports = keyService
