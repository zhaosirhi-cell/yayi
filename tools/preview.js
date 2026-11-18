/**
 * 本地预览器（只用于自检，不参与小程序打包）
 * 把 WXML + WXSS + 页面数据 渲染成 HTML，方便用浏览器核对版式。
 * 运行：node tools/preview.js   输出到 _preview/*.html
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', 'miniprogram')
const OUT = path.resolve(__dirname, '..', '_preview')
fs.mkdirSync(OUT, { recursive: true })

/* ---------------- WXML 解析 ---------------- */
function parseAttrs (s) {
  const out = {}
  const re = /([a-zA-Z_:][-\w:]*)\s*=\s*"([^"]*)"|([a-zA-Z_:][-\w:]*)/g
  let m
  while ((m = re.exec(s))) {
    if (m[1]) out[m[1]] = m[2]
    else if (m[3]) out[m[3]] = ''
  }
  return out
}

function parseWxml (src) {
  src = src.replace(/<!--[\s\S]*?-->/g, '')
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  const tagRe = /<\/?([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g
  let lastIndex = 0
  let m
  while ((m = tagRe.exec(src))) {
    if (m.index > lastIndex) {
      const text = src.slice(lastIndex, m.index)
      if (text.trim()) stack[stack.length - 1].children.push({ tag: '#text', text })
    }
    lastIndex = tagRe.lastIndex
    const isClose = m[0].slice(0, 2) === '</'
    const tag = m[1]
    if (isClose) {
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === tag) { stack.length = k; break }
      }
    } else {
      const node = { tag, attrs: parseAttrs(m[2]), children: [] }
      stack[stack.length - 1].children.push(node)
      if (!m[3]) stack.push(node)
    }
  }
  if (lastIndex < src.length) {
    const text = src.slice(lastIndex)
    if (text.trim()) stack[stack.length - 1].children.push({ tag: '#text', text })
  }
  return root
}

/* ---------------- 表达式求值 ---------------- */
const exprCache = new Map()
function evalExpr (expr, scope) {
  let fn = exprCache.get(expr)
  if (!fn) {
    try {
      fn = new Function('__s', 'with (__s) { return (' + expr + ') }')
    } catch (e) {
      fn = () => ''
    }
    exprCache.set(expr, fn)
  }
  try {
    return fn(scope)
  } catch (e) {
    return ''
  }
}

