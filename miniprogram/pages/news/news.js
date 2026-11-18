const api = require('../../utils/api')
const { getNavInfo } = require('../../utils/nav')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    tabs: [
      { key: 'all', name: '全部' },
      { key: 'weekly', name: '医美周报' },
      { key: 'company', name: '公司新闻' }
    ],
    tab: 'all',
    list: [],
    loading: true
  },

  onLoad () {
    this.setData({ nav: getNavInfo() })
    this.load()
  },

  onShow () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  onPullDownRefresh () {
    this.load().then(() => wx.stopPullDownRefresh())
  },

  onTabTap (e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.tab) return
    this.setData({ tab })
    this.load()
  },

  load () {
    this.setData({ loading: true })
    return api
      .getNewsList(this.data.tab)
      .then(list => this.setData({ list, loading: false }))
      .catch(() => this.setData({ loading: false }))
  },

  onNewsTap () {
    wx.showModal({
      title: '资讯详情',
      content: '演示环境：正式版本这里会跳转资讯详情页（富文本 / webview）。',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})
