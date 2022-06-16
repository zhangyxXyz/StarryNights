import { MaxNL, PS, EUrl, C } from '../Default'
const Config = function (root) {
  root.emoticonUrl = root.config.emoticonUrl || EUrl
  root.lang = root.config.lang || navigator.language || navigator.userLanguage
  //root.maxNestLevel = root.config.maxNest || MaxNL
  root.pageSize = root.config.pageSize || PS
  root.adminEmailMd5 = root.config.adminEmailMd5 || ''
  root.math = root.config.math || true
  root.md = root.config.md || true
  root.powerMode = root.config.powerMode || true
  root.avatar = root.config.avatar || 'mp'
  root.visitor = root.config.visitor
  root.tagMeta = root.config.tagMeta || []
  root.tagMember = root.config.tagMember || []
  root.tagColor = root.config.tagColor || []
  // root.mode = root.config.mode || 'xCss'
  root.placeholder = root.config.placeholder || ''
  root.C = C
  root.C.url = root.config.pathname || location.pathname || '/'
  root.role = root.config.role ? root.config.role : 'admin'
}
module.exports = Config
