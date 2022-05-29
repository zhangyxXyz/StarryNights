import { GBUrl } from '../Default'
import timeAgo from './timeago'

const item = function (root, m) {
  m.set('nick', m.get('nick').slice(0, 20).trim().replace(/&/g, '&amp;').replace(/\//g, '&#x2F').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;'))
  const Hash = m.get('mailMd5')
  var gravatarUrl = `${GBUrl + Hash}?size=80&d=${["mp", "identicon", "monsterid", "wavatar", "robohash", "retro", ""].indexOf(root.avatar) > -1 ? root.avatar : "mp"}`
    let ua = m.get('ua') || ''
    let uaMeta = ''
    if (ua && !root.config.closeUA) {
      ua = UAParser(ua)
      try {
        if (ua.browser && ua.browser.name) {
          uaMeta += '<span class="system"><i class="ic i-'
          const bn = ua.browser.name.toLowerCase()
          if (['samsung browser'].includes(bn)) {
            uaMeta += 'mobile-alt'
          } else if (['android browser'].includes(bn)) {
            uaMeta += 'android'
          } else if (['mobile safari', 'safari'].includes(bn)) {
            uaMeta += 'safari'
          } else if (['ie', 'iemobile'].includes(bn)) {
            uaMeta += 'internet-explorer'
          } else if (['wechat'].includes(bn)) {
            uaMeta += 'weixin'
          } else if (['qqbrowser', 'qqbrowserlite', 'qq'].includes(bn)) {
            uaMeta += 'qq'
          } else if (['baiduboxapp', 'baidu'].includes(bn)) {
            uaMeta += 'paw'
          } else if (['chrome', 'chromium', 'chrome headless', 'chrome webview'].includes(bn)) {
            uaMeta += 'chrome'
          } else if (['opera mobi', 'opera', 'opera coast', 'opera mini', 'opera tablet'].includes(bn)) {
            uaMeta += 'opera'
          } else if (['firefox', 'edge'].includes(bn)) {
            uaMeta += bn
          } else {
            uaMeta += 'snapchat-ghost'
          }
          uaMeta += '"></i><span>' +
			ua.browser.name +
			' ' +
			(ua.browser.version ? ua.browser.version : '') +
			'</span></span>' +
			' '
        } else {
          uaMeta += '<span class="system"><i class="ic i-stars"></i><span>Magical APP</span></span>'
        }
        if (ua.os && ua.os.name) {
          uaMeta += '<span class="system"><i class="ic i-'
          const on = ua.os.name.toLowerCase()
          if (['mac os', 'ios'].includes(on)) {
            uaMeta += 'apple'
          } else if (['chromium os'].includes(on)) {
            uaMeta += 'chrome'
          } else if (['firefox os'].includes(on)) {
            uaMeta += 'firefox'
          } else if (['windows phone', 'windows'].includes(on)) {
            uaMeta += 'windows'
          } else if (['android', 'linux', 'ubuntu', 'suse', 'redhat', 'fedora', 'centos', 'blackberry'].includes(on)) {
            uaMeta += on
          } else {
            uaMeta += 'snapchat-ghost'
          }
          uaMeta += '"></i><span>' +
			ua.os.name +
			' ' +
			(ua.os.version ? ua.os.version : '') +
			'</span></span>'
        } else {
          uaMeta += '<span class="system"><i class="ic i-magic"></i><span>Magical OS</span></span>'
        }
      } catch (e) {}
    }
    var gat = ''
    if ((!root.config.closeFlag) && (!root.config.cloudflag)) {
      try {
        if(root.tagMeta['visitor'])
          gat = '<span class="tag visitor">' +
              root.tagMeta['visitor'] +
              '</span>'
        for (var index in root.tagMember) {
          var item = root.tagMember[index].map(i => i.toLowerCase())
          
          if(item.includes(m.get('mailMd5').toLowerCase()) && root.tagMeta[index])
            gat = '<span class="tag '+index+'">' +
                    root.tagMeta[index] +
                    '</span>'
        }
      } catch (e) {}
    }
    if ((!root.config.closeFlag) && root.config.cloudflag) {
      try {
        var vRoles = root.cloudFlag.Roles
        var ehash = m.get('mailMd5').toLowerCase()
        var vflag = root.cloudFlag.Users[ehash]
        if (!vflag) {
          gat = '<span class="tag" style="background:' + `${vRoles.visitor && vRoles.visitor.color ? vRoles.visitor.color : '#828282'}` + ';">' + `${vRoles.visitor && vRoles.visitor.nick ? vRoles.visitor.nick : 'visitor'}` + '</span>'
        } else {
          gat = '<span class="tag" style="background:' + `${root.cloudFlag.Roles[vflag] && root.cloudFlag.Roles[vflag].color ? root.cloudFlag.Roles[vflag].color : '#6cf'}` + ';">' + `${root.cloudFlag.Roles[vflag] && root.cloudFlag.Roles[vflag].nick ? root.cloudFlag.Roles[vflag].nick : 'visitor'}` + '</span>'
        }
      } catch (e) {}
    }
    const HTML = 
        `<img class="avatar" data-src="${gravatarUrl}"/>` +
    '<div class="main">' +
			'<div class="head" >' +
        `${m.get('link') ? `<a class="name" href="${m.get('link')}" target="_blank" rel="nofollow" >${m.get('nick')}</a>` : `<span class="name">${m.get('nick')}</span>`}` +
        `${gat}${uaMeta}</div>` +
			`<div class="meta">` + 
        `<a${m.get('rid')?` rid="${m.get('rid')}"`:` rid="${m.id}"`} at='@${m.get('nick')}' class="at" id="at-${m.id}">${root.i18n.reply}</a>` +
      	`<span class="time">${timeAgo(m.get('createdAt'), root.i18n)}</span>` +
			'</div>' +
			`<section class="content" id="comment-${m.id}">` +
				`<div class="inner md">${m.get('comment')}</div>` +
			'</section>' +
  		'<div class="children">' +
  			`<ul class="list" id="children-${m.id}"></ul>` +
  		'</div>' +
    '</div>'
    return HTML
}

module.exports = item
