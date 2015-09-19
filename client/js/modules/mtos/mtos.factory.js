'use strict'

var MTOS = require('mtos')

function mtosFactory () {
  var mtos = new MTOS()
  window.mtos = mtos
  return mtos
}

module.exports = mtosFactory
