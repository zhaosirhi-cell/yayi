/**
 * 通过 GitHub API 推送整个工作区（本地 git 协议被墙时的备用方案）
 *   node tools/push-via-api.js [owner] [repo] [branch]
 * 依赖：本机 gh 已登录（用它取 token）
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const OWNER = process.argv[2] || 'zhaosirhi-cell'
const REPO = process.argv[3] || 'yayi'
const BRANCH = process.argv[4] || 'main'
const API = `https://api.github.com/repos/${OWNER}/${REPO}`
const ROOT = path.resolve(__dirname, '..')

const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim()
if (!TOKEN) { console.error('取不到 gh token'); process.exit(1) }

async function gh (p, opts = {}) {
  const res = await fetch(API + p, {
    method: opts.method || 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'yayi-push',
      ...(opts.headers || {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${opts.method || 'GET'} ${p} :: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : {}
}

function listFiles () {
  const out = execSync('git ls-files -z', { encoding: 'utf8', cwd: ROOT })
  return out.split('\0').map(s => s.trim()).filter(Boolean)
}

/* 递归创建 tree（Git Trees API 单层，需要自底向上拼） */
function groupByFirstSegment (items) {
  const dirs = {}
  const here = []
  for (const it of items) {
    const i = it.path.indexOf('/')
    if (i === -1) here.push(it)
    else {
      const d = it.path.slice(0, i)
      if (!dirs[d]) dirs[d] = []
      dirs[d].push({ path: it.path.slice(i + 1), sha: it.sha })
    }
  }
  return { dirs, here }
}

async function makeTree (items) {
  const { dirs, here } = groupByFirstSegment(items)
  const tree = here.map(f => ({ path: f.path, mode: '100644', type: 'blob', sha: f.sha }))
  for (const d of Object.keys(dirs)) {
    const sub = await makeTree(dirs[d])
    tree.push({ path: d, mode: '040000', type: 'tree', sha: sub })
  }
  const r = await gh('/git/trees', { method: 'POST', body: { tree } })
  return r.sha
}

;(async () => {
  const files = listFiles()
  console.log(`待上传文件：${files.length} 个`)

  // 1) 建 blob（并发 6）
  const blobs = {}
  let cursor = 0
  let done = 0
  async function worker (id) {
    while (cursor < files.length) {
      const f = files[cursor++]
      const abs = path.join(ROOT, f)
      const content = fs.readFileSync(abs).toString('base64')
      const r = await gh('/git/blobs', { method: 'POST', body: { content, encoding: 'base64' } })
      blobs[f] = r.sha
      done++
      if (done % 20 === 0 || done === files.length) console.log(`  blob ${done}/${files.length}`)
    }
  }
  await Promise.all([0, 1, 2, 3, 4, 5].map(worker))

  // 2) 建 tree
  console.log('生成 tree…')
  const treeSha = await makeTree(files.map(f => ({ path: f, sha: blobs[f] })))
  console.log('  tree: ' + treeSha)

  // 3) 建 commit（空仓库，无 parent）
  let parent = null
  try {
    const ref = await gh(`/git/ref/heads/${BRANCH}`)
    parent = ref.object.sha
  } catch (e) { /* 空仓库无 ref */ }

  console.log('生成 commit…')
  const commit = await gh('/git/commits', {
    method: 'POST',
    body: {
      message: '牙翼 · 二手牙科设备挂网 + 自主上架 + 维修服务平台演示（11 屏）',
      tree: treeSha,
      ...(parent ? { parents: [parent] } : {})
    }
  })
  console.log('  commit: ' + commit.sha)

  // 4) 指向分支
  if (parent) {
    await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: commit.sha, force: true } })
  } else {
    await gh('/git/refs', { method: 'POST', body: { ref: `refs/heads/${BRANCH}`, sha: commit.sha } })
  }
  console.log('✓ 已推送到 https://github.com/' + OWNER + '/' + REPO + '/tree/' + BRANCH)
})().catch(e => {
  console.error('失败：' + e.message)
  process.exit(1)
})
