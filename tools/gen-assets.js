/**
 * 资源生成脚本（零依赖）
 *  - 生成小程序图标 PNG（4 种颜色 × 27 个图标）
 *  - 生成设备占位图 PNG
 * 运行：node tools/gen-assets.js
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

/* ---------------- PNG 编码 ---------------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32 (buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk (type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG (w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

/* ---------------- 几何（归一化 0~1 坐标，源网格 24） ---------------- */
const G = 24
const n = v => v / G
const hyp = (x, y) => Math.sqrt(x * x + y * y)

function sdSeg (px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1
  const len2 = dx * dx + dy * dy || 1e-9
  let t = ((px - x1) * dx + (py - y1) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return hyp(px - (x1 + t * dx), py - (y1 + t * dy))
}
function sdRoundRect (px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r)
  const qy = Math.abs(py - cy) - (hh - r)
  return Math.min(Math.max(qx, qy), 0) + hyp(Math.max(qx, 0), Math.max(qy, 0)) - r
}
function inPoly (px, py, pts) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j]
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
function sdPoly (px, py, pts, closed) {
  let d = Infinity
  const last = closed ? pts.length : pts.length - 1
  for (let i = 0; i < last; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    d = Math.min(d, sdSeg(px, py, a[0], a[1], b[0], b[1]))
  }
  return d
}

/* shape 说明
 * cs 圆描边 / cf 圆填充 / s 线段 / ps 折线描边 / pf 多边形填充
 * rr 圆角矩形描边（w 为线宽，缺省则填充）/ arc 圆弧描边
 */
function hit (sh, x, y) {
  switch (sh.c) {
    case 'cs': return Math.abs(hyp(x - n(sh.cx), y - n(sh.cy)) - n(sh.r)) <= n(sh.w) / 2
    case 'cf': return hyp(x - n(sh.cx), y - n(sh.cy)) <= n(sh.r)
    case 's': return sdSeg(x, y, n(sh.a[0]), n(sh.a[1]), n(sh.b[0]), n(sh.b[1])) <= n(sh.w) / 2
    case 'ps': {
      const pts = sh.pts.map(p => [n(p[0]), n(p[1])])
      return sdPoly(x, y, pts, !!sh.closed) <= n(sh.w) / 2
    }
    case 'pf': return inPoly(x, y, sh.pts.map(p => [n(p[0]), n(p[1])]))
    case 'rr': {
      const d = sdRoundRect(x, y, n(sh.x + sh.w / 2), n(sh.y + sh.h / 2), n(sh.w / 2), n(sh.h / 2), n(sh.r || 0))
      return sh.sw == null ? d <= 0 : Math.abs(d) <= n(sh.sw) / 2
    }
    case 'arc': {
      const cx = n(sh.cx), cy = n(sh.cy), r = n(sh.r)
      const dx = x - cx, dy = y - cy
      const dist = hyp(dx, dy)
      let ang = (Math.atan2(dy, dx) * 180) / Math.PI
      const a0 = sh.a0, a1 = sh.a1
      const w = n(sh.w) / 2
      const norm = a => ((a % 360) + 360) % 360
      let rel = norm(ang - a0), span = norm(a1 - a0)
      if (Math.abs(dist - r) <= w && rel <= span) return true
      // 端点圆帽
      const capA = [a0, a1]
      for (const a of capA) {
        const rad = (a * Math.PI) / 180
        if (hyp(x - (cx + r * Math.cos(rad)), y - (cy + r * Math.sin(rad))) <= w) return true
      }
      return false
    }
  }
  return false
}

/* ---------------- 图标定义 ---------------- */
const SW = 1.7
const starPts = (() => {
  const out = []
  for (let k = 0; k < 10; k++) {
    const a = ((-90 + k * 36) * Math.PI) / 180
    const r = k % 2 === 0 ? 8.6 : 3.7
    out.push([12 + r * Math.cos(a), 12.6 + r * Math.sin(a)])
  }
  return out
})()

