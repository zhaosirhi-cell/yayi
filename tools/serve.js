/**
 * 极简静态服务器（只为在浏览器里打开演示页，零依赖）
 *   node tools/serve.js          → http://127.0.0.1:8181/demo/index.html
 *   PORT=9000 node tools/serve.js
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const PORT = Number(process.env.PORT || 8181)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
}

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p === '/' || p === '') p = '/demo/index.html'
  const file = path.join(ROOT, p)
  if (file.indexOf(ROOT) !== 0) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    return res.end('403')
  }
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      return res.end('404 Not Found: ' + p)
    }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache'
    })
    res.end(buf)
  })
}).listen(PORT, '127.0.0.1', () => {
  console.log('演示地址：http://127.0.0.1:' + PORT + '/demo/index.html')
  console.log('目录根：' + ROOT)
})
