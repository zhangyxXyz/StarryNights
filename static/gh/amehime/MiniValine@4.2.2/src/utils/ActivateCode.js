import {MathJaxSupport} from './plugins/MathJax'
const ActivateCode = (root) => {
  root.ActivateCode = (root) => {
    if (root.math == false) return
    MathJaxSupport(root)
  }
}
module.exports = ActivateCode
