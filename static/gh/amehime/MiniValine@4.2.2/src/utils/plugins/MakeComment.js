import MarkDown from './MarkDown'
const MakeComment = (root, o, render) => {
  const ls = root.C.comment.match(/!\(:(.*?\.\w+):\)/g)
  if (ls) {
    for (var i = 0; i < ls.length; i++) {
      var m = ls[i].match(/!\(:(.*?\.\w+):\)/)[1]
      const em = root.emoticon[m]
      var R = new RegExp('!\\(:' + m.replace(/\./, '\\.') + ':\\)', 'g')
      root.C.comment = root.C.comment.replace(R, `<img src="${em}" alt="${m}" class="emoji">`)
    }
  }
  o.TEXT = root.C.comment
  MarkDown(root, o, render)
}
module.exports = MakeComment
