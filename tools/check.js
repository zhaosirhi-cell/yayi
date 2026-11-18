/**
 * 小程序工程静态检查 + 生命周期冒烟测试（零依赖）
 * 运行：node tools/check.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', 'miniprogram')
let errors = 0
let warns = 0
const err = (m) => { errors++; console.log('  [ERROR] ' + m) }
const warn = (m) => { warns++; console.log('  [WARN ] ' + m) }

function read (p) { return fs.readFileSync(p, 'utf8') }
function exists (p) { return fs.existsSync(p) }

console.log('\n== 1. 校验 app.json 与页面文件 ==')
const appJson = JSON.parse(read(path.join(ROOT, 'app.json')))
const pages = appJson.pages || []
pages.forEach(p => {
  ;['js', 'json', 'wxml', 'wxss'].forEach(ext => {
    const f = path.join(ROOT, p + '.' + ext)
    if (!exists(f)) err('缺少文件 ' + p + '.' + ext)
  })
})
console.log('  页面数：' + pages.length)

const tabPages = ((appJson.tabBar && appJson.tabBar.list) || []).map(t => t.pagePath)
tabPages.forEach(p => {
  if (pages.indexOf(p) === -1) err('tabBar 页面未在 pages 中注册：' + p)
})
if (!appJson.tabBar || appJson.tabBar.custom !== true) err('tabBar.custom 应为 true')
;['custom-tab-bar/index.js', 'custom-tab-bar/index.json', 'custom-tab-bar/index.wxml', 'custom-tab-bar/index.wxss']
  .forEach(f => { if (!exists(path.join(ROOT, f))) err('缺少自定义 tabBar 文件 ' + f) })

console.log('\n== 2. 校验 JSON 配置 ==')
const jsonFiles = []
;(function walk (dir) {
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p)
    else if (n.endsWith('.json')) jsonFiles.push(p)
  })
})(ROOT)
jsonFiles.forEach(f => {
  try { JSON.parse(read(f)) } catch (e) { err('JSON 解析失败 ' + path.relative(ROOT, f) + '：' + e.message) }
})
console.log('  JSON 文件：' + jsonFiles.length + ' 个，全部可解析')

console.log('\n== 3. 校验组件引用与静态资源 ==')
const assetRefs = new Set()
const customTags = new Set()
const allWxml = []
;(function walk (dir) {
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p)
    else if (n.endsWith('.wxml')) allWxml.push(p)
  })
})(ROOT)

allWxml.forEach(f => {
  const src = read(f)
  const rel = path.relative(ROOT, f)
  // 静态资源
  src.replace(/src="(\/[^"{}]+)"/g, (m, p) => { assetRefs.add(p); return m })
  src.replace(/\{\{[^}]*\}\}/g, (m) => { return m })
  // 自定义组件标签
  ;['nav-bar', 'goods-card'].forEach(tag => {
    if (new RegExp('<' + tag + '[\\s/>]').test(src)) customTags.add(rel + '::' + tag)
  })
})
assetRefs.forEach(p => {
  if (!exists(path.join(ROOT, p))) err('资源不存在：' + p)
})
console.log('  静态资源引用：' + assetRefs.size + ' 个，全部存在')

// 页面 json 必须声明用到的自定义组件
customTags.forEach(item => {
  const [wxmlRel, tag] = item.split('::')
  const jsonRel = wxmlRel.replace(/\.wxml$/, '.json')
  const cfg = JSON.parse(read(path.join(ROOT, jsonRel)))
  const uc = cfg.usingComponents || {}
  if (!uc[tag]) err(jsonRel + ' 使用了 <' + tag + '> 但未在 usingComponents 中声明')
  else if (!exists(path.join(ROOT, uc[tag].replace(/^\//, '') + '.js'))) err('组件路径不存在：' + uc[tag])
})
console.log('  自定义组件引用检查完成')

console.log('\n== 4. WXML 事件处理函数 & 图标变量 ==')
const wxsFiles = []
;(function walkWxs (dir) {
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n)
    if (fs.statSync(p).isDirectory()) walkWxs(p)
    else if (n.endsWith('.wxs')) wxsFiles.push(p)
  })
})(ROOT)
if (!wxsFiles.length) warn('未找到 wxs 文件')

// 图标颜色后缀必须真实存在
const iconDirs = fs.readdirSync(path.join(ROOT, 'assets/icons'))
const iconNames = iconDirs.filter(f => f.endsWith('.png')).map(f => f.replace(/\.png$/, ''))
allWxml.forEach(f => {
  const src = read(f)
  src.replace(/\{\{[^}]*'([a-zA-Z]+)-([a-zA-Z]+)'[^}]*\}\}/g, (m, a, b) => {
    if (['png', 'js'].indexOf(b) === -1 && iconNames.indexOf(a + '-' + b) === -1) {
      err(path.relative(ROOT, f) + ' 动态图标不存在：' + a + '-' + b + '.png')
    }
    return m
  })
})
console.log('  图标文件：' + iconNames.length + ' 个')

console.log('\n== 5. 页面/组件 生命周期冒烟测试 ==')
const results = []
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function deepClone (o) { return JSON.parse(JSON.stringify(o)) }
function setByPath (obj, pathStr, value) {
  const keys = pathStr.replace(/\[(\d+)\]/g, '.$1').split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null) cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

function makeWxMock (record) {
  const store = {}
  const noop = () => {}
  const api = {
    getStorageSync: (k) => (store[k] === undefined ? '' : store[k]),
    setStorageSync: (k, v) => { store[k] = v },
    removeStorageSync: (k) => { delete store[k] },
    getWindowInfo: () => ({ statusBarHeight: 44, windowWidth: 375, windowHeight: 812 }),
    getSystemInfoSync: () => ({ statusBarHeight: 44, windowWidth: 375, windowHeight: 812 }),
    getMenuButtonBoundingClientRect: () => ({ top: 48, height: 32, width: 87, right: 368 }),
    showToast: (o) => record.toasts.push(o && o.title),
    showModal: (o) => { record.modals.push(o && o.title); if (o && o.success) o.success({ confirm: true }) },
    showActionSheet: (o) => { if (o && o.success) o.success({ tapIndex: 0 }) },
    navigateTo: (o) => record.navs.push(o.url),
    switchTab: (o) => record.navs.push(o.url),
    navigateBack: noop,
    makePhoneCall: noop,
    previewImage: noop,
    chooseMedia: noop,
    setNavigationBarTitle: noop,
    stopPullDownRefresh: noop,
    request: (o) => { if (o && o.fail) o.fail({ errMsg: 'mock' }) }
  }
  return new Proxy(api, {
    get (t, k) {
      if (k in t) return t[k]
      return noop
    }
  })
}

async function runPage (pagePath) {
  const record = { toasts: [], modals: [], navs: [] }
  const created = []
  global.wx = makeWxMock(record)
  global.getCurrentPages = () => [{ route: pagePath }]
  global.Page = (cfg) => created.push(cfg)
  global.Component = (cfg) => created.push(cfg)

  const appCfg = { globalData: { city: '全国', userInfo: null }, setCity (c) { this.globalData.city = c }, setUser (u) { this.globalData.userInfo = u }, getCities: () => require(path.join(ROOT, 'utils/mock.js')).CITIES }
  global.getApp = () => appCfg

  const file = path.join(ROOT, pagePath + '.js')
  delete require.cache[require.resolve(file)]
  require(file)
  if (!created.length) { err(pagePath + ' 未调用 Page()/Component()'); return null }

  const cfg = created[0]
  const inst = Object.assign({}, cfg)
  inst.data = deepClone(cfg.data || {})
  inst.setData = function (patch) {
    Object.keys(patch || {}).forEach(k => setByPath(this.data, k, patch[k]))
  }
  inst.getTabBar = () => ({ setData () {} })
  inst.route = pagePath

  try {
    if (typeof inst.onLoad === 'function') await inst.onLoad({})
    if (typeof inst.onShow === 'function') await inst.onShow()
    await sleep(320)
  } catch (e) {
    err(pagePath + ' 生命周期异常：' + e.message)
    return null
  }

  // 检查 wxml 中绑定的处理函数是否存在
  const wxml = read(path.join(ROOT, pagePath + '.wxml'))
  const handlers = new Set()
  wxml.replace(/\b(?:bind|catch):?([a-zA-Z]+)="([a-zA-Z_$][\w$]*)"/g, (m, evt, fn) => { handlers.add(fn); return m })
  handlers.forEach(fn => {
    if (typeof inst[fn] !== 'function') err(pagePath + '.wxml 绑定了不存在的处理函数：' + fn)
  })

  results.push({ page: pagePath, data: inst.data, record })
  return inst
}

;(async () => {
  for (const p of pages) {
    await runPage(p)
  }
  // 组件
  for (const c of ['components/nav-bar/nav-bar', 'components/goods-card/goods-card', 'custom-tab-bar/index']) {
    const record = { toasts: [], modals: [], navs: [] }
    global.wx = makeWxMock(record)
    global.getApp = () => ({ globalData: {} })
    global.Page = () => {}
    const created = []
    global.Component = (cfg) => created.push(cfg)
    const file = path.join(ROOT, c + '.js')
    delete require.cache[require.resolve(file)]
    require(file)
    if (!created.length) { err(c + ' 未调用 Component()'); continue }
    const cfg = created[0]
    const inst = Object.assign({}, cfg, cfg.methods || {})
    inst.data = deepClone(cfg.data || {})
    inst.setData = function (patch) { Object.keys(patch).forEach(k => setByPath(this.data, k, patch[k])) }
    if (cfg.lifetimes && cfg.lifetimes.attached) {
      try { cfg.lifetimes.attached.call(inst) } catch (e) { err(c + ' attached 异常：' + e.message) }
    }
    const wxml = read(path.join(ROOT, c + '.wxml'))
    const handlers = new Set()
    wxml.replace(/\b(?:bind|catch):?([a-zA-Z]+)="([a-zA-Z_$][\w$]*)"/g, (m, evt, fn) => { handlers.add(fn); return m })
    handlers.forEach(fn => {
      if (typeof inst[fn] !== 'function') err(c + '.wxml 绑定了不存在的方法：' + fn)
    })
  }

  console.log('\n== 6. 数据自检 ==')
  const home = results.find(r => r.page === 'pages/index/index')
  if (home) {
    const d = home.data
    console.log('  首页：colA ' + d.colA.length + ' 条 / colB ' + d.colB.length + ' 条 / 城市 ' + d.city)
    if (!d.colA.length && !d.colB.length) err('首页没有加载到设备数据')
    if (home.record.toasts.length) warn('首页 toast：' + home.record.toasts.join(' | '))
  }
  const detail = results.find(r => r.page === 'pages/detail/detail')
  if (detail && detail.data.detail) {
    console.log('  详情：' + detail.data.detail.title + ' / 参数 ' + detail.data.specs.length + ' 项 / 相似 ' + detail.data.related.length + ' 台')
  } else if (detail) {
    err('详情页未加载出数据')
  }
  const list = results.find(r => r.page === 'pages/list/list')
  if (list) console.log('  列表：' + list.data.list.length + ' 条 / 共 ' + list.data.total + ' 台')
  const pick = results.find(r => r.page === 'pages/pick/pick')
  if (pick) console.log('  甄选：' + (pick.data.colA.length + pick.data.colB.length) + ' 台')
  const news = results.find(r => r.page === 'pages/news/news')
  if (news) console.log('  资讯：' + news.data.list.length + ' 条')

  console.log('\n===== 结果：' + (errors ? errors + ' 个错误' : '通过') + (warns ? '，' + warns + ' 个警告' : '') + ' =====\n')
  process.exit(errors ? 1 : 0)
})()

process.on('unhandledRejection', (e) => {
  err('未处理的 Promise 异常：' + (e && e.message))
})
