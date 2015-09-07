/* global describe, it browser, expect */
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

})
