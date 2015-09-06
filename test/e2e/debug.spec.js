/* global describe, it browser, expect */
'use strict'

describe('Debug View', function () {
  it('should have a title', function () {
    browser.get('/#/debug')

    expect(browser.getTitle()).toEqual('mtos')
  })
})
