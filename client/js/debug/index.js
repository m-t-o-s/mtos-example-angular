'use strict'

module.exports = window.angular.module('mtosDebug', [
  require('angular-ui-router')
])
  .config(function ($stateProvider) {
    $stateProvider
    .state('debug', {
      parent: 'default',
      url: '^/debug',
      controller: 'debugController',
      controllerAs: 'db',
      templateUrl: 'js/debug/debug.template.html'
    })
  })
  .controller('debugController', require('./debug.controller'))
