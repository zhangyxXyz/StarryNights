import dom from './plugins/dom'
const alert = (root) => {
  const mark = root.el.querySelector('.msg')
  root.alert = {
    show (o) {
      mark.innerHTML = `<div class="alert text-center"><div class="text">${o.text}</div><div class="btns"></div></div>`
      const vbtns = mark.querySelector('.btns')
      const cBtn = `<button class="cancel button">${(o.ctxt) || root.i18n.cancel}</button>`
      const oBtn = o.type?`<button class="sure button">${(o.otxt) || root.i18n.continue}</button>`:''
      vbtns.innerHTML = `${cBtn}${oBtn}`
      mark.querySelector('.cancel').addEventListener('click', (e) => {
        root.alert.hide()
      })
      mark.setAttribute('style', 'display:block;')
      if (o.type) {
        const ok = mark.querySelector('.sure')
        dom.on('click', ok, (e) => {
          root.alert.hide()
          o.cb && o.cb()
        })
      }
    },
    hide () {
      mark.setAttribute('style', 'display:none;')
    }
  }
}
module.exports = alert
