function $localStorage ($window, $q) {
  return {
    set: function (key, value) {
      var deferred = $q.defer()
      $window.localStorage[key] = value
      deferred.resolve($window.localStorage[key])
      return deferred.promise
    },
    get: function (key, defaultValue) {
      var deferred = $q.defer()
      deferred.resolve($window.localStorage[key] || defaultValue)
      return deferred.promise
    },
    setObject: function (key, value) {
      var deferred = $q.defer()
      $window.localStorage[key] = JSON.stringify(value)
      deferred.resolve(JSON.parse($window.localStorage[key] || '{}'))
      return deferred.promise
    },
    getObject: function (key) {
      var deferred = $q.defer()
      deferred.resolve(JSON.parse($window.localStorage[key] || '{}'))
      return deferred.promise
    }
  }
}

module.exports = window.angular.module('$localStorage', [])
.factory('$localStorage', $localStorage)
