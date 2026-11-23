/**
 * 打包「效果演示」单文件 H5
 *   node tools/build-demo.js
 *   输出：demo/index.html（自包含，双击即可打开，可直接发给别人）
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DEMO_DIR = path.join(ROOT, 'tools', 'demo')
const OUT_DIR = path.join(ROOT, 'demo')
const IMG_DIR = path.join(ROOT, 'miniprogram', 'assets', 'images')

const style = fs.readFileSync(path.join(DEMO_DIR, 'style.css'), 'utf8') + '\n' +
  fs.readFileSync(path.join(DEMO_DIR, 'style-pages.css'), 'utf8')
const configJs = fs.readFileSync(path.join(DEMO_DIR, 'config.js'), 'utf8')
const dbJs = fs.readFileSync(path.join(DEMO_DIR, 'db.js'), 'utf8')
const dataJs = fs.readFileSync(path.join(DEMO_DIR, 'data.js'), 'utf8')
const appJs = fs.readFileSync(path.join(DEMO_DIR, 'app.js'), 'utf8')

// 占位图内联成 base64，保证单文件可分发自包含
const imgs = {}
fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.png')).forEach(f => {
  imgs[path.basename(f, '.png')] = 'data:image/png;base64,' + fs.readFileSync(path.join(IMG_DIR, f)).toString('base64')
})

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2B7A4B">
<meta name="description" content="牙翼 · 二手牙科设备挂网 + 自主上架 + 维修服务">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="apple-touch-icon" href="./icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="牙翼">
<title>牙翼 · 二手牙科设备</title>
<style>
${style}
</style>
</head>
<body>
<div id="app"></div>
<script>
  // 注册 Service Worker（仅 https / localhost 生效，file:// 自动跳过）
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
</script>
<script>
/* 内联占位图（${Object.keys(imgs).length} 张） */
var IMG = ${JSON.stringify(imgs)};

/* 后端配置（填了才能云端共享） */
${configJs}
;
/* 数据层（Supabase REST） */
${dbJs}
;
/* 内容域数据包（牙科 / 旧医美） */
${dataJs}
;
/* 页面与交互 */
${appJs}
</script>
</body>
</html>
`

fs.mkdirSync(OUT_DIR, { recursive: true })
const outFile = path.join(OUT_DIR, 'index.html')
fs.writeFileSync(outFile, html)
console.log('已生成：demo/index.html   ' + (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB')
