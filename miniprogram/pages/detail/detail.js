const api = require('../../utils/api')
const config = require('../../utils/config')
const { getNavInfo } = require('../../utils/nav')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    detail: null,
    specs: [],
    related: [],
    current: 0,
    favorite: false,
    loading: true,
    servicePhone: config.servicePhone
  },

  onLoad (options) {
    this.id = (options && options.id) || 'EQ1001'
    this.setData({ nav: getNavInfo() })
    this.load()
  },

  load () {
    return api
      .getDeviceDetail(this.id)
      .then(res => {
        const d = res.detail
        this.setData({
          detail: d,
          related: res.related,
          specs: [
            { k: '品牌', v: d.brand },
            { k: '型号', v: d.model },
            { k: '设备分类', v: d.categoryName },
            { k: '出厂年份', v: d.year + ' 年' },
            { k: '成色', v: d.condition },
            { k: '使用情况', v: '正常使用' },
            { k: '配件', v: '齐全' },
            { k: '所在地', v: d.city + ' ' + d.district }
          ],
          loading: false
        })
        wx.setNavigationBarTitle && wx.setNavigationBarTitle({ title: d.title })
      })
      .catch(err => {
        this.setData({ loading: false })
        wx.showToast({ title: err.message || '加载失败', icon: 'none' })
      })
  },

  onSwiperChange (e) {
    this.setData({ current: e.detail.current })
  },

  onFav () {
    const on = !this.data.favorite
    this.setData({ favorite: on })
    api.toggleFavorite(this.id, on).catch(() => {})
    wx.showToast({ title: on ? '已收藏' : '已取消收藏', icon: 'none' })
  },

  onCall () {
    wx.makePhoneCall({
      phoneNumber: String(config.servicePhone).replace(/[^\d-]/g, ''),
      fail: () => {}
    })
  },

  onConsult () {
    wx.showModal({
      title: '立即咨询',
      content: '演示环境：正式版会直接唤起客服会话，并把当前设备信息带给客服。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  previewImage (e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({ current: url, urls: this.data.detail.images })
  },

  onShareAppMessage () {
    const d = this.data.detail
    return {
      title: d ? d.title : '再美二手光电',
      path: '/pages/detail/detail?id=' + this.id,
      imageUrl: d ? d.cover : ''
    }
  }
})
