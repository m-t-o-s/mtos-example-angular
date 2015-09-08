'use strict'

var debug = function ($scope, mtos, version, configuration, mtosBroadcastService, mtosKeyService, $localStorage, $localStorageArchive) {
  window.db = this

  var self = this

  self.data = 'here\'s the data'
  self.mtos = mtos
  self.connections = {}
  self.messages = []
  self.authenticatedUsers = []
  self.subscriptions = {}

  /*
  self.swarm = mtos.connect(configuration)

  $scope.$watch

  $scope.$watch('db.subscriptions', function(subscriptions) {
    if self.connections
  })
 */

  $localStorage.getObject('subscribers')
  .then(function (subscribers) {
    self.subscribers = subscribers
    self.messageTarget = subscribers[Object.keys(subscribers)[0]].mtID
  })

  self.newUser = {}

  mtosBroadcastService.listen('loaded users', function () {
    self.users = mtos.users
  })
  if (mtos.users) {
    self.users = mtos.users
  } else {
    self.users = {}
  }

  self.addUser = function () {
    var options = {
      passphrase: self.newUser.passphrase,
      username: self.newUser.username
    }
    mtosKeyService.addUserKey(options)
    .then(function (keypair) {
      $scope.$apply(function () {
        var mtID = keypair.publicKeyFingerprint.replace(/\:/g, '')
        self.users[mtID] = {
          username: options.username,
          mtID: mtID,
          passphrase: options.passphrase,
          keypair: keypair
        }
      })
    })
  }

  self.listenForTorrents = function (mtID) {
    mtos.swarm.subscribe('/' + mtID)
    .on('data', function (message) {
      var parsed = JSON.parse(message)
      if (parsed && parsed.magnetUri) {
        mtos.torrentClient.add(parsed.magnetUri, function (torrent) {
          self.read(torrent)
          .then(function (message) {
            console.log('received', message)
            self.messages.push(message)
          })
        })
      }
    })
  }

  self.unlockUser = function (mtID) {
    var options = {
      mtID: mtID,
      passphrase: self.passphrases[mtID]
    }
    mtosKeyService.unlockUserKey(options)
    .then(function (usableKeys) {
      if (usableKeys.privateKey !== null) {
        self.users[mtID].keypair.privateKey = usableKeys.privateKey
        self.users[mtID].keypair.publicKey = usableKeys.publicKey
        if (!self.activeUser) {
          self.activeUser = mtID
        }
        self.authenticatedUsers.push(self.users[mtID])
        delete self.passphrases[mtID]
      } else {
        window.alert('incorrect passphrase')
      }
    })
  }

  mtosBroadcastService.listen('server key loaded', function () {
    self.keypair = mtos.serverKey
  })
  if (mtos.serverKey) {
    self.keypair = mtos.serverKey
  }

  self.sendMessage = function () {
    var publicKeyString
    if (self.subscribers[self.messageTarget]) {
      publicKeyString = self.subscribers[self.messageTarget].publicKeyString
    } else {
      publicKeyString = self.users[self.messageTarget].keypair.publicKeyString
    }
    mtos.publicKeyFromString(publicKeyString)
    .then(function (publicKey) {
      var options = {
        encrypt: true,
        privateKey: self.users[self.activeUser].keypair.privateKey,
        publicKey: publicKey
      }
      if (configuration.trackers) {
        options.torrentOptions = {
          announceList: configuration.trackers
        }
      }
      var content = JSON.stringify({
        content: self.data,
        metadata: {
          foo: 'bar'
        }
      })
      console.log('calling create', content, options)
      return self.mtos.createContent(content, options)
      .then(function (torrent) {
        $scope.$apply(function () {
          self.infoHash = torrent.magnetURI
          self.receiveInfoHash = self.infoHash
        })
      })
    })
  }

  self.getTorrent = function () {
    console.log('configuration', configuration)
    var options = {}
    if (configuration.trackers) {
      options.torrentOptions = {
        announceList: configuration.trackers
      }
    }
    console.log('get torrent clicked')
    return mtos.downloadTorrent(self.receiveInfoHash)
    .then(function (torrent) {
      console.log('downloading', torrent)
      return self.read(torrent)
    })
  }

  self.read = function (torrent) {
    console.log('sending torrent to mtos for reading')
    var user = self.users[Object.keys(self.users)[0]]
    var options = {
      privateKey: user.keypair.privateKey,
      publicKey: user.keypair.publicKey
    }
    return mtos.readContent(torrent, options)
    .then(function (content) {
      $scope.$apply(function () {
        self.parsedData = JSON.parse(content)
        console.log('received content', self.parsedData)
      })
    })
  }

  self.createArchive = function (object) {
    return $localStorageArchive.exportZip(object)
  }

  $scope.$watch('db.backupFile', function (file) {
    if (file !== undefined) {
      $localStorageArchive.loadLocalStorageData(file)
    }
  })

  self.addSubscriber = function (newUser) {
    var user = JSON.parse(newUser).user
    console.log('adding subscriber', user)
    return $localStorage.getObject('subscribers')
    .then(function (subscribers) {
      subscribers[user.mtID] = user
      return $localStorage.setObject('subscribers', subscribers)
      .then(function (subscribers) {
        self.subscribers = subscribers
      })
    })
  }

  $scope.$watch('db.addThisSubscriber', function (file) {
    console.log('adding subscriber', file)
    if (file !== undefined) {
      $localStorageArchive.unzipData(file)
      .then(self.addSubscriber)
    }
  })
}

module.exports = debug
