'use strict'

module.exports = window.angular.module('mtos', [])
  .factory('mtos', require('./mtos.factory'))
  .service('mtosBroadcastService', require('./broadcast.service'))
  .service('mtosKeyService', require('./key.service'))
