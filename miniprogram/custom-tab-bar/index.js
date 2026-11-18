Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
      { pagePath: '/pages/pick/pick', text: '甄选', icon: 'star' },
      { pagePath: '/pages/news/news', text: '资讯', icon: 'news' },
      { pagePath: '/pages/mine/mine', text: '我的', icon: 'user' }
    ]
  },

  methods: {
    switchTab (e) {
      const { index, path } = e.currentTarget.dataset
      if (index === this.data.selected) return
      wx.switchTab({ url: path })
      this.setData({ selected: index })
    },

    // 中间凸起按钮：发布设备（不是 tab 页，用 navigateTo）
    onPublish () {
      wx.navigateTo({ url: '/pages/publish/publish' })
    }
  }
})
