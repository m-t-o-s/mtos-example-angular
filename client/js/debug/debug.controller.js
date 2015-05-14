'use strict'

var welcome = function ($scope, webtorrentFactory, version) {

  var self = this

  self.data = 'here\'s teh data'
  self.webTorrent = webtorrentFactory

  self.save = function () {
    return self.webTorrent.createTextFile(self.data)
    .then(function (torrent) {
      self.webTorrent.readTextFile(torrent)
      .then(function (text) {
        console.log(text)
      })
      return torrent
    })
  }

}

module.exports = welcome
