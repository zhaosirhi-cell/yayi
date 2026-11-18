const { getNavInfo } = require('../../utils/nav')

Component({
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    // dark: 深色文字（浅底），light: 白色文字（深底/图片上）
    theme: { type: String, value: 'dark' }
  },

  data: {
    statusBarHeight: 20,
    navBarHeight: 44
  },

  lifetimes: {
    attached () {
      const n = getNavInfo()
      this.setData({
        statusBarHeight: n.statusBarHeight,
        navBarHeight: n.navBarHeight
      })
    }
  },

  methods: {
    onBack () {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 })
      } else {
        wx.switchTab({ url: '/pages/index/index' })
      }
    }
  }
})
