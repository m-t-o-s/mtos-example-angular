'use strict'

var debug = function ($scope, mtos, version, mtosBroadcastService, mtosKeyService, $localStorageArchive) {

  window.debugController = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtos

  self.users = {}
  self.newUser = {}

  mtosBroadcastService.listen('loaded users', function () {
    self.users = mtos.users
  })
  if (mtos.users) {
    self.users = mtos.users
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

  mtosBroadcastService.listen('server key loaded', function () {
    self.keypair = mtos.serverKey
  })
  if (mtos.serverKey) {
    self.keypair = mtos.serverKey
  }

  self.save = function () {
    return self.mtos.createTextFile(self.data)
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
