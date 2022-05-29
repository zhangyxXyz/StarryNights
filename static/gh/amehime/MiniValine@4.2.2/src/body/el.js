import POWERMODE from './power'
const el = function (root) {
  const el = Object.prototype.toString.call(root.config.el) === '[object HTMLDivElement]'
    ? root.config.el
    : document.querySelectorAll(root.config.el)[0]
  if (Object.prototype.toString.call(el) !== '[object HTMLDivElement]') {
    return
  }
  root.el = el
  root.el.classList.add('v')
  root.el.innerHTML = root.ele
  if(root.powerMode)
    root.el.addEventListener('input', POWERMODE);
}
module.exports = el
