'use strict'

var mtos = require('mtos')

function webtorrentFactory () {
  return mtos
}

module.exports = window.angular.module('webtorrent', [])
  .factory('webtorrentFactory', webtorrentFactory)
