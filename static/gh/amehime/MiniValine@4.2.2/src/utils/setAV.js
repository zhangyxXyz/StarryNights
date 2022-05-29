const setAV = function (root) {
  // set serverURLs
  let prefix = 'https://'
  let serverURLs = ''
  if (!root.config.serverURLs) {
    switch (root.config.appId.slice(-9)) {
      // TAB
      case '-9Nh9j0Va':
        prefix += 'tab.leancloud.cn'
        break
        // US
      case '-MdYXbMMI':
        prefix += 'console.leancloud.app'
        break
      default:
        prefix += 'avoscloud.com'
        break
    }
  }
  serverURLs = root.config.serverURLs || prefix
  try {
    if(!window.MV.AVInit)
      AV.init({
        appId: root.config.appId,
        appKey: root.config.appKey,
        serverURLs
      })
    window.MV.AVInit = true
  } catch (e) {}
  root.v = AV
}
module.exports = setAV
