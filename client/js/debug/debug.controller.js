'use strict'

var debug = function ($scope, mtos, version, broadcastService) {

  window.debugController = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtos

  broadcastService.listen('server key loaded', function () {
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

}

module.exports = debug
