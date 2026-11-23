/* ============================================================
 * 牙翼 · 后端数据层（Supabase REST，不依赖任何 SDK）
 *   window.ZM_DB.ready === false 时，页面走本地演示数据
 * ============================================================ */
;(function () {
  var CFG = window.ZM_CONFIG || {}
  var URL = String(CFG.supabaseUrl || '').replace(/\/+$/, '')
  var KEY = CFG.supabaseKey || ''
  var BUCKET = CFG.bucket || 'device-images'
  var TOKEN_KEY = 'zm_owner_token'

  var token = ''
  try { token = localStorage.getItem(TOKEN_KEY) || '' } catch (e) {}

  function hdr (extra) {
    var h = { apikey: KEY, Authorization: 'Bearer ' + (token || KEY) }
    if (extra) for (var k in extra) h[k] = extra[k]
    return h
  }

  function req (path, opt) {
    opt = opt || {}
    return fetch(URL + path, {
      method: opt.method || 'GET',
      headers: hdr(opt.headers),
      body: opt.body === undefined ? undefined : JSON.stringify(opt.body)
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) { throw new Error('接口错误 ' + r.status + '：' + t.slice(0, 160)) })
      }
      return r.status === 204 ? null : r.json()
    })
  }

  var DB = {
    ready: !!(URL && KEY),
    get logged () { return !!token },

    /* ---------- 店主登录 ---------- */
    login: function (email, password) {
      return fetch(URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      }).then(function (r) {
        if (!r.ok) return r.text().then(function () { throw new Error('账号或密码不正确') })
        return r.json()
      }).then(function (j) {
        token = j.access_token
        try { localStorage.setItem(TOKEN_KEY, token) } catch (e) {}
        return j
      })
    },

    logout: function () {
      token = ''
      try { localStorage.removeItem(TOKEN_KEY) } catch (e) {}
    },

    /* ---------- 设备 ---------- */
    listDevices: function () {
      return req('/rest/v1/devices?select=*&order=sort_order.desc,created_at.desc')
    },

    createDevice: function (row) {
      return req('/rest/v1/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: row
      })
    },

    updateDevice: function (id, patch) {
      return req('/rest/v1/devices?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: patch
      })
    },

    deleteDevice: function (id) {
      return req('/rest/v1/devices?id=eq.' + id, { method: 'DELETE' })
    },

    incView: function (id) {
      return req('/rest/v1/rpc/inc_view', { method: 'POST', body: { device_id: id } }).catch(function () {})
    },

    /* ---------- 图片上传 ---------- */
    uploadImage: function (file) {
      var ext = (file.name || 'x.jpg').split('.').pop().toLowerCase()
      var path = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
      return fetch(URL + '/storage/v1/object/' + BUCKET + '/' + path, {
        method: 'POST',
        headers: {
          apikey: KEY,
          Authorization: 'Bearer ' + token,
          'Content-Type': file.type || 'image/jpeg',
          'x-upsert': 'true'
        },
        body: file
      }).then(function (r) {
        if (!r.ok) return r.text().then(function () { throw new Error('图片上传失败') })
        return URL + '/storage/v1/object/public/' + BUCKET + '/' + path
      })
    },

    /* ---------- 卖机线索 ---------- */
    createLead: function (row) {
      return req('/rest/v1/sell_leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: row
      })
    },
    listLeads: function () {
      return req('/rest/v1/sell_leads?select=*&order=created_at.desc')
    },
    markLead: function (id, handled) {
      return req('/rest/v1/sell_leads?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: { handled: !!handled }
      })
    },

    /* ---------- 维修工单 ---------- */
    createRepair: function (row) {
      return req('/rest/v1/repair_orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: row
      })
    },
    listRepairs: function () {
      return req('/rest/v1/repair_orders?select=*&order=created_at.desc')
    },
    updateRepair: function (id, patch) {
      return req('/rest/v1/repair_orders?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: patch
      })
    }
  }

  window.ZM_DB = DB
})()
