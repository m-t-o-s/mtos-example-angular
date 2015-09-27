'use strict'

import angular from 'angular'

function emojiprint () {
  'ngInject'
  return function (fingerprint) {
    // all hail http://www.windytan.com/2014/10/visualizing-hex-bytes-with-unicode-emoji.htmla
    //          https://gist.github.com/windytan/7910910

    var emojis = '🌀  🌂  🌅  🌈  🌙  🌞  🌟  🌠  🌰  🌱  🌲  🌳  🌴  🌵  🌷  🌸  🌹  🌺  🌻  🌼  🌽  🌾  🌿  🍀  🍁  🍂  🍃  🍄  🍅  🍆  🍇  🍈  🍉  🍊  🍋  🍌  🍍  🍎  🍏  🍐  🍑  🍒  🍓  🍔  🍕  🍖  🍗  🍘  🍜  🍝  🍞  🍟  🍠  🍡  🍢  🍣  🍤  🍥  🍦  🍧  🍨  🍩  🍪  🍫  🍬  🍭  🍮  🍯  🍰  🍱  🍲  🍳  🍴  🍵  🍶  🍷  🍸  🍹  🍺  🍻  🍼  🎀  🎁  🎂  🎃  🎄  🎅  🎈  🎉  🎊  🎋  🎌  🎍  🎎  🎏  🎒  🎓  🎠  🎡  🎢  🎣  🎤  🎥  🎦  🎧  🎨  🎩  🎪  🎫  🎬  🎭  🎮  🎯  🎰  🎱  🎲  🎳  🎴  🎵  🎷  🎸  🎹  🎺  🎻  🎽  🎾  🎿  🏀  🏁  🏂  🏃  🏄  🏆  🏇  🏈  🏉  🏊  🐀  🐁  🐂  🐃  🐄  🐅  🐆  🐇  🐈  🐉  🐊  🐋  🐌  🐍  🐎  🐏  🐐  🐑  🐒  🐓  🐔  🐕  🐖  🐗  🐘  🐙  🐚  🐛  🐜  🐝  🐞  🐟  🐠  🐡  🐢  🐣  🐤  🐥  🐦  🐧  🐨  🐩  🐪  🐫  🐬  🐭  🐮  🐯  🐰  🐱  🐲  🐳  🐴  🐵  🐶  🐷  🐸  🐹  🐺  🐻  🐼  🐽  🐾  👀  👂  👃  👄  👅  👆  👇  👈  👉  👊  👋  👌  👍  👎  👏  👐  👑  👒  👓  👔  👕  👖  👗  👘  👙  👚  👛  👜  👝  👞  👟  👠  👡  👢  👣  👤  👥  👦  👧  👨  👩  👪  👮  👯  👺  👻  👼  👽  👾  👿  💀  💁  💂  💃  💄  💅'.split('  ')

    function replaceWithEmoji (element) {
      return emojis[parseInt(element, 16)]
    }

    return fingerprint.split(':').map(replaceWithEmoji).join('')
  }
}

module.exports = angular.module('emojiprint.filter', [])
  .filter('emojiprint', emojiprint).name
