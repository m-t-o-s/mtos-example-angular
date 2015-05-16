'use strict'

var debug = function ($scope, mtos, version) {

  window.debugController = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtos

  $scope.$watch(mtos.serverKey, function (value) {
    console.log('key', value)
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
