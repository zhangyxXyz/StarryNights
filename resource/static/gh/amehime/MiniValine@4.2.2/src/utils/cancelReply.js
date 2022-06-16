import dom from './plugins/dom'
const cancelReply = (root) => {
  dom.on('click', root.el.querySelector('.cancel-reply'), (e) => {
    root.reset()
  })
}
module.exports = cancelReply
