'use strict'

var debug = function ($scope, mtos, version, mtosBroadcastService, mtosKeyService, $localStorageArchive) {

  window.debugController = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtos

  self.newUser = {}

  mtosBroadcastService.listen('loaded users', function () {
    self.users = mtos.users
  })
  if (mtos.users) {
    self.users = mtos.users
  } else {
    self.users = {}
  }

  self.addUser = function () {
    var options = {
      passphrase: self.newUser.passphrase,
      username: self.newUser.username
    }
    mtosKeyService.addUserKey(options)
    .then(function (keypair) {
      $scope.$apply(function () {
        var mtID = keypair.publicKeyFingerprint.replace(/\:/g, '')
        self.users[mtID] = {
          username: options.username,
          mtID: mtID,
          passphrase: options.passphrase,
          keypair: keypair
        }
      })
    })
  }

  self.unlockUser = function (mtID) {
    var options = {
      mtID: mtID,
      passphrase: self.passphrases[mtID]
    }
    mtosKeyService.unlockUserKey(options)
    .then(function (usableKeys) {
      if (usableKeys.privateKey !== null) {
        self.users[mtID].keypair.privateKey = usableKeys.privateKey
        self.users[mtID].keypair.publicKey = usableKeys.publicKey
        delete self.passphrases[mtID]
      } else {
        window.alert('incorrect passphrase')
      }
    })
  }

  mtosBroadcastService.listen('server key loaded', function () {
    self.keypair = mtos.serverKey
  })
  if (mtos.serverKey) {
    self.keypair = mtos.serverKey
  }

  self.save = function () {

    var user = self.users[Object.keys(self.users)[0]]

    var options = {
      encrypt: true,
      privateKey: user.keypair.privateKey,
      publicKey: user.keypair.publicKey
    }
    var content = JSON.stringify({
      content: self.data,
      metadata: {
        foo: 'bar'
      }
    })
    console.log('calling create', content, options)
    return self.mtos.createContent(content, options)
    .then(function (torrent) {
      return self.read(torrent)
    })
  }

  self.read = function (torrent) {
    console.log('sending torrent to mtos for reading')
    var user = self.users[Object.keys(self.users)[0]]
    var options = {
      privateKey: user.keypair.privateKey,
      publicKey: user.keypair.publicKey
    }
    return mtos.readContent(torrent, options)
    .then(function (content) {
      $scope.$apply(function () {
        self.parsedData = JSON.parse(content)
        console.log('received content', self.parsedData)
      })
    })
  }

  self.createArchive = $localStorageArchive.exportData

  $scope.$watch('debug.backupFile', function (file) {
    if (file !== undefined) {
      $localStorageArchive.loadLocalStorageData(file)
    }
  })

}

module.exports = debug
