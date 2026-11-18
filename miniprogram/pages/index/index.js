const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { getNavInfo } = require('../../utils/nav')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    cities: [],
    cityIndex: 0,
    city: '全国',
    cats: mock.HOME_CATS,
    sorts: [
      { key: 'new', name: '最新发布' },
      { key: 'hot', name: '热门设备' },
      { key: 'distance', name: '距离最近' }
    ],
    sortIndex: 0,
    colA: [],
    colB: [],
    loading: true,
    notice: '平台已完成 1,286 台设备核验 · 今日新上架 37 台'
  },

  onLoad () {
    const cities = getApp().getCities()
    this.setData({
      nav: getNavInfo(),
      cities,
      city: getApp().globalData.city,
      cityIndex: Math.max(0, cities.indexOf(getApp().globalData.city))
    })
    this.load()
  },

  onShow () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    const city = getApp().globalData.city
    if (city !== this.data.city) {
      const cities = this.data.cities
      this.setData({ city, cityIndex: Math.max(0, cities.indexOf(city)) })
      this.load()
    }
  },

  onPullDownRefresh () {
    this.load().then(() => wx.stopPullDownRefresh())
  },

  load () {
    this.setData({ loading: true })
    const sort = this.data.sorts[this.data.sortIndex].key
    return api
      .getHomeList({ sort, city: this.data.city, page: 1 })
      .then(res => {
        const cols = this.splitColumns(res.list)
        this.setData({
          colA: cols.colA,
          colB: cols.colB,
          loading: false
        })
      })
      .catch(err => {
        this.setData({ loading: false })
        wx.showToast({ title: err.message || '加载失败', icon: 'none' })
      })
  },

  /** 两列瀑布流：按累计高度分配，避免明显高低差 */
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

  onCityChange (e) {
    const index = Number(e.detail.value)
    const city = this.data.cities[index]
    getApp().setCity(city)
    this.setData({ city, cityIndex: index })
    this.load()
  },

  onSortTap (e) {
    const index = Number(e.currentTarget.dataset.index)
    if (index === this.data.sortIndex) return
    this.setData({ sortIndex: index })
    this.load()
  },

  onCatTap (e) {
    const url = e.currentTarget.dataset.url
    const isTab = url.indexOf('/pages/pick/pick') === 0
    if (isTab) {
      wx.switchTab({ url: '/pages/pick/pick' })
    } else {
      wx.navigateTo({ url })
    }
  },

  goSearch () {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  goPick () {
    wx.switchTab({ url: '/pages/pick/pick' })
  },

  goList () {
    wx.navigateTo({ url: '/pages/list/list' })
  },

  onConsult () {
    wx.showModal({
      title: '在线咨询',
      content: '演示环境：正式版本这里会唤起微信客服会话（客服消息 / 企业微信）。',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
