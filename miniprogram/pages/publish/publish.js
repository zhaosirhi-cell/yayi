const api = require('../../utils/api')
const mock = require('../../utils/mock')
const { getNavInfo } = require('../../utils/nav')

const YEARS = []
for (let y = 2024; y >= 2010; y--) YEARS.push(y + ' 年')

Page({
  data: {
    nav: { statusBarHeight: 20, navBarHeight: 44 },
    isEstimate: false,
    pageTitle: '发布设备',
    images: [],
    categories: mock.CATEGORIES.filter(c => c.id > 0),
    brands: mock.BRANDS.filter(b => b !== '全部品牌'),
    conditions: mock.CONDITIONS,
    years: YEARS,
    cities: mock.CITIES.filter(c => c !== '全国'),
    form: {
      title: '',
      categoryIndex: 0,
      brandIndex: 0,
      model: '',
      conditionIndex: 2,
      yearIndex: 2,
      price: '',
      cityIndex: 0,
      contact: '',
      phone: ''
    },
    submitting: false
  },

  onLoad (options) {
    const isEstimate = !!(options && options.from === 'estimate')
    this.setData({
      nav: getNavInfo(),
      isEstimate,
      pageTitle: isEstimate ? '免费估价' : '发布设备'
    })
  },

  onInput (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail.value })
  },

  onPicker (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: Number(e.detail.value) })
  },

  onChooseImage () {
    const left = 9 - this.data.images.length
    if (left <= 0) {
      wx.showToast({ title: '最多 9 张', icon: 'none' })
      return
    }
    wx.chooseMedia({
      count: left,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: res => {
        const paths = res.tempFiles.map(f => f.tempFilePath)
        this.setData({ images: this.data.images.concat(paths) })
      },
      fail: () => {}
    })
  },

  onDeleteImage (e) {
    const index = Number(e.currentTarget.dataset.index)
    const images = this.data.images.slice()
    images.splice(index, 1)
    this.setData({ images })
  },

  previewImage (e) {
    const index = Number(e.currentTarget.dataset.index)
    wx.previewImage({ current: this.data.images[index], urls: this.data.images })
  },

  validate () {
    const d = this.data
    const f = d.form
    if (!d.images.length) return '请至少上传 1 张设备图片'
    if (!f.title.trim()) return '请填写设备名称'
    if (!f.contact.trim()) return '请填写联系人'
    if (!/^1\d{10}$/.test(f.phone.trim())) return '请填写正确的手机号'
    if (!d.isEstimate && !String(f.price).trim()) return '请填写期望售价'
    return ''
  },

  onSubmit () {
    if (this.data.submitting) return
    const msg = this.validate()
    if (msg) {
      wx.showToast({ title: msg, icon: 'none' })
      return
    }
    const d = this.data
    const f = d.form
    const payload = {
      title: f.title.trim(),
      category: d.categories[f.categoryIndex].name,
      brand: d.brands[f.brandIndex],
      model: f.model.trim(),
      condition: d.conditions[f.conditionIndex],
      year: parseInt(d.years[f.yearIndex], 10),
      price: f.price ? Number(f.price) * 10000 : null,
      city: d.cities[f.cityIndex],
      contact: f.contact.trim(),
      phone: f.phone.trim(),
      images: d.images.length
    }

    this.setData({ submitting: true })
    api
      .submitDevice(payload)
      .then(() => {
        this.setData({ submitting: false })
        if (d.isEstimate) {
          const base = 12 + (payload.year - 2015) * 2
          wx.showModal({
            title: '估价完成（演示）',
            content: `参考区间：¥${base}–${base + 8} 万\n正式版本由平台根据品牌、型号、成色、年份与近期成交价给出区间。`,
            showCancel: false,
            confirmText: '知道了',
            success: () => wx.navigateBack({ delta: 1 })
          })
        } else {
          wx.showModal({
            title: '提交成功',
            content: '平台将在 1 个工作日内完成审核，通过后会展示在“最新发布”。',
            showCancel: false,
            confirmText: '好',
            success: () => wx.navigateBack({ delta: 1 })
          })
        }
      })
      .catch(err => {
        this.setData({ submitting: false })
        wx.showToast({ title: err.message || '提交失败', icon: 'none' })
      })
  },

  onSaveDraft () {
    wx.showToast({ title: '已存草稿（演示）', icon: 'none' })
  }
})
