const getScriptfun = (url, callback, condition) => {
  if (condition) {
    callback()
  } else {
    let script = document.createElement('script')
    script.onload = script.onreadystatechange = (_, isAbort) => {
      if (
        isAbort ||
        !script.readyState ||
        /loaded|complete/.test(script.readyState)
      ) {
        script.onload = script.onreadystatechange = null
        script = undefined
        if (!isAbort && callback) setTimeout(callback, 0)
      }
    }
    script.src = url
    try { document.getElementsByTagName('head')[0].appendChild(script) } catch (e) {console.log(e)}
  }
}
module.exports = getScriptfun
