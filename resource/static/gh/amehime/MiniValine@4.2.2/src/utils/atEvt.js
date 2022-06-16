import dom from './plugins/dom'
const atEvt = (root) => {
  root.AtEvt = (item) => {
    const _id = item.getAttribute('id')
    const _at = item.querySelector(`#at-${_id}`)
    dom.on('click', _at, (e) => {
      const at = _at.getAttribute('at')
      const rid = _at.getAttribute('rid')
      root.C.rid = rid
      root.C.at = at
      root.C.pid = _at.getAttribute('id').replace('at-', '')
      root.el.querySelector('.form textarea').placeholder = at
      root.inputs.comment.value = `${root.inputs.comment.value}`
      // move inputs
      const commentEl = item.querySelector(`#comment-${_id}`)
      try { commentEl.appendChild(root.el.querySelector('.form')) } catch (e) {}
      root.el.querySelector('.cancel-reply').removeAttribute('style')
      // focus
      root.inputs.comment.focus()
    })
  }
}
module.exports = atEvt
