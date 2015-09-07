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

  it('should load bob\'s credentials from a zip file', function (done) {
    var fileToUpload = '../test-credentials/bob.zip'
    var absolutePath = path.resolve(__dirname, fileToUpload)

    var browserBob = browser.forkNewDriverInstance(true)
    var elementBob = browserBob.element

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

  it('should load eve\'s credentials from a zip file', function (done) {
    var fileToUpload = '../test-credentials/eve.zip'
    var absolutePath = path.resolve(__dirname, fileToUpload)
    var browserEve = browser.forkNewDriverInstance(true)
    var elementEve = browserEve.element
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
      done()
    })
  })

  var aliceInfoHash
  it('should allow alice to encrypt a message for bob', function (done) {
    var messageInput = element(by.model('db.data'))
    var messageSend = element(by.css('[ng-click="db.sendMessage()"]'))

    // I don't know why standard complains about aliceInfoHash not being used below
    // but it does :(
    console.log(aliceInfoHash)

    messageInput.clear()
    messageInput.sendKeys('this is a secret message from alice to bob')
    messageSend.click()
    .then(function () {
      element(by.binding('db.infoHash')).getText()
      .then(function (hash) {
        console.info('hash', hash)
        aliceInfoHash = hash
        done()
      })
    })
  })
})