const WHOLE_EXPR = /^\s*\{\{[\s\S]*?\}\}\s*$/
function evalAttr (raw, scope) {
  if (raw == null) return undefined
  if (WHOLE_EXPR.test(raw) && (raw.match(/\{\{/g) || []).length === 1) {
    return evalExpr(raw.replace(/^\s*\{\{|\}\}\s*$/g, ''), scope)
  }
  return interp(raw, scope)
}
function interp (raw, scope) {
  if (typeof raw !== 'string') return raw
  return raw.replace(/\{\{([\s\S]*?)\}\}/g, (m, e) => {
    const v = evalExpr(e, scope)
    return v === undefined || v === null || v === false ? '' : String(v)
  })
}

/* ---------------- 渲染 ---------------- */
const TAG_MAP = {
  view: 'div',
  'scroll-view': 'div',
  'swiper': 'div',
  'swiper-item': 'div',
  text: 'span',
  image: 'img',
  input: 'input',
  picker: 'div',
  navigator: 'a'
}

const COMPONENTS = {
  'nav-bar': 'components/nav-bar/nav-bar',
  'goods-card': 'components/goods-card/goods-card'
}

function loadWxs (scope) {
  const wxsPath = path.join(ROOT, 'wxs/format.wxs')
  const mod = { exports: {} }
  // eslint-disable-next-line no-new-func
  new Function('module', 'exports', fs.readFileSync(wxsPath, 'utf8'))(mod, mod.exports)
  scope.f = mod.exports
}

function renderWxmlFile (relPath, data, depth) {
  const wxml = fs.readFileSync(path.join(ROOT, relPath + '.wxml'), 'utf8')
  const tree = parseWxml(wxml)
  const scope = Object.create(null)
  loadWxs(scope)
  Object.assign(scope, data)
  return renderChildren(tree.children, scope, depth || 0)
}

function esc (s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderChildren (nodes, scope, depth) {
  let html = ''
  let cond = null
  for (const node of nodes) {
    if (node.tag === '#text') {
      html += esc(interp(node.text, scope)).replace(/\n\s*/g, ' ')
      continue
    }
    if (node.tag === 'wxs') continue
    const a = node.attrs || {}

    // 条件渲染链
    if (a['wx:if'] !== undefined) {
      const ok = !!evalAttr(a['wx:if'], scope)
      cond = ok
      if (!ok) continue
    } else if (a['wx:elif'] !== undefined) {
      if (cond) continue
      const ok = !!evalAttr(a['wx:elif'], scope)
      cond = ok
      if (!ok) continue
    } else if (a['wx:else'] !== undefined) {
      if (cond) continue
      cond = true
    } else {
      cond = null
    }

    // 列表渲染
    if (a['wx:for'] !== undefined) {
      const arr = evalAttr(a['wx:for'], scope) || []
      const itemName = a['wx:for-item'] || 'item'
      const indexName = a['wx:for-index'] || 'index'
      const list = Array.isArray(arr) ? arr : []
      list.forEach((it, idx) => {
        const sc = Object.create(scope)
        sc[itemName] = it
        sc[indexName] = idx
        const clone = { tag: node.tag, attrs: Object.assign({}, a), children: node.children }
        delete clone.attrs['wx:for']
        html += renderNode(clone, sc, depth)
      })
      continue
    }

    html += renderNode(node, scope, depth)
  }
  return html
}

function styleAttr (a, scope) {
  const cls = a.class ? interp(a.class, scope) : ''
  const sty = a.style ? interp(a.style, scope) : ''
  return { cls, sty }
}

function renderNode (node, scope, depth) {
  const a = node.attrs || {}
  const { cls, sty } = styleAttr(a, scope)
  const classAttr = cls ? ` class="${cls}"` : ''
  const styleStr = sty ? ` style="${sty}"` : ''

  if (node.tag === 'block') {
    return renderChildren(node.children, scope, depth)
  }

  // 自定义组件：递归渲染其模板
  if (COMPONENTS[node.tag]) {
    if (depth > 4) return ''
    const compPath = COMPONENTS[node.tag]
    let props = {}
    // 组件默认 data
    const compJs = fs.readFileSync(path.join(ROOT, compPath + '.js'), 'utf8')
    const dataMatch = compJs.match(/data:\s*\{([\s\S]*?)\n  \}/)
    if (dataMatch) {
      try {
        // eslint-disable-next-line no-new-func
        props = new Function('return {' + dataMatch[1] + '}')()
      } catch (e) { props = {} }
    }
    if (node.tag === 'nav-bar') {
      props.statusBarHeight = 44
      props.navBarHeight = 44
    }
    Object.keys(a).forEach(k => {
      if (k.indexOf('wx:') === 0 || k === 'class' || k === 'style' || k === 'id') return
      props[k] = evalAttr(a[k], scope)
    })
    const inner = renderWxmlFile(compPath, props, depth + 1)
    return `<div class="host ${cls}"${styleStr}>${inner}</div>`
  }

  const tag = TAG_MAP[node.tag] || 'div'

  if (tag === 'img') {
    const src = interp(a.src || '', scope)
    const mode = a.mode || 'scaleToFill'
    const fit = mode === 'aspectFill' ? 'cover' : mode === 'aspectFit' ? 'contain' : 'fill'
    return `<img${classAttr}${styleStr} src="${src}" style="object-fit:${fit};${sty}">`
  }
  if (tag === 'input') {
    const ph = a.placeholder ? esc(interp(a.placeholder, scope)) : ''
    const val = a.value ? esc(interp(a.value, scope)) : ''
    return `<input${classAttr} style="${sty}" placeholder="${ph}" value="${val}">`
  }

  const inner = renderChildren(node.children || [], scope, depth)
  return `<${tag}${classAttr}${styleStr}>${inner}</${tag}>`
}

/* ---------------- WXSS 转换 ---------------- */
function convertWxss (relPath) {
  const file = relPath.endsWith('.wxss') ? relPath : relPath + '.wxss'
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8')
  return src
    .replace(/(-?\d*\.?\d+)rpx/g, (m, n) => (parseFloat(n) / 2) + 'px')
    .replace(/env\(safe-area-inset-bottom\)/g, '0px')
    .replace(/constant\(safe-area-inset-bottom\)/g, '0px')
    .replace(/(^|\})\s*page\s*\{/g, '$1 body {')
}

/* ---------------- 抓页面数据（复用 check.js 的思路） ---------------- */
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function stubWx () {
  const store = {}
  const noop = () => {}
  const api = {
    getStorageSync: (k) => (store[k] === undefined ? '' : store[k]),
    setStorageSync: (k, v) => { store[k] = v },
    removeStorageSync: (k) => { delete store[k] },
    getWindowInfo: () => ({ statusBarHeight: 44, windowWidth: 375, windowHeight: 812 }),
    getSystemInfoSync: () => ({ statusBarHeight: 44, windowWidth: 375, windowHeight: 812 }),
    getMenuButtonBoundingClientRect: () => ({ top: 48, height: 32 }),
    showModal: (o) => { if (o && o.success) o.success({ confirm: true }) }
  }
  return new Proxy(api, { get: (t, k) => (k in t ? t[k] : noop) })
}

function setByPath (obj, pathStr, value) {
  const keys = String(pathStr).replace(/\[(\d+)\]/g, '.$1').split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null) cur[keys[i]] = {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
}

async function capturePage (pagePath) {
  global.wx = stubWx()
  global.getCurrentPages = () => [{ route: pagePath }]
  const created = []
  global.Page = (cfg) => created.push(cfg)
  global.getApp = () => ({
    globalData: { city: '全国', userInfo: null },
    setCity (c) { this.globalData.city = c },
    setUser (u) { this.globalData.userInfo = u },
    getCities: () => require(path.join(ROOT, 'utils/mock.js')).CITIES
  })
  const file = path.join(ROOT, pagePath + '.js')
  delete require.cache[require.resolve(file)]
  require(file)
  const cfg = created[0]
  const inst = Object.assign({}, cfg)
  inst.data = JSON.parse(JSON.stringify(cfg.data || {}))
  inst.setData = function (patch) {
    Object.keys(patch || {}).forEach(k => setByPath(this.data, k, patch[k]))
  }
  inst.getTabBar = () => ({ setData () {} })
  if (typeof inst.onLoad === 'function') await inst.onLoad({})
  if (typeof inst.onShow === 'function') await inst.onShow()
  await sleep(320)
  return inst.data
}

/* ---------------- 主流程 ---------------- */
const PAGES = [
  { path: 'pages/index/index', tab: true, selected: 0 },
  { path: 'pages/pick/pick', tab: true, selected: 1 },
  { path: 'pages/list/list', tab: false },
  { path: 'pages/detail/detail', tab: false },
  { path: 'pages/publish/publish', tab: false },
  { path: 'pages/search/search', tab: false },
  { path: 'pages/news/news', tab: true, selected: 2 },
  { path: 'pages/mine/mine', tab: true, selected: 3 }
]

;(async () => {
  const baseCss = convertWxss('app.wxss')
  const compCss = ['components/nav-bar/nav-bar', 'components/goods-card/goods-card'].map(convertWxss).join('\n')
  const tabBarCss = convertWxss('custom-tab-bar/index')
  const tabBarData = { selected: 0, list: [
    { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
    { pagePath: '/pages/pick/pick', text: '甄选', icon: 'star' },
    { pagePath: '/pages/news/news', text: '资讯', icon: 'news' },
    { pagePath: '/pages/mine/mine', text: '我的', icon: 'user' }
  ] }

  for (const p of PAGES) {
    const data = await capturePage(p.path)
    let body = renderWxmlFile(p.path, data)
    let extraCss = ''
    if (p.tab) {
      const barData = Object.assign({}, tabBarData, { selected: p.selected })
      body += renderWxmlFile('custom-tab-bar/index', barData)
      extraCss = tabBarCss
    }
    const css = [baseCss, compCss, convertWxss(p.path), extraCss].join('\n')
    // 绝对路径资源改成相对路径，方便 file:// 直接打开
    body = body.replace(/src="\/assets/g, 'src="../miniprogram/assets')
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { margin: 0; width: 375px; min-height: 812px; }
  *, *::before, *::after { box-sizing: border-box; }
  .host { display: block; }
  img { display: block; }
  input { border: 0; outline: 0; background: none; font: inherit; color: inherit; }
  ${css}
</style></head>
<body>${body}</body></html>`
    const name = p.path.replace(/\//g, '_')
    fs.writeFileSync(path.join(OUT, name + '.html'), html)
    console.log('预览已生成：_preview/' + name + '.html')
  }
})()
