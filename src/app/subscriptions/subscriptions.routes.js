export default function routes ($stateProvider) {
  'ngInject'
  $stateProvider
  .state('subscriptions', {
    data: { pageTitle: 'Subscriptions' },
    url: '/subscriptions',
    parent: 'default',
    templateUrl: 'app/subscriptions/subscriptions.template.html',
    controller: 'SubscriptionsController',
    controllerAs: 'subscriptions'
  })
}
