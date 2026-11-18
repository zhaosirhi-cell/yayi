/**
 * 自定义导航栏尺寸计算（沉浸式，需要自己留出状态栏高度）
 */
let cache = null

function getNavInfo () {
  if (cache) return cache
  let statusBarHeight = 20
  let navBarHeight = 44
  try {
    const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    statusBarHeight = win.statusBarHeight || 20
  } catch (e) {}
  try {
    const menu = wx.getMenuButtonBoundingClientRect()
    if (menu && menu.top && menu.height) {
      // 胶囊上下留白对称，得到导航条真实高度
      navBarHeight = (menu.top - statusBarHeight) * 2 + menu.height
    }
  } catch (e) {}
  cache = {
    statusBarHeight,
    navBarHeight,
    totalHeight: statusBarHeight + navBarHeight,
    // 胶囊右侧占位宽度，右对齐元素需要避开
    capsuleWidth: 96
  }
  return cache
}

module.exports = { getNavInfo }
