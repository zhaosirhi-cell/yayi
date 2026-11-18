const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { getNavInfo } = require('../../utils/nav')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    city: '全国',
    brands: mock.BRANDS,
    priceRanges: mock.PRICE_RANGES,
    years: mock.YEARS,
    brandIndex: 0,
    priceIndex: 0,
    yearIndex: 0,
    sortKey: 'distance',
    colA: [],
    colB: [],
    loading: true
  },

  onLoad () {
    this.setData({ nav: getNavInfo(), city: getApp().globalData.city })
    this.load()
  },

  onShow () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    const city = getApp().globalData.city
    if (city !== this.data.city) {
      this.setData({ city })
      this.load()
    }
  },

  onPullDownRefresh () {
    this.load().then(() => wx.stopPullDownRefresh())
  },

  load () {
    this.setData({ loading: true })
    const d = this.data
    return api
      .getPickList({
        city: d.city,
        brand: d.brands[d.brandIndex],
        priceIndex: d.priceIndex,
        yearIndex: d.yearIndex,
        sort: d.sortKey,
        page: 1
      })
      .then(res => {
        const cols = this.splitColumns(res.list)
        this.setData({ colA: cols.colA, colB: cols.colB, loading: false })
      })
      .catch(err => {
        this.setData({ loading: false })
        wx.showToast({ title: err.message || '加载失败', icon: 'none' })
      })
  },

  splitColumns (list) {
    const colA = []
    const colB = []
    let hA = 0
    let hB = 0
    list.forEach(item => {
      const h = (item.h || 320) + 150
      if (hA <= hB) {
        colA.push(item)
        hA += h
      } else {
        colB.push(item)
        hB += h
      }
    })
    return { colA, colB }
  },

  onBrandChange (e) {
    this.setData({ brandIndex: Number(e.detail.value) })
    this.load()
  },

  onPriceChange (e) {
    this.setData({ priceIndex: Number(e.detail.value) })
    this.load()
  },

  onYearChange (e) {
    this.setData({ yearIndex: Number(e.detail.value) })
    this.load()
  },

  onSortDistance () {
    this.setData({ sortKey: this.data.sortKey === 'distance' ? 'new' : 'distance' })
    this.load()
  },

  goSearch () {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  onConsult () {
    wx.showModal({
      title: '甄选顾问',
      content: '演示环境：正式版本这里会接入客服会话，帮你挑机、验机、谈价。',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
