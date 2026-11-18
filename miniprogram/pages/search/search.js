const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { getNavInfo } = require('../../utils/nav')

const HISTORY_KEY = 'searchHistory'

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    keyword: '',
    history: [],
    hot: mock.HOT_WORDS,
    rank: mock.RANK,
    list: [],
    searched: false,
    loading: false
  },

  onLoad (options) {
    let history = []
    try {
      history = wx.getStorageSync(HISTORY_KEY) || []
    } catch (e) {}
    this.setData({
      nav: getNavInfo(),
      history,
      keyword: (options && options.keyword) || ''
    })
  },

  onInput (e) {
    this.setData({ keyword: e.detail.value, searched: false })
  },

  onClear () {
    this.setData({ keyword: '', searched: false, list: [] })
  },

  /** 执行搜索 */
  doSearch (kw) {
    const keyword = (kw === undefined ? this.data.keyword : kw).trim()
    if (!keyword) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }
    this.setData({ keyword, loading: true, searched: true })

    // 记录历史
    let history = this.data.history.filter(h => h !== keyword)
    history.unshift(keyword)
    history = history.slice(0, 10)
    try { wx.setStorageSync(HISTORY_KEY, history) } catch (e) {}

    api
      .getDeviceList({ keyword, pageSize: 20 })
      .then(res => {
        this.setData({ list: res.list, history, loading: false })
      })
      .catch(err => {
        this.setData({ loading: false })
        wx.showToast({ title: err.message || '搜索失败', icon: 'none' })
      })
  },

  onSearchTap () {
    this.doSearch()
  },

  onBack () {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 })
    } else {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  onHotTap (e) {
    this.doSearch(e.currentTarget.dataset.kw)
  },

  onHistoryTap (e) {
    this.doSearch(e.currentTarget.dataset.kw)
  },

  onClearHistory () {
    wx.showModal({
      title: '清空搜索历史',
      content: '确定清空全部搜索记录吗？',
      success: res => {
        if (res.confirm) {
          try { wx.removeStorageSync(HISTORY_KEY) } catch (e) {}
          this.setData({ history: [] })
        }
      }
    })
  }
})
