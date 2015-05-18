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
    var options = {
      encrypt: true,
      author: 'bc200d0580e1cb3aca6ece05bde2998e2786c345',
      privateKey: self.users['bc200d0580e1cb3aca6ece05bde2998e2786c345'].keypair.privateKey,
      publicKey: self.users['bc200d0580e1cb3aca6ece05bde2998e2786c345'].keypair.publicKey
    }
    var content = {
      content: self.data
    }
    console.log('calling create', content, options)
    return self.mtos.createContent(content, options)
    .then(function (torrent) {
      self.mtos.readTextFile(torrent)
      .then(function (text) {
        console.log(text)
      })
      return torrent
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
