const mock = require('./utils/mock')

App({
  globalData: {
    city: '全国',
    userInfo: null,
    // 演示态：没有后端时全部走本地 mock，接入接口后把 useMock 改为 false 并配置 baseUrl
    useMock: true,
    baseUrl: 'https://api.zaimei.example.com'
  },

  onLaunch () {
    this.initUser()
  },

  /** 读取本地登录态（演示用，真实项目请走 wx.login + 后端换 token） */
  initUser () {
    try {
      const cached = wx.getStorageSync('userInfo')
      if (cached && cached.nickName) this.globalData.userInfo = cached
    } catch (e) {}
  },

  setUser (user) {
    this.globalData.userInfo = user
    try { wx.setStorageSync('userInfo', user) } catch (e) {}
  },

  /** 全局城市，首页与列表页共用 */
  setCity (city) {
    this.globalData.city = city
  },

  getCities () {
    return mock.CITIES
  }
})
