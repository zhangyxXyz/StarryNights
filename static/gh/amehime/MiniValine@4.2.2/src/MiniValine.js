import body from './body'
import util from './utils'
const MiniValineFactory = function (option) {
  const root = this
  try {
    root.config = option

    util.Config(root)
    util.ActivateCode(root)
    util.i18n(root)
    util.script(root)
    
  } catch (e) {}
}
MiniValineFactory.prototype.initCheck = function () {
  const root = this
  try {
    var check = setInterval(function () {
      if (typeof root.i18n == 'undefined') return
      clearInterval(check)
      
      util.setAV(root)
      util.widgets(root)
      util.visitor(root)

      if (!document.querySelectorAll(root.config.el)[0]) return
      
      root.ele = body.ele(root)
      util.script(root, 1)
    }, 5)
  } catch (e) {}
}

MiniValineFactory.prototype.initBody = function () {
  const root = this
  try {
    body.el(root)
    body.loading(root)
    root.nodata.show()
    body.smiles(root)
  } catch (e) {
    return
  }
  try {
    util.cloudFlag(root)
    root.loading.hide(root.parentCount)
    root.loading.show()
    util.initCount(root)
    util.insertComment(root, body)
    util.parentQuery(root)
    util.nestQuery(root)
    util.alert(root)
    util.inputs(root)
    util.previewEvt(root)
    util.smileEvt(root)
    util.getCache(root)
    util.resetForm(root)
    util.uploadImage(root)
    util.cancelReply(root)
    util.smileBtnEvt(root)
    util.previewBtnEvt(root)
    util.atEvt(root)
    util.submitBtnEvt(root)
    util.smile(root)
  } catch (e) {}
}

module.exports = MiniValineFactory
