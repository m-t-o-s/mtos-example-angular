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
