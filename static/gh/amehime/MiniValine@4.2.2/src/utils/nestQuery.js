import dom from './plugins/dom'
import killXSS from './plugins/killXSS'

const nestQuery = (root) => {
  root.nestQuery = (ids) => {
    
    root.v.Query
      .doCloudQuery(`select nick, comment, link, rid, isSpam, mailMd5, ua from Comment where rid in (${JSON.stringify(ids).replace(/(\[|\])/g, "")}) order by -createdAt`)
      .then((rets) => {
        rets = (rets && rets.results) || []
        const len = rets.length
        if (len) {
          for (let i = 0; i < len; i++) {
            if (!rets[i].get('isSpam')) {
              const render = (o) => {
                rets[i].set('comment', o.TEXT)
                const vl = root.insertComment(rets[i], root.el.querySelector('#children-' + rets[i].get('rid')), true)
              }
              rets[i].TEXT = rets[i].get('comment')
              killXSS(rets[i], render)
            }
          }
        }
      })
      .catch((ex) => {
        root.loading.hide(root.parentCount)
      })    
  }
}
module.exports = nestQuery
