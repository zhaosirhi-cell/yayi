const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { getNavInfo } = require('../../utils/nav')

const PAGE_SIZE = 8

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    title: '二手设备',
    cats: mock.CATEGORIES,
    activeCat: 0,
    sorts: [
      { key: 'default', name: '综合' },
      { key: 'new', name: '最新' },
      { key: 'priceAsc', name: '价格' },
      { key: 'distance', name: '距离' }
    ],
    sortKey: 'default',
    priceDesc: false,
    keyword: '',
    list: [],
    total: 0,
    page: 1,
    hasMore: true,
    loading: false
  },

  onLoad (options) {
    const catId = options && options.cat ? Number(options.cat) : 0
    const cat = mock.CATEGORIES.find(c => c.id === catId)
    this.setData({
      nav: getNavInfo(),
      activeCat: catId,
      title: cat && catId ? cat.name : '二手设备',
      keyword: (options && options.keyword) || ''
    })
    this.reload()
  },

  onReachBottom () {
    if (!this.data.hasMore || this.data.loading) return
    this.setData({ page: this.data.page + 1 })
    this.fetch(true)
  },

  onPullDownRefresh () {
    this.reload().then(() => wx.stopPullDownRefresh())
  },

  reload () {
    this.setData({ page: 1, list: [], hasMore: true })
    return this.fetch(false)
  },

  sortValue () {
    const d = this.data
    if (d.sortKey === 'priceAsc') return d.priceDesc ? 'priceDesc' : 'priceAsc'
    return d.sortKey
  },

  fetch (append) {
    if (this.data.loading) return Promise.resolve()
    this.setData({ loading: true })
    const d = this.data
    return api
      .getDeviceList({
        categoryId: d.activeCat,
        sort: this.sortValue(),
        keyword: d.keyword,
        city: getApp().globalData.city,
        page: d.page,
        pageSize: PAGE_SIZE
      })
      .then(res => {
        this.setData({
          list: append ? d.list.concat(res.list) : res.list,
          total: res.total,
          hasMore: res.hasMore,
          loading: false
        })
      })
      .catch(err => {
        this.setData({ loading: false })
        wx.showToast({ title: err.message || '加载失败', icon: 'none' })
      })
  },

  onCatTap (e) {
    const id = Number(e.currentTarget.dataset.id)
    if (id === this.data.activeCat) return
    const cat = mock.CATEGORIES.find(c => c.id === id)
    this.setData({
      activeCat: id,
      title: id ? cat.name : '二手设备'
    })
    this.reload()
  },

  onSortTap (e) {
    const key = e.currentTarget.dataset.key
    if (key === 'priceAsc' && this.data.sortKey === 'priceAsc') {
      this.setData({ priceDesc: !this.data.priceDesc })
    } else {
      this.setData({ sortKey: key, priceDesc: false })
    }
    this.reload()
  },

  goSearch () {
    wx.navigateTo({ url: '/pages/search/search' })
  }
})
