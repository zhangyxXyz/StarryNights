import getCache from './getCache'
const resetForm = (root) => {
  const smileicons = root.el.querySelector('.smile-icons')
  const previewText = root.el.querySelector('.preview-box')
  root.reset = () => {
    for (const i in root.mapping) {
      if (root.mapping.hasOwnProperty(i)) {
        const _v = root.mapping[i]
        const _el = root.el.querySelector(`.${i}`)
        _el.value = ''
        root.C[_v] = ''
      }
    }
    root.C.rid = ''
    root.C.nick = ''
    root.C.at = ''
    root.el.querySelector('.form textarea').placeholder = ''
    getCache(root)
    root.previewEvt(root)
    if (smileicons.getAttribute('triggered')) {
      smileicons.setAttribute('style', 'display:none;')
      smileicons.removeAttribute('triggered')
    }
    if (previewText.getAttribute('triggered')) {
      previewText.setAttribute('style', 'display:none;')
      previewText.removeAttribute('triggered')
    }
    root.el
      .querySelector('.cancel-reply')
      .setAttribute('style', 'display:none')
    try {
      root.el
        .querySelector('#input')
        .appendChild(root.el.querySelector('.form'))
    } catch (e) {}
  }
}
module.exports = resetForm