const ICONS = {
  home: [
    { c: 'ps', pts: [[3.4, 10.6], [12, 3.8], [20.6, 10.6]], w: SW },
    { c: 'rr', x: 5.2, y: 9.2, w: 13.6, h: 11.7, r: 1.8, sw: SW }
  ],
  star: [{ c: 'ps', pts: starPts, w: SW, closed: true }],
  news: [
    { c: 'rr', x: 3.5, y: 5, w: 17, h: 14, r: 3.4, sw: SW },
    { c: 's', a: [7.6, 9.4], b: [12.6, 9.4], w: SW },
    { c: 's', a: [7.6, 12.6], b: [16.4, 12.6], w: SW },
    { c: 's', a: [7.6, 15.8], b: [13.6, 15.8], w: SW }
  ],
  user: [
    { c: 'cs', cx: 12, cy: 7.9, r: 3.6, w: SW },
    { c: 'arc', cx: 12, cy: 20.4, r: 5.6, a0: 180, a1: 360, w: SW }
  ],
  userFill: [
    { c: 'cf', cx: 12, cy: 8.2, r: 4.2 },
    { c: 'cf', cx: 12, cy: 21.6, r: 6.4 }
  ],
  search: [
    { c: 'cs', cx: 10.9, cy: 10.9, r: 6.5, w: SW },
    { c: 's', a: [15.7, 15.7], b: [20.2, 20.2], w: SW }
  ],
  caret: [
    { c: 's', a: [7.2, 9.8], b: [12, 15.4], w: 2.1 },
    { c: 's', a: [12, 15.4], b: [16.8, 9.8], w: 2.1 }
  ],
  shop: [
    { c: 's', a: [4.4, 9.7], b: [19.6, 9.7], w: SW },
    { c: 'ps', pts: [[5.2, 5.4], [18.8, 5.4], [19.6, 9.7], [4.4, 9.7]], w: SW, closed: true },
    { c: 'rr', x: 4.7, y: 9.7, w: 14.6, h: 10.7, r: 1.8, sw: SW },
    { c: 'rr', x: 9.7, y: 14.6, w: 4.6, h: 5.8, r: 1.1, sw: SW }
  ],
  doclist: [
    { c: 'rr', x: 3.6, y: 4.6, w: 16.8, h: 14.8, r: 3.2, sw: SW },
    { c: 's', a: [7.6, 9.4], b: [16.4, 9.4], w: SW },
    { c: 's', a: [7.6, 12.6], b: [16.4, 12.6], w: SW },
    { c: 's', a: [7.6, 15.8], b: [12.8, 15.8], w: SW }
  ],
  medbag: [
    { c: 'rr', x: 3.4, y: 7.6, w: 17.2, h: 12.4, r: 3.2, sw: SW },
    { c: 'arc', cx: 12, cy: 7.6, r: 3.0, a0: 180, a1: 360, w: SW },
    { c: 's', a: [12, 11.4], b: [12, 16.2], w: SW },
    { c: 's', a: [9.6, 13.8], b: [14.4, 13.8], w: SW }
  ],
  tag: [
    { c: 'ps', pts: [[4.4, 11.4], [4.4, 5.6], [11.6, 5.6], [19.6, 13.6], [11.6, 21.2]], w: SW, closed: true },
    { c: 'cf', cx: 8.6, cy: 8.6, r: 1.3 }
  ],
  money: [
    { c: 'cs', cx: 12, cy: 12, r: 8.3, w: SW },
    { c: 's', a: [9.1, 8.6], b: [12, 11.9], w: SW },
    { c: 's', a: [12, 11.9], b: [14.9, 8.6], w: SW },
    { c: 's', a: [12, 11.9], b: [12, 16.8], w: SW },
    { c: 's', a: [9.7, 13.6], b: [14.3, 13.6], w: SW },
    { c: 's', a: [9.7, 15.4], b: [14.3, 15.4], w: SW }
  ],
  camera: [
    { c: 'rr', x: 3.6, y: 9.2, w: 16.8, h: 9.9, r: 2.2, sw: SW },
    { c: 'ps', pts: [[6.8, 9.2], [8.4, 6.9], [15.6, 6.9], [17.2, 9.2]], w: SW },
    { c: 'cs', cx: 12, cy: 14, r: 3.2, w: SW }
  ],
  shield: [
    { c: 'ps', pts: [[12, 3.5], [18.8, 6.1], [18.8, 11.6], [12, 20.4], [5.2, 11.6], [5.2, 6.1]], w: SW, closed: true },
    { c: 'ps', pts: [[8.9, 11.9], [11.1, 14.1], [15.2, 9.9]], w: SW }
  ],
  chat: [
    { c: 'rr', x: 4.2, y: 5.8, w: 15.6, h: 10, r: 2.6, sw: SW },
    { c: 'ps', pts: [[8.2, 15.6], [8.2, 19.8], [12.4, 15.6]], w: SW }
  ],
  arrow: [{ c: 'ps', pts: [[9.8, 5.6], [16.2, 12], [9.8, 18.4]], w: SW }],
  back: [{ c: 'ps', pts: [[14.6, 5.2], [8, 12], [14.6, 18.8]], w: SW }],
  share: [
    { c: 'cs', cx: 17.6, cy: 6.2, r: 2.3, w: SW },
    { c: 'cs', cx: 6.4, cy: 12, r: 2.3, w: SW },
    { c: 'cs', cx: 17.6, cy: 17.8, r: 2.3, w: SW },
    { c: 's', a: [8.5, 10.9], b: [15.5, 7.3], w: SW },
    { c: 's', a: [8.5, 13.1], b: [15.5, 16.7], w: SW }
  ],
  plus: [
    { c: 's', a: [12, 5.6], b: [12, 18.4], w: SW },
    { c: 's', a: [5.6, 12], b: [18.4, 12], w: SW }
  ],
  close: [
    { c: 's', a: [6.6, 6.6], b: [17.4, 17.4], w: SW },
    { c: 's', a: [17.4, 6.6], b: [6.6, 17.4], w: SW }
  ],
  filter: [
    { c: 's', a: [4.4, 6.6], b: [19.6, 6.6], w: SW },
    { c: 's', a: [7.4, 12], b: [16.6, 12], w: SW },
    { c: 's', a: [10.4, 17.4], b: [13.6, 17.4], w: SW }
  ],
  gear: (() => {
    const out = []
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4
      out.push({
        c: 's',
        a: [12 + 4.9 * Math.cos(a), 12 + 4.9 * Math.sin(a)],
        b: [12 + 8.5 * Math.cos(a), 12 + 8.5 * Math.sin(a)],
        w: 3.2
      })
    }
    out.push({ c: 'cs', cx: 12, cy: 12, r: 5.0, w: SW })
    out.push({ c: 'cs', cx: 12, cy: 12, r: 2.0, w: SW })
    return out
  })(),
  cart: [
    { c: 'cf', cx: 9.6, cy: 19, r: 1.5 },
    { c: 'cf', cx: 17, cy: 19, r: 1.5 },
    { c: 'ps', pts: [[3, 4.7], [5.3, 4.7], [7.7, 14.8], [18.1, 14.8], [20.3, 7.4], [6.3, 7.4]], w: SW }
  ],
  bars: [
    { c: 's', a: [5.4, 19.2], b: [5.4, 11.8], w: SW + 0.6 },
    { c: 's', a: [12, 19.2], b: [12, 5.6], w: SW + 0.6 },
    { c: 's', a: [18.6, 19.2], b: [18.6, 15.2], w: SW + 0.6 }
  ],
  edit: [
    { c: 'rr', x: 5, y: 3.6, w: 14.1, h: 17.2, r: 2.4, sw: SW },
    { c: 's', a: [8.9, 13.9], b: [13.1, 13.9], w: SW },
    { c: 's', a: [8.9, 17], b: [14.9, 17], w: SW }
  ],
  clock: [
    { c: 'cs', cx: 12, cy: 12, r: 8.2, w: SW },
    { c: 'ps', pts: [[12, 7.6], [12, 12], [15.1, 13.9]], w: SW }
  ],
  check: [{ c: 'ps', pts: [[5.6, 12.4], [9.9, 16.7], [18.4, 7.8]], w: SW }],
  thumb: [
    { c: 'ps', pts: [[8.1, 10.4], [11.7, 4.2], [13.5, 5.4], [13.2, 9.1], [17.6, 9.1], [19.1, 10.9], [18.1, 18.2], [8.1, 18.2]], w: SW, closed: true },
    { c: 'rr', x: 4.6, y: 10.2, w: 3.5, h: 8.1, r: 1, sw: SW }
  ]
}

