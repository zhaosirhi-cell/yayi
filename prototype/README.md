# 再美二手光电 · 小程序原型

二手医美设备挂网 / 交易撮合平台的高保真原型。所有页面按小程序规范设计，可直接对照写成 WXML + WXSS。

## 怎么看

- 双击打开 **`index.html`** —— 总览看板，8 个页面缩略 + 设计令牌 + 小程序映射表
- 或单独打开 `pages/xxx.html`，页面会以 375 × 812 的手机外框居中显示
- 页面之间是可点的（首页 → 分类/详情/搜索，tabBar 互通，中间凸起按钮进发布页）

## 目录

```
prototype/
├── index.html              总览看板（先看这个）
├── assets/
│   ├── css/base.css        设计令牌 + 公共组件样式（tabBar / 卡片 / 宫格 / chips）
│   └── js/common.js        图标 sprite + 自定义 tabBar / 胶囊按钮注入
└── pages/
    ├── home.html           01 首页        （tab）
    ├── pick.html           02 再美甄选    （tab）
    ├── list.html           03 设备列表    （二级）
    ├── detail.html         04 设备详情    （二级）
    ├── publish.html        05 我要卖机    （二级 / tabBar 中间按钮）
    ├── search.html         06 搜索        （二级）
    ├── news.html           07 资讯        （tab）
    └── mine.html           08 我的        （tab）
```

---

## 一、尺寸基准

| 项 | 原型（px） | 小程序（rpx） |
| --- | --- | --- |
| 屏幕宽 | 375 | 750 |
| 顶部状态栏 | 44 | 88 |
| 自定义导航条 | 44 | 88 |
| tabBar 高 | 74（+ 底部安全区） | 148 + `env(safe-area-inset-bottom)` |
| 页面左右留白 | 14 | 28 |
| 卡片间距 | 10 | 20 |
| 区块间距 | 12 | 24 |
| 卡片圆角 | 12 | 24 |
| 宫格 / 大卡圆角 | 18 | 36 |
| 中间凸起按钮 | 56，上浮 17 | 112，上浮 34 |

> 换算规则：**1px = 2rpx**。写 WXSS 时把原型里所有 px × 2 即可，字号保持双数。

## 二、字号

| 用途 | 原型 | 小程序 |
| --- | --- | --- |
| 价格 | 24 / 800 | 48rpx / bold |
| 页面大标题（Banner） | 26 | 52rpx |
| 区块标题 | 16 | 32rpx |
| 卡片标题 | 15 | 30rpx（列表卡 13 → 26rpx） |
| 正文 | 13 ~ 13.5 | 26rpx |
| 辅助信息 | 11.5 ~ 12 | 23rpx |
| 标签 / 角标 | 10 | 20rpx |

## 三、颜色令牌

```css
/* 品牌 */
--green-700: #2B7A4B;  /* 主绿：文字、图标、选中 */
--green-600: #3FA362;
--green-500: #6DC077;
--green-400: #9ED486;
--green-300: #C6E4A2;
--green-200: #DFF0C4;  /* chips 选中底 */
--green-100: #EFF7DC;  /* 提示条底 */
--green-50:  #F5FAE8;

/* 头部渐变（沉浸式） */
background: linear-gradient(160deg, #F2F8DC 0%, #D5EBAE 32%, #9FD58B 66%, #58BE85 100%);
/* 主按钮 */
background: linear-gradient(120deg, #A8DA8A, #4FB877);

/* 文字 */
--ink:   #15171A;   /* 主文字 */
--ink-2: #3B4048;
--ink-3: #6C727B;   /* 次文字 */
--gray:  #8C929B;   /* 辅助 */
--gray-2:#B7BCC4;   /* 占位 */
/* 其他 */
--bg:    #F6F7F9;   /* 页面底 */
--line:  #EFF1F4;   /* 分割线 */
--price: #F2555A;   /* 价格红 */
```

六宫格功能色（左上 → 右下）：

| 入口 | 渐变 |
| --- | --- |
| 二手设备 | `linear-gradient(140deg,#FFB0B8,#F0579A)` |
| 机构转让 | `linear-gradient(140deg,#9FA0FF,#6667F0)` |
| 维修保养 | `linear-gradient(140deg,#7BE9D2,#2CCFB2)` |
| 再美甄选 | `linear-gradient(140deg,#9FB0FF,#6E63F0)` |
| 我要卖机 | `linear-gradient(140deg,#FFC46B,#FF7E5F)` |
| 免费估价 | `linear-gradient(140deg,#FFA3D5,#FF6AA8)` |

---

## 四、照搬成小程序

### 1. 目录建议

```
miniprogram/
├── app.js / app.json / app.wxss
├── custom-tab-bar/          自定义 tabBar（中间凸起按钮）
├── components/
│   ├── nav-bar/             自定义导航条（状态栏 + 标题 + 胶囊占位）
│   ├── search-bar/          全国 + 药丸搜索框
│   ├── cat-grid/            六宫格
│   ├── filter-chips/        排序 / 筛选 chips
│   ├── goods-card/          瀑布流卡片（size: big / small）
│   ├── goods-row/           列表大卡
│   └── empty/               空状态
├── pages/
│   ├── index/    pick/    news/    mine/          ← tab 页
│   └── list/     detail/  publish/ search/        ← 二级页
└── styles/
    └── tokens.wxss         上面那套颜色 / 圆角 / 字号变量
```

### 2. app.json

