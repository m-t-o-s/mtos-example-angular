'use strict'

var welcome = function ($scope, webtorrentFactory, version) {

  var self = $scope

  self.testVar = 'We are up and running from a required module in version '+version+'.'
  self.webTorrent = webtorrentFactory

}

module.exports = welcome
