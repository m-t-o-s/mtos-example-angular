'use strict'

var mtos = require('mtos')

function mtosFactory () {
  return mtos
}

module.exports = window.angular.module('mtos', [])
  .factory('mtosFactory', mtosFactory)