/* ---------------- 渲染 ---------------- */
const S = 96
const SS = 3
function renderMask (shapes) {
  const mask = new Uint8Array(S * S)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let hitCount = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = (x + (sx + 0.5) / SS) / S
          const py = (y + (sy + 0.5) / SS) / S
          for (let i = 0; i < shapes.length; i++) {
            if (hit(shapes[i], px, py)) { hitCount++; break }
          }
        }
      }
      mask[y * S + x] = Math.round((hitCount / (SS * SS)) * 255)
    }
  }
  return mask
}
function hex2rgb (hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}
function maskToPNG (mask, hex) {
  const [r, g, b] = hex2rgb(hex)
  const buf = Buffer.alloc(S * S * 4)
  for (let i = 0; i < S * S; i++) {
    buf[i * 4] = r
    buf[i * 4 + 1] = g
    buf[i * 4 + 2] = b
    buf[i * 4 + 3] = mask[i]
  }
  return encodePNG(S, S, buf)
}

/* ---------------- 占位图 ---------------- */
function lerp (a, b, t) { return a + (b - a) * t }
function clamp (v) { return Math.max(0, Math.min(255, Math.round(v))) }
function mix (c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)] }
function hx (hex) { return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)] }
// 圆角矩形有向距离（归一化坐标）
function sdRR (u, v, cx, cy, hw, hh, r) {
  const dx = Math.abs(u - cx) - (hw - r)
  const dy = Math.abs(v - cy) - (hh - r)
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - r
}
// 椭圆有向距离（近似）
function sdEllipse (u, v, cx, cy, rx, ry) {
  const nx = (u - cx) / rx, ny = (v - cy) / ry
  return (Math.hypot(nx, ny) - 1) * Math.min(rx, ry)
}
/** 渲染一张“设备实拍”风格的占位图 */
function renderPhoto (w, h, seed, tint) {
  const buf = Buffer.alloc(w * h * 4)
  const px = 1 / w
  let s = seed * 9301 + 49297
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  // 每张图做一点参数抖动，避免九宫格看起来一模一样
  const jitter = (k) => (rnd() - 0.5) * k
  const bodyW = 0.185 + jitter(0.03)
  const bodyTop = 0.24 + jitter(0.03)
  const bodyBottom = 0.84 - Math.abs(jitter(0.04))
  const screenOn = rnd() > 0.35

  const wallTop = mix(hx('#EFF3F7'), tint, 0.10)
  const wallBottom = mix(hx('#CFD9E2'), tint, 0.16)
  const bodyTopC = hx('#F6F9FB')
  const bodyBottomC = mix(hx('#BCC9D5'), tint, 0.18)
  const edgeC = mix(hx('#8E9BA8'), tint, 0.2)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h
      // 背景：墙面上浅下深 + 顶部主光
      let c = mix(wallTop, wallBottom, Math.min(1, v * 1.25))
      const glow = Math.max(0, 1 - Math.hypot(u - 0.72, v - 0.16) / 0.75) ** 2
      c = mix(c, [255, 255, 255], glow * 0.55)
      // 地面线
      const floor = Math.max(0, Math.min(1, (v - 0.865) / (px * 2)))
      c = mix(c, mix(c, [180, 190, 200], 0.35), floor)

      // 机身投影
      const sh = Math.max(0, Math.min(1, 0.5 - sdEllipse(u, v, 0.5, bodyBottom + 0.015, 0.235, 0.035) / (px * 26)))
      c = mix(c, [120, 132, 145], sh * 0.45)

      // 机身
      const dBody = sdRR(u, v, 0.5, (bodyTop + bodyBottom) / 2, bodyW, (bodyBottom - bodyTop) / 2, 0.03)
      const covBody = Math.max(0, Math.min(1, 0.5 - dBody / (px * 1.4)))
      if (covBody > 0) {
        let body = mix(bodyTopC, bodyBottomC, Math.max(0, Math.min(1, (v - bodyTop) / (bodyBottom - bodyTop))))
        // 机身左侧受光
        body = mix(body, [255, 255, 255], Math.max(0, 1 - Math.abs(u - (0.5 - bodyW * 0.55)) / 0.09) * 0.28)
        // 描边
        const edge = Math.max(0, Math.min(1, 1 - Math.abs(dBody) / (px * 2.2)))
        body = mix(body, edgeC, edge * 0.75)
        c = mix(c, body, covBody)
      }

      // 屏幕
      const scrCy = bodyTop + (bodyBottom - bodyTop) * 0.19
      const scrHh = (bodyBottom - bodyTop) * 0.115
      const dScr = sdRR(u, v, 0.5, scrCy, bodyW * 0.62, scrHh, 0.012)
      const covScr = Math.max(0, Math.min(1, 0.5 - dScr / (px * 1.4)))
      if (covScr > 0) {
        let scr = screenOn
          ? mix(hx('#33414E'), hx('#5B7C93'), Math.max(0, Math.min(1, (v - (scrCy - scrHh)) / (scrHh * 2))))
          : hx('#2C333A')
        scr = mix(scr, [255, 255, 255], Math.max(0, 1 - Math.hypot(u - (0.5 - bodyW * 0.35), v - (scrCy - scrHh * 0.45)) / 0.16) * 0.35)
        const sheen = Math.max(0, Math.min(1, 0.5 - sdRR(u, v, 0.5, scrCy + scrHh * 0.15, bodyW * 0.6, scrHh * 1.1, 0.01) / (px * 8)))
        scr = mix(scr, [255, 255, 255], sheen * 0.10)
        c = mix(c, scr, covScr)
      }

      // 机身下部散热格栅
      const grTop = bodyTop + (bodyBottom - bodyTop) * 0.55
      for (let g = 0; g < 4; g++) {
        const gy = grTop + g * 0.026
        const dg = sdRR(u, v, 0.5, gy, bodyW * 0.55, 0.005, 0.004)
        const cg = Math.max(0, Math.min(1, 0.5 - dg / (px * 1.2)))
        if (cg > 0) c = mix(c, edgeC, cg * 0.55)
      }

      // 轻微量化压缩体积（小程序主包上限 2MB，占位图不能太肥）
      const i = (y * w + x) * 4
      buf[i] = Math.min(255, Math.round(c[0] / 2) * 2)
      buf[i + 1] = Math.min(255, Math.round(c[1] / 2) * 2)
      buf[i + 2] = Math.min(255, Math.round(c[2] / 2) * 2)
      buf[i + 3] = 255
    }
  }
  return encodePNG(w, h, buf)
}

