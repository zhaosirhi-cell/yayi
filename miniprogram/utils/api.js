/**
 * 数据接口层
 *  - config.useMock = true  → 走 utils/mock.js 本地数据（可直接跑）
 *  - config.useMock = false → 走真实 HTTP 接口
 * 页面里只调用这里的方法，后续替换后端不需要改页面
 */
const config = require('./config')
const mock = require('./mock')

/* ------------------ 基础 ------------------ */
function request (path, data, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.baseUrl + path,
      data: data || {},
      method,
      timeout: 15000,
      header: {
        'content-type': 'application/json',
        Authorization: wx.getStorageSync('token') ? 'Bearer ' + wx.getStorageSync('token') : ''
      },
      success (res) {
        const body = res.data || {}
        if (res.statusCode === 200 && (body.code === 0 || body.code === 200)) {
          resolve(body.data)
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          reject(new Error('登录已失效，请重新登录'))
        } else {
          reject(new Error(body.message || '网络异常，请稍后重试'))
        }
      },
      fail () {
        reject(new Error('网络异常，请检查网络后重试'))
      }
    })
  })
}

function delay (data, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms || 180)
  })
}

/* ------------------ mock 实现 ------------------ */
function priceOf (d) {
  return d.price == null ? Number.MAX_SAFE_INTEGER : d.price
}

function applySort (list, sort) {
  const arr = list.slice()
  switch (sort) {
    case 'priceAsc':
      return arr.sort((a, b) => priceOf(a) - priceOf(b))
    case 'priceDesc':
      return arr.sort((a, b) => (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price))
    case 'distance':
      return arr.sort((a, b) => a.distanceKm - b.distanceKm)
    case 'new':
      return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    default:
      return arr
  }
}

function filterDevices (params) {
  const p = params || {}
  let list = mock.DEVICES.slice()
  if (p.pickOnly) list = list.filter(d => d.isPick)
  if (p.categoryId) list = list.filter(d => d.categoryId === p.categoryId)
  if (p.city && p.city !== '全国') list = list.filter(d => d.city === p.city)
  if (p.brand && p.brand !== '全部品牌') list = list.filter(d => d.brand === p.brand)
  if (p.yearIndex) {
    const map = {
      1: d => d.year >= 2023,
      2: d => d.year >= 2021 && d.year <= 2022,
      3: d => d.year >= 2019 && d.year <= 2020,
      4: d => d.year < 2019
    }
    if (map[p.yearIndex]) list = list.filter(map[p.yearIndex])
  }
  if (p.priceIndex) {
    const map = {
      1: d => d.price != null && d.price < 100000,
      2: d => d.price != null && d.price >= 100000 && d.price < 300000,
      3: d => d.price != null && d.price >= 300000 && d.price < 600000,
      4: d => d.price != null && d.price >= 600000
    }
    if (map[p.priceIndex]) list = list.filter(map[p.priceIndex])
  }
  if (p.keyword) {
    const k = String(p.keyword).toLowerCase().trim()
    if (k) {
      list = list.filter(d =>
        (d.title + d.brand + d.model + d.categoryName).toLowerCase().indexOf(k) > -1
      )
    }
  }
  return applySort(list, p.sort)
}

function paginate (list, page, pageSize) {
  const p = page || 1
  const size = pageSize || 10
  return {
    list: list.slice((p - 1) * size, p * size),
    total: list.length,
    hasMore: p * size < list.length
  }
}

/* ------------------ 对外接口 ------------------ */
const api = {
  /** 首页设备流 */
  getHomeList (params) {
    if (!config.useMock) return request('/api/devices/home', params)
    const list = filterDevices(params)
    return delay(paginate(list, (params && params.page) || 1, 20))
  },

  /** 再美甄选列表 */
  getPickList (params) {
    if (!config.useMock) return request('/api/devices/pick', params)
    const p = Object.assign({}, params, { pickOnly: true })
    return delay(paginate(filterDevices(p), (p && p.page) || 1, 20))
  },

  /** 通用设备列表（分类页 / 搜索页） */
  getDeviceList (params) {
    if (!config.useMock) return request('/api/devices', params)
    const p = params || {}
    return delay(paginate(filterDevices(p), p.page || 1, p.pageSize || 10))
  },

  /** 设备详情 */
  getDeviceDetail (id) {
    if (!config.useMock) return request('/api/devices/' + id)
    const item = mock.DEVICES.find(d => d.id === id) || mock.DEVICES[0]
    const related = mock.DEVICES.filter(d => d.id !== item.id && d.categoryId === item.categoryId).slice(0, 2)
    return delay({ detail: item, related })
  },

  /** 资讯列表 */
  getNewsList (tab) {
    if (!config.useMock) return request('/api/news', { tab })
    const list = !tab || tab === 'all' ? mock.NEWS : mock.NEWS.filter(n => n.tab === tab)
    return delay(list)
  },

  /** 发布设备 */
  submitDevice (payload) {
    if (!config.useMock) return request('/api/devices', payload, 'POST')
    return delay({ id: 'EQ' + Date.now(), status: 'auditing' }, 400)
  },

  /** 收藏 / 取消收藏 */
  toggleFavorite (id, on) {
    if (!config.useMock) return request('/api/favorites', { id, on }, 'POST')
    return delay({ id, favorite: !!on })
  }
}

module.exports = api
