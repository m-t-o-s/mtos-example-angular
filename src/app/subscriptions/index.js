import angular from 'angular'
import uirouter from 'angular-ui-router'

import routing from './subscriptions.routes'
import SubscriptionsController from './subscriptions.controller'

export default angular.module('mtos.subscriptions', [
  uirouter
])
  .config(routing)
  .controller('SubscriptionsController', SubscriptionsController)
  .name
