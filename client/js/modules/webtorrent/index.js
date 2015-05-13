'use strict'

var WebTorrent = require('webtorrent')

var client = new WebTorrent()

function webtorrentFactory () {
  var factory = {}

  factory.client = client

  return factory
}

module.exports = window.angular.module('webtorrent', [])
  .factory('webtorrentFactory', webtorrentFactory)
