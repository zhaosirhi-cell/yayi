/**
 * 格式化工具
 */

/** 价格拆成「数值 + 单位」，null 视为面议 */
function priceParts (price) {
  if (price == null) return { num: '面议', unit: '' }
  if (price >= 10000) {
    const w = price / 10000
    const v = Math.round(w * 10) / 10
    return { num: String(v), unit: '万' }
  }
  return { num: String(price), unit: '元' }
}

/** 一整个价格文案 */
function priceText (price) {
  const p = priceParts(price)
  return p.num === '面议' ? '面议' : '¥' + p.num + p.unit
}

/** 列表副标题：设备分类 · 成色 · 年份 */
function subText (item) {
  return [item.categoryName, item.condition, item.year + ' 年'].filter(Boolean).join(' · ')
}

/** 电话拨打 */
function callPhone (phone) {
  wx.makePhoneCall({ phoneNumber: String(phone).replace(/[^\d-]/g, '') })
}

module.exports = { priceParts, priceText, subText, callPhone }
