import dom from './plugins/dom'
const previewBtnEvt = (root) => {
  const previewBtn = root.el.querySelector('.preview')
  const smileBtn = root.el.querySelector('.emoji')
  const previewText = root.el.querySelector('.preview-box')
  const smileicons = root.el.querySelector('.smile-icons')
  dom.on('click', previewBtn, (e) => {
    if (smileicons.getAttribute('triggered')) {
      smileicons.setAttribute('style', 'display:none;')
      smileicons.removeAttribute('triggered')
      smileBtn.classList.remove('actived')
    }
    if (previewText.getAttribute('triggered')) {
      previewText.setAttribute('style', 'display:none;')
      previewText.removeAttribute('triggered')
      previewBtn.classList.remove('actived')
    } else {
      previewBtn.classList.add('actived')
      if (root.C.comment === '') {
        root.inputs.comment.focus()
        return
      }
      root.previewEvt(root)
    }
  })
}
module.exports = previewBtnEvt
