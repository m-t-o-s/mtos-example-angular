'use strict'

var welcome = function ($scope, webtorrentFactory) {

  var self = $scope

  self.testVar = 'We are up and running from a required module!'
  self.webTorrent = webtorrentFactory

}

module.exports = welcome
