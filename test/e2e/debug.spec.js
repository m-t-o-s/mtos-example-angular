/* global describe, it, browser, expect, element, by */
'use strict'

var path = require('path')

describe('Debug View', function () {
  it('should have a title', function () {
    browser.get('/#/debug')
    expect(browser.getTitle()).toEqual('mtos')
  })

  it('should load alice\'s credentials from a zip file', function (done) {
    var fileToUpload = '../test-credentials/alice.zip'
    var absolutePath = path.resolve(__dirname, fileToUpload)

    var fileInput = element(by.css('.db-backups > input[type="file"]'))

    fileInput.sendKeys(absolutePath)

    element.all(by.repeater('user in db.users'))
    .first().element(by.binding('user.username'))
    .getText().then(function (text) {
      expect(text).toBe('alice')
    })
    .then(function () {
      done()
    })
  })

  var browserBob
  var elementBob
  it('should load bob\'s credentials from a zip file', function (done) {
    var fileToUpload = '../test-credentials/bob.zip'
    var absolutePath = path.resolve(__dirname, fileToUpload)

    browserBob = browser.forkNewDriverInstance(true)
    elementBob = browserBob.element

    var fileInput = elementBob(by.css('.db-backups > input[type="file"]'))

    fileInput.sendKeys(absolutePath)
    elementBob.all(by.repeater('user in db.users'))
    .first().element(by.binding('user.username'))
    .getText().then(function (text) {
      expect(text).toBe('bob')
    })
    .then(function () {
      done()
    })
  })

  var browserEve
  var elementEve
  it('should load eve\'s credentials from a zip file', function (done) {
    var fileToUpload = '../test-credentials/eve.zip'
    var absolutePath = path.resolve(__dirname, fileToUpload)

    browserEve = browser.forkNewDriverInstance(true)
    elementEve = browserEve.element

    var fileInput = elementEve(by.css('.db-backups > input[type="file"]'))

    fileInput.sendKeys(absolutePath)
    elementEve.all(by.repeater('user in db.users'))
    .first().element(by.binding('user.username'))
    .getText().then(function (text) {
      expect(text).toBe('eve')
    })
    .then(function () {
      done()
    })
  })

  it('should unlock alice\'s privateKey', function (done) {
    var aliceUnlock = element.all(by.repeater('user in db.users')).first()
    aliceUnlock.element(by.model('db.passphrases[user.mtID]'))
    .sendKeys('alice')
    .then(function (text) {
      return aliceUnlock.element(by.css('[ng-click="db.unlockUser(user.mtID)"]')).click()
    })
    .then(function () {
      var exportButton = aliceUnlock.element(by.css('[ng-click="db.createArchive({user: {mtID: user.mtID, username: user.username, publicKeyString: user.keypair.publicKeyString, publicKeyFingerprint: user.keypair.publicKeyFingerprint}})"]'))
      expect(exportButton.isPresent()).toBe(true)
      done()
    })
  })

  var aliceInfoHash
  it('should allow alice to encrypt a message for bob', function (done) {
    var messageInput = element(by.model('db.data'))
    var messageSend = element(by.css('[ng-click="db.sendMessage()"]'))

    messageInput.clear()
    messageInput.sendKeys('this is a secret message from alice to bob')
    messageSend.click()
    .then(function () {
      element(by.binding('db.infoHash')).getText()
      .then(function (hash) {
        aliceInfoHash = hash
        expect(aliceInfoHash.length).toBe(105)
        done()
      })
    })
  })

  it('should unlock bob\'s privateKey', function (done) {
    var bobUnlock = elementBob.all(by.repeater('user in db.users')).first()
    bobUnlock.element(by.model('db.passphrases[user.mtID]'))
    .sendKeys('bob')
    .then(function (text) {
      return bobUnlock.element(by.css('[ng-click="db.unlockUser(user.mtID)"]')).click()
    })
    .then(function () {
      var exportButton = bobUnlock.element(by.css('[ng-click="db.createArchive({user: {mtID: user.mtID, username: user.username, publicKeyString: user.keypair.publicKeyString, publicKeyFingerprint: user.keypair.publicKeyFingerprint}})"]'))
      expect(exportButton.isPresent()).toBe(true)
      done()
    })
  })

  it('should let bob load and decrypt a message from alice', function (done) {
    elementBob(by.model('db.receiveInfoHash')).sendKeys(aliceInfoHash)
    elementBob(by.css('[ng-click="db.getTorrent()"]')).click()
    /*
    browserBob.manage().logs().get('browser').then(function (browserLog) {
      console.log('log: ' + require('util').inspect(browserLog))
    })
    browserBob.pause()
    */
    done()
  })
})
