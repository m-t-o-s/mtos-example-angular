'use strict'

var debug = function ($scope, mtosFactory, version) {

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtosFactory

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
