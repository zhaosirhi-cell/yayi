# 再美二手光电 · 小程序（可运行 Demo）

二手医美设备挂网 / 交易撮合平台。**无需后端、无需 appid 即可编译运行**，数据在 `utils/mock.js`，接口层已隔离，接后端只改一个开关。

## 一、怎么跑起来

1. 打开 **微信开发者工具** → 导入项目 → 目录选这个 `miniprogram` 文件夹
2. AppID 选择：**测试号**（或直接使用项目自带的 `touristappid` 游客模式）
3. 编译即可看到首页；模拟器选 iPhone X 及以上（有安全区）

> 真机预览：点开发者工具右上「预览」扫码。图片用的是本地占位图，不涉及域名校验。

## 二、已实现的功能

| 页面 | 路径 | 功能 |
| --- | --- | --- |
| 首页 | `pages/index/index` | 城市切换（picker）、搜索入口、甄选 Banner、六宫格、排序（最新/热门/距离）、双列瀑布流、悬浮在线咨询、下拉刷新 |
| 再美甄选 | `pages/pick/pick` | 距离/品牌/价格/年份筛选、甄选角标、瀑布流 |
| 设备列表 | `pages/list/list` | 分类 chips 横向滚动、综合/最新/价格(升降序)/距离排序、上拉分页加载 |
| 设备详情 | `pages/detail/detail` | 主图轮播 + 大图预览、价格/标签、平台保障、参数表、卖家卡、描述、相似设备、收藏/致电/咨询、分享 |
| 我要卖机 | `pages/publish/publish` | 三步表单、`wx.chooseMedia` 多图上传（最多 9 张）、表单校验、提交、草稿；`?from=estimate` 为免费估价模式 |
| 搜索 | `pages/search/search` | 历史搜索（本地存储）、热门搜索、榜单、实时搜索结果 |
| 资讯 | `pages/news/news` | 全部/医美周报/公司新闻切换 |
| 我的 | `pages/mine/mine` | 弧形头图、授权登录（演示）、关注/浏览/帮助、我的交易、我的功能 |

公共能力：
- **自定义导航栏** `components/nav-bar`：按胶囊位置动态计算状态栏与导航高度
- **自定义 tabBar** `custom-tab-bar`：5 个位置，中间凸起「转设备」发布按钮（`navigateTo` 到发布页）
- **设备卡片** `components/goods-card`：`mode="water"` 瀑布流 / `mode="row"` 列表大卡
- **价格格式化** `wxs/format.wxs`：`58万 / 面议` 渲染在 WXML 层完成

## 三、目录结构

```
miniprogram/
├── app.js / app.json / app.wxss    全局配置与设计令牌
├── project.config.json             开发者工具工程配置（appid: touristappid）
├── sitemap.json
├── custom-tab-bar/                 自定义 tabBar（中间凸起发布按钮）
├── components/
│   ├── nav-bar/                    沉浸式自定义导航栏
│   └── goods-card/                 设备卡片（瀑布流 / 列表大卡）
├── pages/                          8 个页面，每页 js/json/wxml/wxss
├── utils/
│   ├── config.js                   ⚙️ useMock / baseUrl / 客服电话
│   ├── api.js                      接口层（mock 与真实请求同一套方法）
│   ├── mock.js                     演示数据：12 台设备、分类、品牌、资讯
│   ├── nav.js                      导航栏尺寸计算
│   └── format.js                   价格/副标题/拨号工具
├── wxs/format.wxs                  WXML 层格式化
└── assets/
    ├── icons/                      112 个图标（28 个图标 × 4 色）
    └── images/                     8 张设备占位图
```

资源体积：图标 65 KB + 占位图 160 KB，主包远低于 2 MB 限制。

## 四、接真实后端（改一个文件）

`utils/config.js`：

```js
module.exports = {
  useMock: false,                              // ← 改成 false
  baseUrl: 'https://你的域名/api',
  servicePhone: '400-800-1234'
}
```

约定返回结构（`utils/api.js` 已按此解析）：

```json
{ "code": 0, "message": "ok", "data": { } }
```

需要实现的接口（与 `api.js` 一一对应）：

| 方法 | 建议接口 | 入参 |
| --- | --- | --- |
| `getHomeList` | `GET /api/devices/home` | `city, sort(new/distance), page` |
| `getPickList` | `GET /api/devices/pick` | `city, brand, priceIndex, yearIndex, sort` |
| `getDeviceList` | `GET /api/devices` | `categoryId, keyword, sort, page, pageSize` |
| `getDeviceDetail` | `GET /api/devices/:id` | → `{ detail, related }` |
| `getNewsList` | `GET /api/news` | `tab(all/weekly/company)` |
| `submitDevice` | `POST /api/devices` | 表单字段 |
| `toggleFavorite` | `POST /api/favorites` | `id, on` |

设备字段（`utils/mock.js` 里就是完整示例）：
`id, title, cover, images[], brand, model, categoryId, categoryName, condition, year, price(元，null=面议), negotiable, city, district, isPick, tagText, tags[], h(瀑布流图高), distanceKm, seller{name,verified,count,rate}, viewCount, desc[], createdAt`

> 注意：`price` 单位是**元**，页面用 `wxs/format.wxs` 转「万」显示。接后端时请保持单位一致。

## 五、上线前 checklist

**必改**
- [ ] `project.config.json` 的 `appid` 换成自己的小程序 AppID
- [ ] `utils/config.js` 的 `baseUrl` 换成正式域名，并在小程序后台配置 request 合法域名（HTTPS）
- [ ] `assets/images/*` 换成真实设备图（建议 CDN + `?imageView2` 压缩），`mock.js` 的 `cover/images` 换成 URL
- [ ] 「我的」页登录改为 `wx.login` → 后端换 token；手机号用 `getPhoneNumber`（需企业主体）

**审核与合规（二手医疗器械交易类比较容易卡）**
- [ ] 类目：医疗器械经营 / 商业服务-二手设备，按后台要求上传营业执照 + 医疗器械经营许可证（二类备案或三类许可）
- [ ] 页面已带免责说明（详情页底部），建议再补《用户协议》《隐私政策》并接入 `wx.getPrivacySetting`
- [ ] 设备文案避免“治疗 / 疗效 / 包好”等医疗功效词，改成设备参数与适用项目
- [ ] 涉及定位（距离最近）要在 `app.json` 的 `requiredPrivateInfos` 声明，并先申请隐私授权
- [ ] 客服：`button open-type="contact"` 或企业微信客服，替换掉当前的演示弹窗

**体验优化（可选）**
- [ ] 瀑布流分页 + 骨架屏
- [ ] 图片 `lazy-load` 已开，可再加 CDN 缩略图
- [ ] 详情页加「同款比价 / 历史成交价」模块

## 六、自检脚本

```bash
node tools/check.js      # 静态检查 + 页面生命周期冒烟测试（零依赖）
node tools/gen-assets.js # 重新生成图标与占位图
```

`check.js` 会校验：页面文件齐全、JSON 可解析、组件声明正确、图标/图片引用存在、WXML 事件绑定的方法真实存在，并在 Node 里跑一遍所有页面的 `onLoad/onShow` 验证数据能正常加载。
