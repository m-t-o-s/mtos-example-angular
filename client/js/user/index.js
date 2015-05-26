'use strict'

module.exports = window.angular.module('mtosUser', [
  require('angular-ui-router')
])
  .config(function ($stateProvider) {
    $stateProvider
    .state('user', {
      parent: 'default',
      url: '^/user',
      controller: 'mtosUserController',
      controllerAs: 'user',
      templateUrl: 'js/user/user.template.html'
    })
  })
  .controller('mtosUserController', require('./user.controller'))