```json
{
  "pages": [
    "pages/index/index",
    "pages/pick/pick",
    "pages/news/news",
    "pages/mine/mine",
    "pages/list/list",
    "pages/detail/detail",
    "pages/publish/publish",
    "pages/search/search"
  ],
  "window": {
    "navigationStyle": "custom",
    "backgroundColor": "#F6F7F9",
    "backgroundTextStyle": "dark"
  },
  "tabBar": {
    "custom": true,
    "color": "#7E858F",
    "selectedColor": "#2B7A4B",
    "backgroundColor": "#FFFFFF",
    "list": [
      { "pagePath": "pages/index/index",  "text": "首页" },
      { "pagePath": "pages/pick/pick",    "text": "甄选" },
      { "pagePath": "pages/publish/publish", "text": "发布" },
      { "pagePath": "pages/news/news",    "text": "资讯" },
      { "pagePath": "pages/mine/mine",    "text": "我的" }
    ]
  },
  "requiredPrivateInfos": ["getLocation", "chooseLocation"],
  "sitemapLocation": "sitemap.json"
}
```

### 3. 三个关键实现点

**① 沉浸式自定义导航**
`navigationStyle: custom` 后，所有页面顶部要自己留出 `状态栏高度 + 44px 导航条`：

```js
const info = wx.getWindowInfo()
const menu = wx.getMenuButtonBoundingClientRect()
// 导航条可用高度 = (menu.top - info.statusBarHeight) * 2 + menu.height
```

标题居中，右侧 **必须** 避开胶囊按钮区域（原型里的胶囊就是占位示意），左侧返回按钮只在二级页出现。

**② 自定义 tabBar（中间凸起“转设备”）**
- `custom-tab-bar/index` 里写结构，中间按钮绝对定位 `top: -34rpx`，白色外环用 `box-shadow: 0 0 0 8rpx #fff`
- 每个 tab 页 `onShow` 里同步选中态：
  ```js
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  }
  ```
- 中间按钮点击 `wx.switchTab` 做不到（发布页不是 tab 页），用 `wx.navigateTo`，并在 `app.json` 里把 publish 放在普通页面列表中

**③ 瀑布流**
两列用 `grid` 或左右两个 `view` 分别 push（按图片高度归列），图片统一 `mode="aspectFill"` + 固定宽度，高度由接口返回比例决定。

### 4. 组件与页面映射

| 原型 | 小程序页面 | 组件 |
| --- | --- | --- |
| home.html | `pages/index/index` | search-bar、banner、cat-grid、filter-chips、goods-card×n、custom-tab-bar |
| pick.html | `pages/pick/pick` | search-bar、hero-banner、filter-chips（品牌/价格/年份 picker）、goods-card（甄选角标） |
| list.html | `pages/list/list` | nav-bar、sort-bar、category-chips、goods-row、上拉加载 |
| detail.html | `pages/detail/detail` | swiper 主图、price-block、spec-table、seller-card、action-bar（收藏/客服/电话/立即咨询） |
| publish.html | `pages/publish/publish` | steps、image-uploader（`wx.chooseMedia`）、form-row（input/picker）、submit-bar |
| search.html | `pages/search/search` | search-bar（auto-focus）、history/hot tags、rank-list |
| news.html | `pages/news/news` | segment-tabs、article-card |
| mine.html | `pages/mine/mine` | profile-header、quick-card、trade-entry、func-grid |

---

## 五、接口数据结构（建议先定，前端才好写）

```js
// 设备
{
  id: 'EQ10086',
  title: '科医人 M22 超光子 王者之心 2022 款',
  cover: '',                     // 首图
  images: [],                    // 最多 9 张
  categoryId: 1, categoryName: '激光设备',
  brand: 'Lumenis 科医人', model: 'M22',
  condition: '9成新',            // 7成新 / 8成新 / 9成新 / 9.9新
  year: 2022,
  price: 580000,                 // 单位：元；null 表示面议
  negotiable: true,
  city: '上海', district: '浦东新区',
  isPick: true,                  // 再美甄选
  tags: ['平台核验', '可开发票', '支持验机'],
  seller: { id, name, verified, listingCount, goodRate },
  viewCount: 2318,
  status: 'on',                  // on / off / sold / auditing
  createdAt: '2024-05-12 10:00:00'
}

// 列表入参
{ keyword, categoryId, brandId, city, condition, year,
  sort: 'default|new|priceAsc|priceDesc|distance', page, pageSize: 10 }
```

**分类（六宫格 → 列表页 tab）**：激光设备 / 射频设备 / 注射类 / 塑形减脂 / 检测设备 / 维修保养
**成色枚举**：7成新、8成新、9成新、9.9成新
**排序**：综合、最新、价格升降、距离最近（需要定位授权）

---

## 六、审核与合规提醒（比较关键）

- **类目**：二手医疗器械交易偏“医疗器械经营”，小程序类目建议选「医疗-医疗器械经营」或「商业服务-二手设备回收/交易」，并按后台要求上传 **营业执照**、**医疗器械经营许可证**（二类备案 / 三类许可），否则容易被驳回。
- **页面必须体现**：主体资质、免责说明（“平台仅提供信息展示，交易双方自行核验设备资质与合规性”）、联系方式与投诉入口。
- **医疗功效词**：设备介绍里避免“治疗”“疗效”“包好”等表述，改成“设备参数 / 适用项目范围”，减少审核风险。
- **隐私**：采集手机号要做 `getPhoneNumber` + 隐私协议弹窗；定位只用于“距离最近”，需在 `requiredPrivateInfos` 声明。

---

## 七、下一步可以加的原型

机构转让列表、维修保养服务详情、免费估价流程（3 步表单 + 结果页）、消息/在线咨询 IM、订单与合同、卖家中心（我的发布 / 我卖出的）。
