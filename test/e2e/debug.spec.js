/* global describe, it browser, expect */
'use strict'

var path = require('path')

describe('Debug View', function () {

  it('should have a title', function () {
    browser.get('/#/debug')

    expect(browser.getTitle()).toEqual('mtos')
  })

  it('should load credentials from a zip file', function (done) {
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

})
