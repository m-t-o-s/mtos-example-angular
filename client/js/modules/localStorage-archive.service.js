'use strict'

var JSZip = require('jszip')

function archiveService ($window) {
  var service = {}

  service.exportLocalStorageData = function () {
    var localStorageData = {}

    var localStorageKeys = Object.keys($window.localStorage)

    for (var i = 0; i < localStorageKeys.length; i++) {
      var value = $window.localStorage.getItem(localStorageKeys[i])
      if (value !== 'undefined') {
        localStorageData[localStorageKeys[i]] = JSON.parse(value)
      }
    }

    return JSON.stringify(localStorageData, null, '  ')
  }

  service.exportData = function () {
    var zip = new JSZip()
    var folder = zip.folder('mtos-backup')
    folder.file('localStorage.json', service.exportLocalStorageData())
    var blob = zip.generate({type: 'blob'})
    var blobURL = $window.webkitURL.createObjectURL(blob)
    $window.open(blobURL)
  }

  return service
}

module.exports = window.angular.module('$localStorageArchive', [])
.service('$localStorageArchive', archiveService)
