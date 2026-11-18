Component({
  properties: {
    item: { type: Object, value: {} },
    // water: 瀑布流卡片  row: 列表大卡
    mode: { type: String, value: 'water' },
    // 瀑布流图片高度（rpx），由列表数据给出，实现错落效果
    imgH: { type: Number, value: 320 }
  },

  methods: {
    onTap () {
      const id = this.data.item && this.data.item.id
      if (!id) return
      wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
    },

    onConsult (e) {
      const item = this.data.item || {}
      wx.showActionSheet({
        itemList: ['致电卖家（演示）', '在线咨询（演示）'],
        success: res => {
          if (res.tapIndex === 0) {
            wx.showModal({
              title: item.seller ? item.seller.name : '联系卖家',
              content: '演示环境不会真的拨号。正式版本这里会调用 wx.makePhoneCall 或跳转客服会话。',
              showCancel: false,
              confirmText: '知道了'
            })
          } else {
            wx.showToast({ title: '客服会话开发中', icon: 'none' })
          }
        }
      })
    }
  }
})
