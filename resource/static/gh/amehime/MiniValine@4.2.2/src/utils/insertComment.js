import dom from './plugins/dom'
const insertComment = (root, body) => {
  root.insertComment = (m, list = null, top = true) => {
    const _item = document.createElement('li')
    _item.setAttribute('class', 'item')
    _item.setAttribute('id', m.id)
    _item.innerHTML = body.item(root, m)
    root.ActivateCode(root)
    const _list = list || root.el.querySelector('.list')
    const _lis = _list.querySelectorAll('li')
    const _as = _item.querySelectorAll('a')
    for (let i = 0, len = _as.length; i < len; i++) {
      const item = _as[i]
      if (item && item.getAttribute('class') !== 'at') {
        item.setAttribute('target', '_blank')
        item.setAttribute('rel', 'nofollow')
      }
    }
    if (!top) { try { _list.appendChild(_item) } catch (e) {} } else _list.insertBefore(_item, _lis[0])
    const _vcontent = _item.querySelector('.content > .inner')
    expandEvt(_vcontent)
    root.AtEvt(_item)
    root.config.lazyload && root.config.lazyload.observe()
    return _item
  }
  const expandEvt = (el) => {
    if (el.offsetHeight > 180) {
      el.classList.add('expand')
      el.setAttribute('data-expand', root.i18n.more)
      dom.on('click', el, (e) => {
        el.setAttribute('class', 'inner md')
      })
    }
  }
}
module.exports = insertComment