/* ---------------- 输出 ---------------- */
const ROOT = path.resolve(__dirname, '..')
const ICON_DIR = path.join(ROOT, 'miniprogram', 'assets', 'icons')
const IMG_DIR = path.join(ROOT, 'miniprogram', 'assets', 'images')
fs.mkdirSync(ICON_DIR, { recursive: true })
fs.mkdirSync(IMG_DIR, { recursive: true })

const COLORS = { dark: '#15171A', gray: '#8C929B', green: '#2B7A4B', white: '#FFFFFF' }
let count = 0
for (const name of Object.keys(ICONS)) {
  const mask = renderMask(ICONS[name])
  for (const ck of Object.keys(COLORS)) {
    fs.writeFileSync(path.join(ICON_DIR, `${name}-${ck}.png`), maskToPNG(mask, COLORS[ck]))
    count++
  }
}
console.log(`图标已生成：${count} 个 → miniprogram/assets/icons/`)

const PALETTES = [
  hx('#D8E0E8'), hx('#DCE3EA'), hx('#D5DEE6'), hx('#DCE6E0'),
  hx('#E0DAE6'), hx('#D9E2EC'), hx('#DEE4EC'), hx('#D6E4DE')
]
const IMG_W = 480
for (let i = 1; i <= 8; i++) {
  fs.writeFileSync(path.join(IMG_DIR, `eq-${i}.png`), renderPhoto(IMG_W, IMG_W, i * 37, PALETTES[i - 1]))
  console.log(`占位图：eq-${i}.png`)
}

/* 自检用图标拼版（不进入小程序包） */
if (process.argv.includes('--sheet')) {
  const names = Object.keys(ICONS)
  const cols = 6
  const cell = S
  const rows = Math.ceil(names.length / cols)
  const W = cols * cell, H = rows * cell
  const buf = Buffer.alloc(W * H * 4, 255)
  names.forEach((nm, idx) => {
    const mask = renderMask(ICONS[nm])
    const cx = (idx % cols) * cell, cy = Math.floor(idx / cols) * cell
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const a = mask[y * S + x] / 255
        const i = ((cy + y) * W + cx + x) * 4
        buf[i] = clamp(21 * a + 245 * (1 - a))
        buf[i + 1] = clamp(23 * a + 247 * (1 - a))
        buf[i + 2] = clamp(26 * a + 250 * (1 - a))
        buf[i + 3] = 255
      }
    }
  })
  const out = path.join(ROOT, '_iconsheet.png')
  fs.writeFileSync(out, encodePNG(W, H, buf))
  console.log('图标拼版：_iconsheet.png 顺序 =', names.join(', '))
}
