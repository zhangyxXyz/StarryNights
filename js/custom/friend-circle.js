(function () {
  'use strict'

  var root = document.getElementById('friend-circle')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'

  var config = Object.assign({
    api: '',
    pageSize: 12,
    cacheMinutes: 10
  }, window.FriendCircleConfig || {})
  var api = config.api.replace(/\/?$/, '/')
  var cacheKey = 'friend-circle:' + api

  var state = { data: null, friends: [], rule: 'created', author: '', shown: config.pageSize }

  function h (tag, attrs, children) {
    var el = document.createElement(tag)
    for (var key in attrs || {}) {
      var value = attrs[key]
      if (value == null || value === false) continue
      if (key === 'class') el.className = value
      else if (key === 'text') el.textContent = value
      else if (key.indexOf('on') === 0) el.addEventListener(key.slice(2), value)
      else el.setAttribute(key, value === true ? '' : value)
    }
    ;[].concat(children || []).forEach(function (child) {
      if (child != null) el.append(child)
    })
    return el
  }

  function safeLink (link) {
    return /^https?:\/\//i.test(link || '') ? link : null
  }

  function letterAvatar (name) {
    var initial = Array.from((name || '?').trim())[0] || '?'
    var hue = 0
    for (var i = 0; i < name.length; i++) hue = (hue * 31 + name.charCodeAt(i)) % 360
    return h('span', {
      class: 'fc-avatar fc-avatar-letter',
      style: '--fc-avatar-hue:' + hue,
      'aria-hidden': 'true',
      text: initial.toUpperCase()
    })
  }

  function avatar (src, name) {
    var link = safeLink(src)
    if (!link) return letterAvatar(name)
    return h('img', {
      class: 'fc-avatar',
      referrerpolicy: 'no-referrer',
      src: link,
      alt: name,
      loading: 'lazy',
      onerror: function () {
        this.onerror = null
        this.replaceWith(letterAvatar(name))
      }
    })
  }

  var DAY = 864e5
  function relativeDate (dateText) {
    var date = new Date(dateText + 'T00:00:00+08:00')
    if (isNaN(date)) return dateText
    var days = Math.floor((Date.now() - date) / DAY)
    if (days <= 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 30) return days + ' 天前'
    return dateText
  }

  function sorted () {
    var key = state.rule
    return state.data.article_data
      .filter(function (post) { return !state.author || post.author === state.author })
      .slice()
      .sort(function (a, b) { return a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0 })
  }

  function card (post) {
    var date = post[state.rule]
    var fresh = Date.now() - new Date(post.created + 'T00:00:00+08:00') < 7 * DAY
    return h('a', {
      class: 'fc-card',
      href: safeLink(post.link),
      target: '_blank',
      rel: 'noopener external nofollow'
    }, [
      h('span', { class: 'fc-card-title', text: post.title }),
      h('span', { class: 'fc-card-meta' }, [
        avatar(post.avatar, post.author),
        h('span', { class: 'fc-card-author', text: post.author }),
        fresh ? h('span', { class: 'fc-card-new', text: 'NEW' }) : null,
        h('time', { datetime: date, title: (state.rule === 'created' ? '发布于 ' : '更新于 ') + date, text: relativeDate(date) })
      ])
    ])
  }

  function friendByName (name) {
    return state.friends.find(function (friend) { return friend.name === name })
  }

  function friendChips () {
    var counts = {}
    var avatars = {}
    var failed = {}
    state.friends.forEach(function (friend) {
      counts[friend.name] = 0
      avatars[friend.name] = friend.avatar
      failed[friend.name] = friend.error
    })
    state.data.article_data.forEach(function (post) {
      counts[post.author] = (counts[post.author] || 0) + 1
      avatars[post.author] = avatars[post.author] || post.avatar
    })
    var names = Object.keys(counts).sort(function (a, b) {
      return (failed[a] ? 1 : 0) - (failed[b] ? 1 : 0) || counts[b] - counts[a]
    })
    if (names.length < 2) return null
    var strip = h('div', { class: 'fc-friends', role: 'group', 'aria-label': '按友链筛选' }, names.map(function (name) {
      var active = state.author === name
      return h('button', {
        type: 'button',
        class: 'fc-chip' + (active ? ' active' : '') + (failed[name] ? ' is-error' : ''),
        title: failed[name] ? name + '：暂时无法抓取' : null,
        'aria-pressed': String(active),
        onclick: function () {
          state.author = active ? '' : name
          state.shown = config.pageSize
          render()
        }
      }, [avatar(avatars[name], name), h('span', { text: name }), h('small', { text: counts[name] })])
    }))
    var frame = h('div', { class: 'fc-friends-frame' }, strip)
    scrollStrip(frame, strip)
    return frame
  }

  var stripObserver = null

  // 用类名收起而不是 hidden，宽度才能过渡；收起时同时移出焦点顺序与读屏
  function toggleArrow (button, hide) {
    button.classList.toggle('is-hidden', hide)
    button.tabIndex = hide ? -1 : 0
    if (hide) button.setAttribute('aria-hidden', 'true')
    else button.removeAttribute('aria-hidden')
  }

  // 友链多到一行放不下时横向滚动：两侧按钮翻页，鼠标可拖拽，重绘后保留滚动位置
  function scrollStrip (frame, strip) {
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
    var SNAP = 64
    var pin = 0
    var settle = null
    function release () { pin = 0 }
    strip.addEventListener('wheel', release, { passive: true })
    strip.addEventListener('touchstart', release, { passive: true })
    var buttons = [-1, 1].map(function (dir) {
      var button = h('button', {
        type: 'button',
        class: 'fc-scroll-arrow is-hidden ' + (dir < 0 ? 'is-left' : 'is-right'),
        'aria-label': dir < 0 ? '向左滚动' : '向右滚动',
        'aria-hidden': 'true',
        tabindex: '-1',
        onclick: function () {
          var max = strip.scrollWidth - strip.clientWidth
          var target = strip.scrollLeft + dir * strip.clientWidth * 0.75
          // 剩下不足一屏的零头时直接到底；箭头收起会让可滚动距离变化，到位后再补一次
          if (dir > 0 && target >= max - SNAP) pin = 1
          else if (dir < 0 && target <= SNAP) pin = -1
          else pin = 0
          strip.scrollTo({ left: pin > 0 ? max : pin < 0 ? 0 : target, behavior: reduced ? 'auto' : 'smooth' })
        }
      }, h('i', { class: 'ic i-chevrons-' + (dir < 0 ? 'left' : 'right'), 'aria-hidden': 'true' }))
      frame.append(button)
      return button
    })

    function update () {
      var max = strip.scrollWidth - strip.clientWidth
      var atStart = max <= 1 || strip.scrollLeft <= 1
      var atEnd = max <= 1 || strip.scrollLeft >= max - 1
      if ((pin > 0 && atEnd) || (pin < 0 && atStart)) pin = 0
      clearTimeout(settle)
      if (pin) {
        settle = setTimeout(function () {
          if (pin) strip.scrollTo({ left: pin > 0 ? strip.scrollWidth : 0, behavior: reduced ? 'auto' : 'smooth' })
        }, 120)
      }
      toggleArrow(buttons[0], atStart)
      toggleArrow(buttons[1], atEnd)
      frame.classList.toggle('fade-left', !atStart)
      frame.classList.toggle('fade-right', !atEnd)
      if (strip.isConnected) state.stripLeft = strip.scrollLeft
    }

    var drag = null
    strip.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      pin = 0
      drag = { x: event.clientX, left: strip.scrollLeft, moved: false, id: event.pointerId }
    })
    strip.addEventListener('pointermove', function (event) {
      if (!drag) return
      var distance = event.clientX - drag.x
      if (!drag.moved && Math.abs(distance) < 5) return
      if (!drag.moved) {
        drag.moved = true
        strip.setPointerCapture(drag.id)
        frame.classList.add('dragging')
      }
      strip.scrollLeft = drag.left - distance
    })
    function endDrag () {
      if (!drag) return
      frame.classList.remove('dragging')
      setTimeout(function () { drag = null }, 0)
    }
    strip.addEventListener('pointerup', endDrag)
    strip.addEventListener('pointercancel', endDrag)
    strip.addEventListener('click', function (event) {
      if (drag && drag.moved) {
        event.preventDefault()
        event.stopPropagation()
      }
      drag = null
    }, true)
    strip.addEventListener('scroll', update, { passive: true })

    if (stripObserver) stripObserver.disconnect()
    if (window.ResizeObserver) {
      stripObserver = new ResizeObserver(update)
      stripObserver.observe(strip)
      ;[].forEach.call(strip.children, function (chip) { stripObserver.observe(chip) })
    }
    requestAnimationFrame(function () {
      strip.scrollLeft = state.stripLeft || 0
      update()
      requestAnimationFrame(function () { frame.classList.add('is-ready') })
    })
  }

  function ruleButton (rule, label, after) {
    var active = state.rule === rule
    return h('button', {
      type: 'button',
      class: active ? 'active' : null,
      'aria-pressed': String(active),
      text: label,
      onclick: function () {
        if (state.rule !== rule) {
          state.rule = rule
          render()
        }
        if (after) after()
      }
    })
  }

  var tokenKey = 'friend-circle-admin:' + api
  function adminToken () {
    try { return sessionStorage.getItem(tokenKey) || '' } catch (e) { return '' }
  }
  function setAdminToken (token) {
    try {
      if (token) sessionStorage.setItem(tokenKey, token)
      else sessionStorage.removeItem(tokenKey)
    } catch (e) {}
  }

  function request (path, options) {
    options = options || {}
    var headers = {}
    if (options.token) headers.Authorization = 'Bearer ' + options.token
    return fetch(api + path, { method: options.method || 'GET', headers: headers }).then(function (res) {
      return res.json().catch(function () { return {} }).then(function (body) {
        if (!res.ok) {
          var error = new Error(body.message || 'HTTP ' + res.status)
          error.status = res.status
          throw error
        }
        return body
      })
    })
  }

  function statusRow (friend) {
    return h('li', { class: friend.error ? 'error' : null }, [
      h('div', { class: 'fc-status-main' }, [
        avatar(friend.avatar, friend.name),
        h('a', { href: safeLink(friend.link), target: '_blank', rel: 'noopener external nofollow', text: friend.name }),
        friend.feed
          ? h('a', { class: 'fc-status-feed', href: safeLink(friend.feed), target: '_blank', rel: 'noopener external nofollow', text: 'Feed' })
          : null,
        h('span', { class: 'fc-status-tag', text: friend.error ? '抓取失败' : '正常' })
      ]),
      friend.reason
        ? h('p', { class: 'fc-status-reason', text: friend.reason + (friend.last_ok ? '（最后成功：' + friend.last_ok + '）' : '') })
        : null
    ])
  }

  function loadStatus (list) {
    var token = adminToken()
    list.replaceChildren(h('li', { class: 'fc-status-loading', text: '正在获取友链状态…' }))
    request(token ? 'status' : 'friend', { token: token })
      .then(function (friends) {
        friends.sort(function (a, b) { return a.error - b.error })
        list.replaceChildren.apply(list, friends.map(statusRow))
      })
      .catch(function (error) {
        if (error.status === 401) setAdminToken('')
        list.replaceChildren(h('li', { class: 'fc-status-loading', text: '友链状态获取失败' }))
      })
  }

  function adminSection (list) {
    var section = h('section', { class: 'fc-admin' })
    var message = h('p', { class: 'fc-dialog-note', role: 'status' })

    function show () {
      var token = adminToken()
      if (!token) {
        var input = h('input', { type: 'password', class: 'fc-input', placeholder: '管理密码', autocomplete: 'current-password', 'aria-label': '管理密码' })
        var reveal = h('button', {
          type: 'button',
          class: 'fc-reveal',
          title: '显示密码',
          'aria-label': '显示密码',
          'aria-pressed': 'false',
          onclick: function () {
            var visible = input.type === 'password'
            input.type = visible ? 'text' : 'password'
            reveal.title = visible ? '隐藏密码' : '显示密码'
            reveal.setAttribute('aria-label', reveal.title)
            reveal.setAttribute('aria-pressed', String(visible))
            input.focus()
          }
        }, [h('i', { class: 'ic i-eye', 'aria-hidden': 'true' })])
        var form = h('form', {
          class: 'fc-login',
          onsubmit: function (event) {
            event.preventDefault()
            if (!input.value) return
            message.textContent = '登录中…'
            request('status', { token: input.value })
              .then(function () {
                setAdminToken(input.value)
                message.textContent = ''
                show()
                loadStatus(list)
              })
              .catch(function (error) {
                message.textContent = error.message
              })
          }
        }, [
          h('span', { class: 'fc-password' }, [input, reveal]),
          h('button', { type: 'submit', class: 'fc-more', text: '登录' })
        ])
        section.replaceChildren(h('h3', { text: '管理' }), form, message)
        return
      }

      var refresh = h('button', {
        type: 'button',
        class: 'fc-more',
        text: '立即重新抓取',
        onclick: function () {
          refresh.disabled = true
          message.textContent = '正在触发抓取…'
          request('refresh', { method: 'POST', token: token })
            .then(function (body) {
              try { sessionStorage.removeItem(cacheKey) } catch (e) {}
              message.textContent = body.message || '已触发抓取，几分钟后刷新页面查看。'
            })
            .catch(function (error) {
              if (error.status === 401) {
                setAdminToken('')
                show()
              }
              message.textContent = '抓取失败：' + error.message
            })
            .finally(function () { refresh.disabled = false })
        }
      })
      var logout = h('button', {
        type: 'button',
        class: 'fc-link-btn',
        text: '退出登录',
        onclick: function () {
          setAdminToken('')
          message.textContent = ''
          show()
          loadStatus(list)
        }
      })
      section.replaceChildren(h('h3', { text: '管理' }), h('div', { class: 'fc-admin-actions' }, [refresh, logout]), message)
    }

    show()
    return section
  }

  function openSettings () {
    var list = h('ul', { class: 'fc-status' })
    var dialog = h('dialog', {
      class: 'fc-dialog',
      'aria-label': '朋友圈设置',
      onclose: function () { dialog.remove() },
      onclick: function (event) { if (event.target === dialog) dialog.close() }
    }, [
      h('div', { class: 'fc-dialog-head' }, [
        h('strong', { text: '朋友圈设置' }),
        h('button', { type: 'button', class: 'fc-dialog-close', 'aria-label': '关闭', text: '×', onclick: function () { dialog.close() } })
      ]),
      h('div', { class: 'fc-dialog-body' }, [
        h('section', null, [
          h('h3', { text: '文章排序' }),
          h('div', { class: 'fc-rule', role: 'group', 'aria-label': '排序' }, [
            ruleButton('created', '最新发布', function () { dialog.close() }),
            ruleButton('updated', '最近更新', function () { dialog.close() })
          ])
        ]),
        h('section', null, [h('h3', { text: '友链状态' }), list]),
        adminSection(list)
      ])
    ])
    document.body.append(dialog)
    dialog.showModal()
    loadStatus(list)
  }

  function footer (stat) {
    function credit (label, name, href) {
      var external = /^https?:\/\//.test(href)
      return h('p', null, [label + ' ', h('a', {
        href: href,
        target: external ? '_blank' : null,
        rel: external ? 'noopener external nofollow' : null,
        text: name
      })])
    }
    return h('div', { class: 'fc-credits' }, [
      credit('Powered by', 'FriendCircle', 'https://github.com/zhangyxXyz/hexo-circle-of-friends'),
      credit('Design by', 'Seiun', '/projects/'),
      h('p', { class: 'fc-stats' }, [
        ['订阅', stat.friends_num],
        ['活跃', stat.active_num],
        ['日志', stat.article_num]
      ].map(function (item) {
        return h('span', null, [item[0], h('b', { text: item[1] })])
      })),
      h('p', null, [
        '更新于：' + stat.last_updated_time,
        h('button', { type: 'button', class: 'fc-setting-btn', text: '设置', onclick: openSettings })
      ])
    ])
  }

  function emptyText () {
    if (!state.author) return '朋友们最近都很安静，还没有新文章~'
    var friend = friendByName(state.author)
    return friend && friend.error
      ? '暂时无法抓取 ' + state.author + ' 的订阅源，恢复后会重新显示。'
      : state.author + ' 还没有文章。'
  }

  function render () {
    var stat = state.data.statistical_data
    var posts = sorted()
    var visible = posts.slice(0, state.shown)

    var body = visible.length
      ? h('div', { class: 'fc-list' }, visible.map(card))
      : h('p', { class: 'fc-empty', text: emptyText() })

    var more = posts.length > state.shown
      ? h('button', {
        type: 'button',
        class: 'fc-more',
        text: '加载更多（' + (posts.length - state.shown) + '）',
        onclick: function () {
          state.shown += config.pageSize
          render()
        }
      })
      : null

    root.replaceChildren(
      h('div', { class: 'fc-head' }, [
        friendChips(),
        h('div', { class: 'fc-rule', role: 'group', 'aria-label': '排序' }, [
          ruleButton('created', '最新发布'),
          ruleButton('updated', '最近更新')
        ])
      ]),
      body,
      h('div', { class: 'fc-foot' }, [
        more,
        posts.length && !more ? h('span', { class: 'fc-end', text: '一切皆有尽头！' }) : null
      ]),
      footer(stat)
    )
    root.removeAttribute('aria-busy')
  }

  function renderError () {
    root.removeAttribute('aria-busy')
    root.replaceChildren(h('div', { class: 'fc-empty' }, [
      '朋友圈暂时加载失败，',
      h('button', { type: 'button', class: 'fc-retry', text: '重试', onclick: function () { load(true) } })
    ]))
  }

  function renderSkeleton () {
    root.setAttribute('aria-busy', 'true')
    var items = []
    for (var i = 0; i < 6; i++) items.push(h('div', { class: 'fc-card fc-skeleton' }, [h('span'), h('span')]))
    root.replaceChildren(h('div', { class: 'fc-list' }, items))
  }

  function readCache () {
    try {
      var cached = JSON.parse(sessionStorage.getItem(cacheKey))
      if (cached && Array.isArray(cached.friends) && Date.now() - cached.at < config.cacheMinutes * 6e4) return cached
    } catch (e) {}
    return null
  }

  function load (force) {
    var cached = !force && readCache()
    if (cached) {
      state.data = cached.data
      state.friends = cached.friends
      render()
      return
    }
    renderSkeleton()
    Promise.all([
      fetch(api + 'all').then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status)
        return res.json()
      }),
      // 友链列表只用于补全 0 篇和抓取失败的友链，失败时退回按文章统计
      fetch(api + 'friend')
        .then(function (res) { return res.ok ? res.json() : [] })
        .catch(function () { return [] })
    ])
      .then(function (result) {
        var data = result[0]
        var friends = Array.isArray(result[1]) ? result[1] : []
        if (!data || !Array.isArray(data.article_data)) throw new Error('Invalid data')
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: data, friends: friends })) } catch (e) {}
        if (!root.isConnected) return
        state.data = data
        state.friends = friends
        render()
      })
      .catch(function (error) {
        console.warn('[friend-circle]', error)
        if (root.isConnected) renderError()
      })
  }

  load(false)
})()
