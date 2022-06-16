<img src='https://cdn.jsdelivr.net/gh/MiniValine/MiniValine@master/.github/img/minivaline.png' width='120' align="right" />

# MiniValine

本项目魔改自 [MiniValine](https://github.com/MiniValine/MiniValine)
去掉一些花里胡哨的功能，又加了另外一些花里胡哨的功能。

> MiniValine is a simple and minimalist comment system based on Leancloud

本项目主要用在 `Hexo Theme Shoka >= 0.2` 中，是该主题暂时、唯一支持的评论功能。
如果想用在其他地方，需要自行修改，比如加上css等。
本文档仅提供基本的配置参数说明。

## 隐私保护
`0.1.*`升级到此版本，需要手动进行一些迁移，以防止泄露用户邮箱、IP等隐私信息。
[具体步骤戳此](https://github.com/imaegoo/Valine)

全新安装无视此步。

## Get `App ID`/`App Key`
**Get `App ID`/`App Key` from LeanCloud**  
[Click here](https://console.leancloud.app/login.html#/signup) to register or login in `LeanCloud`.  
[Click here](https://console.leancloud.app/applist.html#/newapp) Create new application in `LeanCloud`, and you will get `appId`/`appKey`.

[教程戳此](https://valine.js.org/quickstart.html)

## Usage

```yml
valine:
  appId: #Your_appId
  appKey: #Your_appkey
  placeholder: ヽ(○´∀`)ﾉ♪ # Comment box placeholder
  avatar: mp # Gravatar style : mp, identicon, monsterid, wavatar, robohash, retro
  pageSize: 10 # Pagination size
  lang: zh-CN
  visitor: true # Article reading statistic
  NoRecordIP: false # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled, fill it in here (it will be detected automatically by default, no need to fill in)
  tagMeta:
    - 主人
    - 小伙伴
    - 新朋友
  master:
    # - hash of master@email.com
    # - hash of master2@email.com
  friends:
    # - hash of friend@email.com
    # - hash of friend2@email.com
  powerMode: true
```

## Options

### Base Options

- **el** `String`

  **Required**. [object HTMLDivElement]
  
- **appId** `String`

  **Required**. Your App ID

- **appKey** `String`

  **Required**. Your App Key

- **placeholder** `String`

  Input Placeholder

- **pathname** `String`

  Default: `location.pathname`
  
  The pathname of the page.

- **math** `Boolean`

  Default: `true`
  
  Options: 

  * `false` Close MathJax.
  * `true`  Support MathJax@3 initialization.

  The above is the initialization operation of integrating MathJax in MiniValine.
  If MathJax is loaded on the page, MiniValine will use the MathJax version on the page.

- **md** `Boolean`

  Default: `true`
  
  Support Markdown.

- **lang** `String`

  Default: `navigator.language || navigator.userLanguage`.

  Localization language key, en and zh-CN are currently available.
  
  More i18n info: [minivaline-i18n](https://github.com/MiniValine/minivaline-i18n)
  
  [How to Add or Improve translation?](https://github.com/MiniValine/MiniValine/blob/master/.github/FAQ.md#how-to-add-or-improve-translation)

- **emoticonUrl** `String Array`

  Default: `['https://cdn.jsdelivr.net/npm/alus@latest','https://cdn.jsdelivr.net/gh/MiniValine/qq@latest','https://cdn.jsdelivr.net/gh/MiniValine/Bilibilis@latest','https://cdn.jsdelivr.net/gh/MiniValine/tieba@latest','https://cdn.jsdelivr.net/gh/MiniValine/twemoji@latest','https://cdn.jsdelivr.net/gh/MiniValine/weibo@latest']`
  
  Expression Url.
  
  [How to customize emoticons?](https://github.com/MiniValine/MiniValine/blob/master/.github/FAQ.md#how-to-customize-emoticons)

- **NoRecordIP** `Boolean`

  Default: `false`
  
  Do not record commenter IP.

- **pageSize** `Number`

  Default: `6`
  
  Pagination size.

- **visitor** `Boolean`

  Default: `true`
  
  Only `article reading access statistics`and `whole site access statistics` are provided.

- **serverURLs** `String`

  Default: `http[s]://[tab/us].avoscloud.com`
  
  This configuration is suitable for domestic custom domain name users, the overseas version will be automatically detected (no need to fill in manually).

  [Try to use cloudflare workers edge computing to improve the security](https://github.com/MiniValine/MiniValine/blob/master/.github/FAQ.md#how-to-improve-the-security-of-minivaline)

- **role** `String`

  Default: `admin`
  
  Write permissions for the administrator role. 
  
  [Valine-Android](https://github.com/yinhanlei/Valine-Android)  [Valine-iOS](https://github.com/xaoxuu/Valine-iOS) 

- **powerMode** `Boolean`

  Default: `true`
  
  Turn on [activate-power-mode](https://github.com/disjukr/activate-power-mode)

- **closeFlag** `Boolean` 

  Default: `false`
  
  Turn off visitor flag.

  If `cloudflag` is turned on, the setting of `Visitor Flag Local Options` is invalid.

  [How to Set Visitor Flag Cloud Option For xCss Style mode?](https://github.com/MiniValine/MiniValine/blob/master/.github/FAQ.md#how-to-set-visitor-flag-cloud-option-for-xcss-style-mode)

- **master** `String Array`

   Default: `[]`
  
  The MD5 String Array of master Email to show master Flag.

- **friends** `String Array`

   Default: `[]`
  
  The MD5 String Array of friends Email to show friends Flag.

- **tagMeta** `String Array`

   Default: `[]`
  
  The String Array of Words to show Flag (only three).
  
  For Example:
  `tagMeta: ["Master", "Friend", "Visitor"]`

- **closeUA** `Boolean`

  Default: `false`
  
  Turn off UA detection.


