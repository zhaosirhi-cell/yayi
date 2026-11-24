/**
 * 本地模拟 Supabase（只为验证前端接入逻辑，不是生产用）
 *   node tools/mock-supabase.js
 *   监听 http://127.0.0.1:54321，实现了项目里用到的那些 REST 端点
 *   数据存在 tools/.mock-db.json
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = Number(process.env.PORT || 54321)
const DB_FILE = path.join(__dirname, '.mock-db.json')
const UPLOAD_DIR = path.join(__dirname, '.mock-uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const ANON = 'mock-anon-key'
const OWNER_PASSWORD = 'yayi123456'

function load () {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) } catch (e) {
    return { devices: [], sell_leads: [], repair_orders: [], seq: 1 }
  }
}
let db = load()
function save () { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)) }
function nextId () { return db.seq++ }

function cors (res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Expose-Headers', '*')
}
function json (res, code, body) {
  cors(res)
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body === undefined ? null : body))
}
function readBody (req) {
  return new Promise(resolve => {
    let raw = ''
    req.on('data', c => { raw += c })
    req.on('end', () => {
      if (!raw) return resolve(null)
      try { resolve(JSON.parse(raw)) } catch (e) { resolve(raw) }
    })
  })
}
function authOK (req) {
  const h = req.headers.authorization || ''
  return h.indexOf('mock-token') > -1 || h.indexOf(ANON) > -1
}
function isOwner (req) {
  return (req.headers.authorization || '').indexOf('mock-token') > -1
}
function pickFilter (url) {
  // 支持 id=eq.N
  const id = url.searchParams.get('id')
  if (!id) return null
  const m = /^eq\.(\d+)$/.exec(id)
  return m ? Number(m[1]) : null
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1')
  const p = u.pathname
  const method = req.method

  if (method === 'OPTIONS') { cors(res); res.writeHead(204); return res.end() }

  /* ---------- 登录 ---------- */
  if (p === '/auth/v1/token') {
    const b = await readBody(req) || {}
    if (b.password === OWNER_PASSWORD) {
      return json(res, 200, { access_token: 'mock-token-owner', token_type: 'bearer', user: { email: b.email } })
    }
    return json(res, 400, { error: 'invalid_grant', error_description: 'Invalid login credentials' })
  }

  /* ---------- 图片 ---------- */
  if (p.indexOf('/storage/v1/object/device-images/') === 0 && method === 'POST') {
    if (!isOwner(req)) return json(res, 401, { message: 'unauthorized' })
    const name = p.split('/').pop()
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.concat(chunks))
      json(res, 200, { Key: 'device-images/' + name })
    })
    return
  }
  if (p.indexOf('/storage/v1/object/public/device-images/') === 0 && method === 'GET') {
    const name = p.split('/').pop()
    const f = path.join(UPLOAD_DIR, name)
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found') }
    cors(res)
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    return res.end(fs.readFileSync(f))
  }

  /* ---------- RPC ---------- */
  if (p === '/rest/v1/rpc/inc_view') {
    const b = await readBody(req) || {}
    const d = db.devices.find(x => x.id === Number(b.device_id))
    if (d) { d.view_count = (d.view_count || 0) + 1; save() }
    return json(res, 200, null)
  }

  /* ---------- 表操作 ---------- */
  const tableMap = { '/rest/v1/devices': 'devices', '/rest/v1/sell_leads': 'sell_leads', '/rest/v1/repair_orders': 'repair_orders' }
  const table = tableMap[p.replace(/\/$/, '')]
  if (!table) return json(res, 404, { message: 'not found: ' + p })

  const rows = db[table]
  const id = pickFilter(u)

  if (method === 'GET') {
    if (!authOK(req)) return json(res, 401, { message: 'no auth' })
    let out = rows.slice()
    // 匿名只能看上架中的设备
    if (table === 'devices' && !isOwner(req)) out = out.filter(r => r.status === 'on')
    // 线索/工单只有店主能读
    if ((table === 'sell_leads' || table === 'repair_orders') && !isOwner(req)) out = []
    out.sort((a, b) => (String(b.created_at) > String(a.created_at) ? 1 : -1))
    return json(res, 200, out)
  }

  if (method === 'POST') {
    if (!authOK(req)) return json(res, 401, { message: 'no auth' })
    if (table !== 'sell_leads' && table !== 'repair_orders' && !isOwner(req)) {
      return json(res, 403, { message: 'only owner can write ' + table })
    }
    const b = await readBody(req) || {}
    const row = Object.assign({}, b, {
      id: nextId(),
      created_at: new Date().toISOString(),
      view_count: b.view_count || 0,
      handled: b.handled || false
    })
    rows.push(row)
    save()
    return json(res, 201, [row])
  }

  if (method === 'PATCH') {
    if (!isOwner(req)) return json(res, 403, { message: 'only owner' })
    const b = await readBody(req) || {}
    const hit = rows.find(r => r.id === id)
    if (hit) { Object.assign(hit, b); save() }
    return json(res, 200, hit ? [hit] : [])
  }

  if (method === 'DELETE') {
    if (!isOwner(req)) return json(res, 403, { message: 'only owner' })
    db[table] = rows.filter(r => r.id !== id)
    save()
    return json(res, 204, null)
  }

  json(res, 405, { message: 'method not allowed' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('本地模拟 Supabase 已启动：http://127.0.0.1:' + PORT)
  console.log('匿名 key: ' + ANON)
  console.log('店主密码: ' + OWNER_PASSWORD + '（邮箱随意）')
  console.log('已有数据：devices=' + db.devices.length + ' leads=' + db.sell_leads.length)
})
