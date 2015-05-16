'use strict'

var mtos = require('mtos')

function mtosFactory () {
  window.mtos = mtos
  return mtos
}

module.exports = window.angular.module('mtos', [])
  .factory('mtosFactory', mtosFactory)
