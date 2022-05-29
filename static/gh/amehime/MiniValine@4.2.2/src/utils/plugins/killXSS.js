import getScriptfun from './getScriptfun'

const killXSS = (o, render) => {    
    o.TEXT = filterXSS(o.TEXT, {
        onIgnoreTagAttr(tag, name, value, isWhiteAttr) {
            if (name === 'class' || name === 'style' || name === 'data-src') {
                return `${name}="${filterXSS.escapeAttrValue(value)}"`
            }
        },
        onTag(tag, html, options) {
            if (tag === 'input' && (html.match(/<input disabled="" type="checkbox">/) || html.match(/<input checked="" disabled="" type="checkbox">/))) {
                return html
            }
        }
    })
    render(o)
}
module.exports = killXSS