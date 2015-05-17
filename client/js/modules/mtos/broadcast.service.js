function broadcastService ($rootScope) {
  this.broadcast = function (message) {
    $rootScope.$broadcast(message)
  }
  this.listen = function (message, callback) {
    $rootScope.$on(message, callback)
  }
}

module.exports = broadcastService
