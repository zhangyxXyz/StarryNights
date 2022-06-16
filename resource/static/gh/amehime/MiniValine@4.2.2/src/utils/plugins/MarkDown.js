import killXSS from './killXSS'
import {markdown} from './md'
const MarkDown = (root, o, render) => {
  if (root.md || typeof root.config.md == 'undefined') {
    o.TEXT = markdown(o.TEXT)
  }
  killXSS(o, render)
}
module.exports = MarkDown
