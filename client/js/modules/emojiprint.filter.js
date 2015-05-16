'use strict'

function emojiprint () {
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

module.exports = window.angular.module('emojiprint', [])
  .filter('emojiprint', emojiprint)
