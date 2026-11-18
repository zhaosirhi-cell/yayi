const { getNavInfo } = require('../../utils/nav')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    userInfo: null
  },

  onLoad () {
    this.setData({ nav: getNavInfo() })
  },

  onShow () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    this.setData({ userInfo: getApp().globalData.userInfo })
  },

  /**
   * 授权登录（演示版：直接写入本地用户）
   * 正式版：wx.login 拿 code → 后端换 openid/token → 引导手机号授权
   */
  onLogin () {
    if (this.data.userInfo) {
      wx.showActionSheet({
        itemList: ['退出登录'],
        success: () => {
          getApp().setUser(null)
          this.setData({ userInfo: null })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      })
      return
    }
    const user = {
      nickName: '再美用户',
      phone: '138****8888',
      verified: false
    }
    getApp().setUser(user)
    this.setData({ userInfo: user })
    wx.showToast({ title: '登录成功（演示）', icon: 'none' })
  },

  onTapTip (e) {
    const tip = e.currentTarget.dataset.tip || '功能'
    wx.showModal({
      title: tip,
      content: '演示环境：这个入口在正式版会跳转到对应页面。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  goPublish () {
    wx.navigateTo({ url: '/pages/publish/publish' })
  },

  goEstimate () {
    wx.navigateTo({ url: '/pages/publish/publish?from=estimate' })
  }
})
