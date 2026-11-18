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
<meta name="description" content="再美二手光电 · 二手医美设备挂网平台 效果演示">
<title>再美二手光电 · 效果演示</title>
<style>
${style}
</style>
</head>
<body>
<div id="app"></div>
<script>
/* 内联占位图（${Object.keys(imgs).length} 张） */
var IMG = ${JSON.stringify(imgs)};

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
