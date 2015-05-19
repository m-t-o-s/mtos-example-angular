'use strict'

var JSZip = require('jszip')

function archiveService ($window) {
  var service = {}

  service.exportData = function (object) {
    var archive = {}

    var localStorageKeys
    if (object === undefined) {
      localStorageKeys = Object.keys($window.localStorage)
      for (var i = 0; i < localStorageKeys.length; i++) {
        var value = $window.localStorage.getItem(localStorageKeys[i])
        if (value !== 'undefined') {
          archive[localStorageKeys[i]] = JSON.parse(value)
        }
        delete archive.debug
        delete archive.serverKey
      }
    } else {
      archive = object
    }

    return JSON.stringify(archive, null, '  ')
  }

  service.exportZip = function (object) {
    console.log('exporting', object)
    var zip = new JSZip()
    var folder = zip.folder('mtos-backup')
    folder.file('localStorage.json', service.exportData(object))
    var blob = zip.generate({type: 'blob'})
    var blobURL = $window.URL.createObjectURL(blob)
    $window.open(blobURL)
  }

  service.loadLocalStorageData = function (zipfile) {
    var unzip = new JSZip(zipfile)
    var localStorageString = unzip.file('mtos-backup/localStorage.json').asText()
    var localStorageSettings = JSON.parse(localStorageString)
    var localStorageKeys = Object.keys(localStorageSettings)

    for (var i = 0; i < localStorageKeys.length; i++) {
      var value = localStorageSettings[localStorageKeys[i]]
      $window.localStorage.setItem(localStorageKeys[i], JSON.stringify(value))
    }
    $window.location.reload()
  }

  return service
}

module.exports = window.angular.module('$localStorageArchive', [])
.service('$localStorageArchive', archiveService)
.directive('fileread', function () {
  return {
    scope: {
      fileread: '='
    },
    link: function (scope, element, attributes) {
      element.bind('change', function (changeEvent) {
        var reader = new window.FileReader()
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result
          })
        }
        reader.readAsArrayBuffer(changeEvent.target.files[0])
      })
    }
  }
})
