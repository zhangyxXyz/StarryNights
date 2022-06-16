import MakeComment from './plugins/MakeComment'
const previewEvt = (root) => {
  root.previewEvt = (root, t = 0) => {
    const previewBtn = root.el.querySelector('.preview')
    const previewText = root.el.querySelector('.preview-box')
    const veditor = root.el.querySelector('.veditor')
    const render = (previewText) => {
      previewText.innerHTML = previewText.TEXT
      previewText.removeAttribute('style')
      previewText.setAttribute('triggered', 1)
      previewBtn.classList.add('actived')
      if (veditor.value) autosize(veditor)
      else autosize.destroy(veditor)
      root.ActivateCode(root, t)
    }
    MakeComment(root, previewText, render)
  }
}
module.exports = previewEvt
