'use strict'

var debug = function ($scope, mtosFactory, version) {

  window.debug = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtosFactory

  self.mtos.newServerKey()
  .then(function (keypair) {
    $scope.$apply(function () {
      self.keypair = {
        publicKey: window.forge.ssh.publicKeyToOpenSSH(keypair.publicKey),
        privateKey: window.forge.ssh.privateKeyToOpenSSH(keypair.privateKey)
      }
    })
  })

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

}

module.exports = debug
