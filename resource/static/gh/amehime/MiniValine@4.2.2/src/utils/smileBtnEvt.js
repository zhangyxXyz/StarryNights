import dom from './plugins/dom'
const smileBtnEvt = (root) => {
  const smileBtn = root.el.querySelector('.emojis')
  const previewBtn = root.el.querySelector('.preview')
  const previewText = root.el.querySelector('.preview-box')
  const smileicons = root.el.querySelector('.smile-body')
  dom.on('click', smileBtn, (e) => {
    if (previewText.getAttribute('triggered')) {
      previewText.setAttribute('style', 'display:none;')
      previewText.removeAttribute('triggered')
      previewBtn.classList.remove('actived')
    }
    if (smileicons.getAttribute('triggered')) {
      smileicons.setAttribute('style', 'display:none;')
      smileicons.removeAttribute('triggered')
      smileBtn.classList.remove('actived')
    } else {
      smileicons.removeAttribute('style')
      smileicons.setAttribute('triggered', 1)
      smileBtn.classList.add('actived')
    }
  })
}
module.exports = smileBtnEvt
