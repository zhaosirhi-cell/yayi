/* ===== 牙翼 · 效果演示（单页 H5） ===== */
(function () {
  'use strict'

  var D = window.ZM_DATA
  var DOMAINS = D.DOMAINS

  /* ---------------- 图标 ---------------- */
  var ICONS = {
    home: '<path d="M3.4 10.3 12 3.6l8.6 6.7V20a.9.9 0 0 1-.9.9h-4.5v-6.2H9.3v6.2H4.3a.9.9 0 0 1-.9-.9z"/>',
    star: '<path d="M12 3.5l2.75 5.6 6.15.9-4.45 4.35 1.05 6.15L12 17.6l-5.5 2.9 1.05-6.15L3.1 10l6.15-.9z"/>',
    news: '<rect x="3.5" y="5" width="17" height="14" rx="3.4"/><path d="M7.5 9.4h5M7.5 12.6h9M7.5 15.8h6.2"/>',
    user: '<circle cx="12" cy="7.9" r="3.6"/><path d="M4.7 20.2c.9-3.5 3.8-5.5 7.3-5.5s6.4 2 7.3 5.5"/>',
    userFill: '<circle cx="12" cy="8.2" r="4.2" fill="currentColor" stroke="none"/><path d="M12 14.6c4 0 6.4 2.6 6.4 6.1v.3H5.6v-.3c0-3.5 2.4-6.1 6.4-6.1z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="10.9" cy="10.9" r="6.5"/><path d="M15.7 15.7 20.4 20.4"/>',
    caret: '<path d="M6.5 9.4h11l-5.5 6.4z" fill="currentColor" stroke="none"/>',
    shop: '<path d="M4 9.6h16l-1.1-4.3H5.1z"/><path d="M4.7 9.6v9.3a1.7 1.7 0 0 0 1.7 1.7h11.2a1.7 1.7 0 0 0 1.7-1.7V9.6"/><path d="M9.7 20.6v-5.2h4.6v5.2"/>',
    doclist: '<rect x="3.6" y="4.6" width="16.8" height="14.8" rx="3.2"/><path d="M7.6 9.4h8.8M7.6 12.6h8.8M7.6 15.8h5.2"/>',
    medbag: '<rect x="3.4" y="7.4" width="17.2" height="12.6" rx="3.2"/><path d="M8.9 7.4V5.9a2 2 0 0 1 2-2h2.2a2 2 0 0 1 2 2v1.5"/><path d="M12 11.2v4.8M9.6 13.6h4.8"/>',
    tag: '<path d="M4.2 11.4V5.6a1.5 1.5 0 0 1 1.5-1.5h5.8l8.3 8.3-7.3 7.3z"/><circle cx="8.4" cy="8.4" r="1.3"/>',
    money: '<circle cx="12" cy="12" r="8.3"/><path d="M9.1 8.5 12 11.9l2.9-3.4M12 11.9V17M9.7 13.5h4.6M9.7 15.3h4.6"/>',
    camera: '<path d="M3.6 9.2h3l1.6-2.3h7.6l1.6 2.3h3v9.9H3.6z"/><circle cx="12" cy="13.9" r="3.3"/>',
    shield: '<path d="M12 3.5 18.8 6v5.5c0 4.1-2.8 7.3-6.8 8.7-4-1.4-6.8-4.6-6.8-8.7V6z"/><path d="M8.9 12.1l2.2 2.2 4.1-4.4"/>',
    chat: '<path d="M4.2 6.4h15.6v9.2h-8.1l-4.3 3.5v-3.5H4.2z"/>',
    arrow: '<path d="M9.6 5.4 16.2 12l-6.6 6.6"/>',
    back: '<path d="M14.6 5 8 12l6.6 7"/>',
    plus: '<path d="M12 5.6v12.8M5.6 12h12.8"/>',
    close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"/>',
    filter: '<path d="M4 6.5h16M7 12h10M10 17.5h4"/>',
    gear: '<path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.8-1.3-2-3.4-2 .9a7.6 7.6 0 0 0-2.6-1.5L14.3 3h-4l-.3 2.2a7.6 7.6 0 0 0-2.6 1.5l-2-.9-2 3.4 1.8 1.3a7.7 7.7 0 0 0 0 3l-1.8 1.3 2 3.4 2-.9a7.6 7.6 0 0 0 2.6 1.5l.3 2.2h4l.3-2.2a7.6 7.6 0 0 0 2.6-1.5l2 .9 2-3.4z"/><circle cx="12" cy="12" r="2.9"/>',
    cart: '<circle cx="9.6" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M3 4.6h2.3l2.4 10.2h10.4l2.2-7.4H6.3"/>',
    bars: '<path d="M5.4 19.4V12M12 19.4V5.6M18.6 19.4v-4.2"/>',
    edit: '<path d="M13.4 3.6H7a2 2 0 0 0-2 2v12.9a2 2 0 0 0 2 2h10.1a2 2 0 0 0 2-2V9.2z"/><path d="M13.4 3.6v5.6h5.6"/><path d="M8.9 13.9h4.2M8.9 17h6"/>',
    clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 1.9"/>',
    check: '<path d="M5.4 12.4l4.4 4.4L18.6 7.6"/>',
    thumb: '<path d="M8.1 10.4 11.7 4c1.35 0 2.2.9 2 2.25l-.7 3.05h4.4c1.2 0 2.05.95 1.85 2.15l-1 5.5c-.2 1-1.05 1.6-2.05 1.6H8.1z"/><path d="M8.1 10.4H4.6v8.9h3.5z"/>',
    trash: '<path d="M4.6 7.2h14.8M9.4 7.2V4.8h5.2v2.4M6.6 7.2l.9 12.2a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12.2"/>',
    up: '<path d="M12 19V5M5.6 11.4 12 5l6.4 6.4"/>',
    down: '<path d="M12 5v14M5.6 12.6 12 19l6.4-6.4"/>',
    wrench: '<path d="M15.2 3.6a4.7 4.7 0 0 0-4.4 6.2l-6.4 6.4a1.9 1.9 0 0 0 0 2.7l.7.7a1.9 1.9 0 0 0 2.7 0l6.4-6.4a4.7 4.7 0 0 0 6.2-4.4c0-.7-.1-1.3-.4-1.9l-2.6 2.6-2.2-.6-.6-2.2 2.6-2.6c-.6-.2-1.2-.4-1.9-.4z"/>',
    pin: '<path d="M12 21s6.4-5.7 6.4-10.4A6.4 6.4 0 0 0 5.6 10.6C5.6 15.3 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>'
  }
  function icon (name, style) {
    return '<svg class="ic"' + (style ? ' style="' + style + '"' : '') + '><use href="#i-' + name + '"/></svg>'
  }

  /* ---------------- 状态 ---------------- */
  function loadJSON (k, def) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch (e) { return def }
  }
  function saveJSON (k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {}
  }

  var state = {
    domain: loadJSON('zm_domain', 'dental'),
    city: '全国',
    homeSort: 'new',
    pick: { sort: 'distance', brand: 0, price: 0, year: 0 },
    list: { cat: 0, sort: 'default', priceDesc: false, keyword: '' },
    listCount: 8,
    keyword: '',
    searched: false,
    history: loadJSON('zm_history', null) || ['CBCT', '牙科椅', '种植机'],
    favs: loadJSON('zm_favs', {}),
    user: loadJSON('zm_user', null),
    newsTab: 'all',
    form: null,
    editingId: null,
    myItems: loadJSON('zm_my_items', null),
    repair: {
      address: null, product: '', time: '', desc: '', images: []
    },
    orders: loadJSON('zm_orders', null),
    orderTab: 'all',
    orderKeyword: ''
  }
  if (!DOMAINS[state.domain]) state.domain = 'dental'

  /* 首次进入给三条示例商品，方便直接体验卖家中心 */
  if (!state.myItems) {
    var seed = [
      D.makeDevice({
        id: 'MY9001', domain: 'dental', categoryId: 1, categoryName: '牙科综合治疗台',
        title: '卡瓦 E80 牙科综合治疗台 单椅位 含安装',
        brand: 'KaVo 卡瓦', model: 'Estetica E80', condition: '9成新', year: 2022,
        useYears: '使用约 2 年', registerNo: '国械注进 20203061234',
        installIncluded: true, warranty: '原厂保修剩余 10 个月',
        price: 238000, city: '上海', district: '闵行区', tagText: '在售',
        tags: ['注册证有效', '含安装调试', '我的商品'],
        specs: [['椅位数', '1 台'], ['水电气', '单相电 + 0.5MPa'], ['使用年限', '约 2 年'], ['所在地', '上海 闵行']],
        seller: { name: '我的店铺（示例）', verified: true, count: 3, rate: '100%' },
        h: 164, distanceKm: 12, viewCount: 86,
        cover: IMG['eq-2'], images: [IMG['eq-2'], IMG['eq-6']]
      }),
      D.makeDevice({
        id: 'MY9002', domain: 'dental', categoryId: 2, categoryName: '影像设备',
        title: '怡友 Green X 全景机 自用转让',
        brand: 'Ewoo 怡友', model: 'Green X', condition: '8成新', year: 2020,
        useYears: '使用约 4 年', registerNo: '国械注进 20183061234',
        installIncluded: false, warranty: '已过保',
        price: null, city: '上海', district: '闵行区', tagText: '在售',
        tags: ['支持验机', '我的商品'],
        specs: [['类型', '全景 / 头颅'], ['使用年限', '约 4 年'], ['所在地', '上海 闵行']],
        seller: { name: '我的店铺（示例）', verified: true, count: 3, rate: '100%' },
        h: 152, distanceKm: 12, viewCount: 41,
        cover: IMG['eq-4'], images: [IMG['eq-4']]
      }),
      D.makeDevice({
        id: 'MY9003', domain: 'dental', categoryId: 5, categoryName: '器械耗材',
        title: '超声洁牙机 8 成新',
        brand: 'Woodpecker 啄木鸟', model: 'UDS-E', condition: '8成新', year: 2021,
        price: 2600, city: '上海', district: '闵行区', tagText: '在售',
        tags: ['我的商品'], specs: [['接口类型', '啄木鸟原厂']],
        seller: { name: '我的店铺（示例）', verified: true, count: 3, rate: '100%' },
        h: 146, distanceKm: 12, viewCount: 18,
        cover: IMG['eq-7'], images: [IMG['eq-7']]
      })
    ]
    seed[0].status = 'on'
    seed[1].status = 'auditing'
    seed[2].status = 'off'
    seed.forEach(function (it) { it.mine = true })
    state.myItems = seed
    saveJSON('zm_my_items', state.myItems)
  }

  var STATUS_TEXT = { on: '上架中', auditing: '待审核', off: '已下架', sold: '已售出', draft: '草稿' }

  if (!state.repair.address) state.repair.address = D.REPAIR.addressList[0]

  /* 首次进入给两条示例维修单，方便看列表与状态筛选 */
  if (!state.orders) {
    state.orders = [
      {
        id: 'WX' + '202409150001',
        status: 'pending',
        product: '牙科综合治疗台',
        address: D.REPAIR.addressList[0],
        time: '尽快联系我',
        desc: '椅位升降不动作，脚踏踩下无反应，怀疑是气路或电机问题。',
        images: [],
        createdAt: '2024-09-15 10:20'
      },
      {
        id: 'WX' + '202409020007',
        status: 'done',
        product: '灭菌器 / 消毒设备',
        address: D.REPAIR.addressList[1],
        time: '明天上午',
        desc: 'B 级灭菌器报 E03 故障码，无法完成干燥阶段。',
        images: [],
        createdAt: '2024-09-02 15:40'
      }
    ]
    saveJSON('zm_orders', state.orders)
  }

  function pack () { return DOMAINS[state.domain] }

  /** 商城内可见商品 = 我上架中的 + 平台已有的（同内容域） */
  function catalog () {
    var mine = state.myItems.filter(function (it) {
      return it.mine && it.domain === state.domain && it.status === 'on'
    })
    return mine.concat(pack().devices)
  }

  /* ---------------- 工具 ---------------- */
  function priceHTML (p) {
    if (p === null || p === undefined) return '<span class="price">面议</span>'
    if (p >= 10000) return '<span class="price">¥' + Math.round(p / 1000) / 10 + '<small>万</small></span>'
    return '<span class="price">¥' + p + '<small>元</small></span>'
  }
  function priceNum (p) {
    if (p === null || p === undefined) return '面议'
    return p >= 10000 ? '¥' + Math.round(p / 1000) / 10 + '万' : '¥' + p + '元'
  }
  function subText (d) {
    return [d.categoryName, d.condition, d.year ? d.year + '年' : ''].filter(Boolean).join(' · ')
  }

  function applySort (list, sort) {
    var arr = list.slice()
    var big = 1e15
    if (sort === 'priceAsc') return arr.sort(function (a, b) { return (a.price == null ? big : a.price) - (b.price == null ? big : b.price) })
    if (sort === 'priceDesc') return arr.sort(function (a, b) { return (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price) })
    if (sort === 'distance') return arr.sort(function (a, b) { return a.distanceKm - b.distanceKm })
    if (sort === 'new') return arr.sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1 })
    return arr
  }

  function filterDevices (opt) {
    opt = opt || {}
    var list = catalog()
    if (opt.pickOnly) list = list.filter(function (d) { return d.isPick })
    if (opt.categoryId) list = list.filter(function (d) { return d.categoryId === opt.categoryId })
    if (opt.city && opt.city !== '全国') list = list.filter(function (d) { return d.city === opt.city })
    if (opt.brand && opt.brand !== '全部品牌') list = list.filter(function (d) { return d.brand === opt.brand })
    if (opt.yearIndex) {
      var ym = {
        1: function (d) { return d.year >= 2023 },
        2: function (d) { return d.year >= 2021 && d.year <= 2022 },
        3: function (d) { return d.year >= 2019 && d.year <= 2020 },
        4: function (d) { return d.year && d.year < 2019 }
      }
      if (ym[opt.yearIndex]) list = list.filter(ym[opt.yearIndex])
    }
    if (opt.priceIndex) {
      var pm = {
        1: function (d) { return d.price != null && d.price < 10000 },
        2: function (d) { return d.price != null && d.price >= 10000 && d.price < 100000 },
        3: function (d) { return d.price != null && d.price >= 100000 && d.price < 500000 },
        4: function (d) { return d.price != null && d.price >= 500000 }
      }
      if (pm[opt.priceIndex]) list = list.filter(pm[opt.priceIndex])
    }
    if (opt.keyword) {
      var k = String(opt.keyword).toLowerCase().trim()
      if (k) {
        list = list.filter(function (d) {
          return (d.title + d.brand + d.model + d.categoryName).toLowerCase().indexOf(k) > -1
        })
      }
    }
    return applySort(list, opt.sort)
  }

  function splitCols (list) {
    var colA = [], colB = [], hA = 0, hB = 0
    list.forEach(function (it) {
      var h = (it.h || 160) + 84
      if (hA <= hB) { colA.push(it); hA += h } else { colB.push(it); hB += h }
    })
    return { colA: colA, colB: colB }
  }
  function deviceById (id) {
    var all = catalog().concat(state.myItems)
    return all.filter(function (d) { return d.id === id })[0] || catalog()[0]
  }

  /* ---------------- 脚手架 ---------------- */
  function statusbar () { return '<div class="statusbar"><span>9:41</span><span class="sb-r"><i></i></span></div>' }
  function capsule () {
    return '<div class="capsule"><span class="dots"><i></i><i></i><i></i></span><span class="dash"></span>' +
      '<span class="minus"><i></i></span><span class="dash"></span><span class="ring"><i></i></span></div>'
  }
  var TABS = [
    { key: 'home', text: '首页', icon: 'home' },
    { key: 'pick', text: '甄选', icon: 'star' },
    { key: 'center' },
    { key: 'repair', text: '维修', icon: 'wrench' },
    { key: 'mine', text: '我的', icon: 'user' }
  ]
  function tabbar (active) {
    var html = '<nav class="tabbar">'
    TABS.forEach(function (t) {
      if (t.key === 'center') {
        html += '<div class="tab-center" data-act="nav" data-to="publish"><span class="bubble"><b>转</b><i>设备</i></span></div>'
        return
      }
      html += '<div class="tab ' + (active === t.key ? 'on' : '') + '" data-act="tab" data-to="' + t.key + '">' +
        icon(t.icon) + '<span>' + t.text + '</span></div>'
    })
    return html + '</nav>'
  }
  function consultFloat () {
    return '<div class="consult" data-act="consult"><span class="av">' + icon('chat') + '</span><span class="tx">在线咨询</span></div>'
  }
  function demoFab () { return '<div class="demo-fab" data-act="screens" title="页面导航">导航</div>' }
  function domainTip () {
    if (state.domain === 'dental') return ''
    return '<div class="domain-tip">当前为<b>旧医美内容</b>（默认隐藏，仅供对比演示）</div>'
  }

  /* ---------------- 卡片 ---------------- */
  function cardWater (d) {
    return '<div class="pcard" data-act="nav" data-to="detail?id=' + d.id + '">' +
      '<div class="pcard-media" style="height:' + d.h + 'px">' +
      '<img src="' + d.cover + '" alt="">' +
      '<span class="ph-tag">' + d.tagText + '</span>' +
      (d.isPick ? '<span class="seal">' + icon('check') + '</span>' : '') +
      (d.mine ? '<span class="mine-tag">我的</span>' : '') +
      '</div>' +
      '<div class="pcard-body">' +
      '<div class="pcard-title">' + (d.isPick ? '<em>甄选</em>' : '') + d.title + '</div>' +
      '<div class="pcard-sub">' + subText(d) + '</div>' +
      '<div class="pcard-foot">' + priceHTML(d.price) +
      '<span class="mini-btn" data-act="consult" data-id="' + d.id + '">立即咨询</span></div>' +
      '</div></div>'
  }
  function cardRow (d) {
    return '<div class="lcard" data-act="nav" data-to="detail?id=' + d.id + '">' +
      '<div class="lcard-media"><img src="' + d.cover + '" alt=""><span class="ph-tag">' + d.tagText + '</span></div>' +
      '<div class="lcard-main">' +
      '<h4>' + d.title + '</h4>' +
      '<div class="lcard-sub">' + subText(d) + ' · ' + d.city + '</div>' +
      '<div class="lcard-tags">' + d.tags.map(function (t) { return '<i>' + t + '</i>' }).join('') + '</div>' +
      '<div class="lcard-foot">' + priceHTML(d.price) +
      '<span class="mini-btn" data-act="consult" data-id="' + d.id + '">立即咨询</span></div>' +
      '</div></div>'
  }

  /* ---------------- 首页 ---------------- */
  function pageHome () {
    var p = pack()
    var list = filterDevices({ city: state.city, sort: state.homeSort })
    var cols = splitCols(list)
    var sorts = [{ k: 'new', t: '最新发布' }, { k: 'hot', t: '热门设备' }, { k: 'distance', t: '距离最近' }]
    return '<div class="page page-white page-tab">' +
      '<div class="hero">' + statusbar() + capsule() +
      '<div class="nav-title">' + p.brandName + '</div>' +
      '<div class="search-row">' +
      '<div class="city" data-act="city"><span class="city-txt">' + state.city + '</span>' + icon('caret') + '</div>' +
      '<div class="search-pill" data-act="nav" data-to="search"><span class="ph">搜索设备 / 品牌 / 型号</span>' +
      '<span class="go">' + icon('search') + '</span></div>' +
      '</div></div>' +

      '<div class="banner" data-act="nav" data-to="pick">' +
      '<span class="b-tag">' + p.platformTag + '</span>' +
      '<div class="b-title">' + p.bannerTitle + '</div>' +
      '<div class="b-en">WORRY FREE SHOPPING</div>' +
      '<div class="b-desc">' + p.bannerSub.map(function (s) { return '<span>' + s + '</span>' }).join('') + '</div>' +
      '<div class="b-art">' + p.brandName + '</div>' +
      '<div class="b-dots"><i class="on"></i><i></i><i></i></div>' +
      '</div>' +

      /* Banner 占位图（留给运营图，后期直接换） */
      '<div class="banner-slot" data-act="tip" data-tip="Banner 占位图">' +
      '<div class="bs-inner">' +
      icon('camera', 'width:22px;height:22px') +
      '<b>Banner 占位图</b>' +
      '<small>建议 710 × 260px · 放维修活动 / 品牌图</small>' +
      '</div></div>' +

      /* 维修服务：凸显板块 */
      '<div class="repair-banner" data-act="nav" data-to="repair">' +
      '<div class="rb-left">' +
      '<div class="rb-tag">' + icon('wrench') + '维修服务</div>' +
      '<div class="rb-title">设备报修 · 48 小时上门</div>' +
      '<div class="rb-sub">牙科椅 / CBCT / 种植机 / 灭菌器 全部可报修</div>' +
      '<div class="rb-btn">立即报修' + icon('arrow', 'width:12px;height:12px') + '</div>' +
      '</div>' +
      '<div class="rb-art">' + icon('wrench', 'width:52px;height:52px') + '</div>' +
      '</div>' +

      '<div class="cat-grid">' + p.homeCats.map(function (c) {
        return '<div class="cat ' + c.cls + '" data-act="nav" data-to="' + c.to + '">' + icon(c.icon) + '<span>' + c.name + '</span></div>'
      }).join('') + '</div>' +

      (p.quickActions.length ? '<div class="quick-row">' + p.quickActions.map(function (q) {
        return '<div class="quick-item" data-act="nav" data-to="' + q.to + '">' +
          '<span class="q-ic">' + icon(q.icon) + '</span>' +
          '<span class="q-txt"><b>' + q.name + '</b><small>' + q.desc + '</small></span></div>'
      }).join('') + '</div>' : '') +

      '<div class="notice">' + icon('shield') + '<span>' + p.notice + '</span></div>' +
      domainTip() +

      '<div class="chips">' + sorts.map(function (s) {
        return '<div class="chip ' + (state.homeSort === s.k ? 'on' : '') + '" data-act="home-sort" data-key="' + s.k + '">' + s.t + '</div>'
      }).join('') + '</div>' +

      '<div class="waterfall">' +
      '<div class="wf-col">' + cols.colA.map(cardWater).join('') + '</div>' +
      '<div class="wf-col">' + cols.colB.map(cardWater).join('') + '</div>' +
      '</div>' +
      '<div class="list-end">— 已经到底啦，去列表看全部设备 —</div>' +
      consultFloat() + demoFab() + tabbar('home') +
      '</div>'
  }

  /* ---------------- 甄选 ---------------- */
  function pagePick () {
    var p = pack()
    var f = state.pick
    var list = filterDevices({
      pickOnly: true, city: state.city, sort: f.sort,
      brand: p.brands[f.brand], priceIndex: f.price, yearIndex: f.year
    })
    var cols = splitCols(list)
    var chips = '<div class="chips">' +
      '<div class="chip ' + (f.sort === 'distance' ? 'on' : '') + '" data-act="pick-sort">距离最近</div>' +
      '<div class="chip ' + (f.brand > 0 ? 'on' : '') + '" data-act="pick-filter" data-type="brand">' +
      (f.brand > 0 ? p.brands[f.brand] : '品牌') + icon('caret') + '</div>' +
      '<div class="chip ' + (f.price > 0 ? 'on' : '') + '" data-act="pick-filter" data-type="price">' +
      (f.price > 0 ? D.PRICE_RANGES[f.price] : '价格') + icon('caret') + '</div>' +
      '<div class="chip ' + (f.year > 0 ? 'on' : '') + '" data-act="pick-filter" data-type="year">' +
      (f.year > 0 ? D.YEAR_FILTERS[f.year] : '年份') + icon('caret') + '</div>' +
      '</div>'

    return '<div class="page page-white page-tab">' +
      '<div class="hero hero-soft">' + statusbar() + capsule() +
      '<div class="nav-title">' + p.brandName + '</div>' +
      '<div class="search-row">' +
      '<div class="city" data-act="city"><span class="city-txt">' + state.city + '</span>' + icon('caret') + '</div>' +
      '<div class="search-pill" data-act="nav" data-to="search"><span class="ph">搜索设备 / 品牌 / 型号</span>' +
      '<span class="go">' + icon('search') + '</span></div>' +
      '</div>' +
      '<div class="pick-banner">' +
      '<span class="pb-tag">' + p.platformTag + '</span>' +
      '<div class="pb-title">' + p.brandName + '甄选 · 无忧购</div>' +
      '<div class="pb-en">WORRY FREE SHOPPING</div>' +
      '<div class="pb-sub"><span>注册证可查</span><span>出检测报告</span></div>' +
      '<div class="pb-phone"><div>' + p.brandName + '</div></div>' +
      '</div></div>' +
      chips +
      '<div class="pick-note">' + icon('shield') + '<span>' + p.pickNote + '</span></div>' +
      domainTip() +
      '<div class="waterfall" style="padding-top:12px">' +
      '<div class="wf-col">' + cols.colA.map(cardWater).join('') + '</div>' +
      '<div class="wf-col">' + cols.colB.map(cardWater).join('') + '</div>' +
      '</div>' +
      (list.length ? '<div class="list-end">— 已加载全部甄选设备 —</div>' : '<div class="empty">没有符合条件的甄选设备</div>') +
      consultFloat() + demoFab() + tabbar('pick') +
      '</div>'
  }

  /* ---------------- 列表 ---------------- */
  function pageList (params) {
    var p = pack()
    var cat = params && params.cat ? Number(params.cat) : 0
    var l = state.list
    l.cat = cat
    var catObj = p.cats.filter(function (c) { return c.id === cat })[0] || p.cats[0]
    var title = cat ? catObj.name : '全部设备'
    var all = filterDevices({
      categoryId: cat,
      sort: l.sort === 'priceAsc' ? (l.priceDesc ? 'priceDesc' : 'priceAsc') : l.sort,
      keyword: l.keyword, city: state.city
    })
    var shown = all.slice(0, state.listCount)
    var sorts = [{ k: 'default', t: '综合' }, { k: 'new', t: '最新' }, { k: 'priceAsc', t: '价格' }, { k: 'distance', t: '距离' }]

    return '<div class="page page-plain">' +
      '<div class="l-top">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span>' + title + '</div>' +
      '<div class="sort-bar">' + sorts.map(function (s) {
        var on = s.k === 'priceAsc' ? l.sort === 'priceAsc' : l.sort === s.k
        return '<div class="sort-item ' + (on ? 'on' : '') + '" data-act="list-sort" data-key="' + s.k + '">' + s.t +
          (s.k === 'priceAsc' ? '<span class="sort-arrow">' + (l.priceDesc ? '↓' : '↑') + '</span>' : '') + '</div>'
      }).join('') +
      '<div class="sort-filter" data-act="nav" data-to="search">' + icon('search') + '</div>' +
      '</div></div>' +

      '<div class="cat-scroll"><div class="cat-chips">' + p.cats.map(function (c) {
        return '<div class="chip chip-auto ' + (c.id === cat ? 'on' : '') + '" data-act="list-cat" data-id="' + c.id + '">' + c.name + '</div>'
      }).join('') + '</div></div>' +

      '<div class="total-line"><span>共 <b>' + all.length + '</b> 台设备在售</span>' +
      '<span>' + (l.keyword ? '关键词：' + l.keyword : '按发布时间排序') + '</span></div>' +

      (shown.length ? shown.map(cardRow).join('') : '<div class="empty">没有符合条件的设备</div>') +
      (shown.length && shown.length < all.length
        ? '<div class="list-end" data-act="list-more" style="color:#2B7A4B">加载更多 ↓</div>'
        : (shown.length ? '<div class="list-end">— 已经到底啦 —</div>' : '')) +
      demoFab() +
      '</div>'
  }

  /* ---------------- 详情 ---------------- */
  function pageDetail (params) {
    var d = deviceById((params && params.id) || '')
    var p = pack()
    var fav = !!state.favs[d.id]
    var related = catalog().filter(function (x) { return x.id !== d.id && x.categoryId === d.categoryId }).slice(0, 2)
    var specs = d.specs && d.specs.length ? d.specs : [
      ['品牌', d.brand], ['型号', d.model], ['设备分类', d.categoryName], ['所在地', d.city + ' ' + d.district]
    ]
    var compliance = ''
    if (d.registerNo) {
      compliance = '<div class="d-card"><h4>合规核验</h4>' +
        '<div class="verify-list">' +
        '<div class="verify-row"><span>医疗器械注册证</span><b class="ok">' + d.registerNo + '</b></div>' +
        '<div class="verify-row"><span>是否含安装调试</span><b class="' + (d.installIncluded ? 'ok' : '') + '">' + (d.installIncluded ? '含安装调试' : '不含安装') + '</b></div>' +
        '<div class="verify-row"><span>原厂保修</span><b>' + (d.warranty || '—') + '</b></div>' +
        '<div class="verify-row"><span>平台核验</span><b class="ok">已通过人工核验</b></div>' +
        '</div></div>'
    }
    return '<div class="page page-white page-detail-pad">' +
      '<div class="d-media">' +
      '<div class="d-swiper">' + d.images.map(function (s) { return '<img src="' + s + '" alt="">' }).join('') + '</div>' +
      '<div class="d-top">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span></div>' +
      '</div>' +
      '<div class="d-count">1 / ' + d.images.length + '</div>' +
      '</div>' +

      '<div class="d-head">' +
      '<div class="d-price"><b>' + priceNum(d.price) + '</b>' +
      (d.price != null ? '<span>' + (d.negotiable ? '支持议价' : '一口价') + '</span>' : '<span>询价</span>') +
      (d.mine ? '<span class="mine-badge">我的商品 · ' + (STATUS_TEXT[d.status] || '') + '</span>' : '') + '</div>' +
      '<div class="d-title">' + d.title + '</div>' +
      '<div class="d-tags"><i class="g">' + d.condition + '</i>' +
      (d.year ? '<i class="g">' + d.year + ' 年</i>' : '') +
      '<i>' + d.city + ' · ' + d.district + '</i>' +
      d.tags.map(function (t) { return '<i>' + t + '</i>' }).join('') + '</div>' +
      '</div>' +

      '<div class="d-guarantee">' + p.guarantee.map(function (g) {
        return '<div>' + icon(g[0]) + g[1] + '</div>'
      }).join('') + '</div>' +

      '<div class="d-card"><h4>设备参数</h4><div class="spec">' +
      specs.map(function (s) { return '<div>' + s[0] + '<b>' + s[1] + '</b></div>' }).join('') +
      '</div></div>' +

      compliance +

      '<div class="d-card"><h4>卖家信息</h4><div class="seller">' +
      '<span class="logo">' + (d.mine ? '我' : p.brandName) + '</span>' +
      '<span class="s-main"><b>' + d.seller.name + (d.seller.verified ? '<em>已认证</em>' : '') + '</b>' +
      '<small>在售设备 ' + d.seller.count + ' 台 · 好评率 ' + d.seller.rate + '</small></span>' +
      (d.mine
        ? '<span class="s-btn" data-act="mine-edit" data-id="' + d.id + '">编辑</span>'
        : '<span class="s-btn" data-act="consult">进店逛逛</span>') +
      '</div></div>' +

      '<div class="d-card"><h4>设备描述</h4><div class="desc">' +
      d.desc.map(function (x) { return '<p>' + x + '</p>' }).join('') +
      '<div class="note">平台仅提供信息展示，交易前请自行核验设备资质与合规性。</div>' +
      '</div></div>' +

      (related.length ? '<div class="sec-head"><h3>相似设备</h3>' +
        '<span class="more">更多' + icon('arrow') + '</span></div>' +
        '<div class="rel">' + related.map(function (r) { return '<div>' + cardWater(r) + '</div>' }).join('') + '</div>' : '') +

      '<div class="d-actions">' +
      '<div class="op ' + (fav ? 'on' : '') + '" data-act="fav" data-id="' + d.id + '">' + icon('star') + '<span>' + (fav ? '已收藏' : '收藏') + '</span></div>' +
      '<div class="op" data-act="call">' + icon('chat') + '<span>电话</span></div>' +
      '<div class="btn-ghost" data-act="call">立即致电</div>' +
      '<div class="btn-solid" data-act="consult">立即咨询</div>' +
      '</div>' +
      '</div>'
  }

  /* ---------------- 发布 / 编辑商品 ---------------- */
  function blankForm () {
    return {
      images: [], title: '', cat: 0, brand: 0, model: '',
      condition: 2, year: 2, useYears: '', registerNo: '',
      installIncluded: true, warranty: '',
      price: '', negotiable: true, city: 0,
      contact: '', phone: '', params: ['', '']
    }
  }

  function pagePublish (params) {
    var p = pack()
    var isEstimate = params && params.from === 'estimate'
    var editId = params && params.edit
    if (editId) {
      if (state.editingId !== editId || !state.form) {
        var it = state.myItems.filter(function (x) { return x.id === editId })[0]
        if (it) {
          state.editingId = editId
          state.form = {
            images: it.images.slice(),
            title: it.title, cat: Math.max(0, it.categoryId - 1),
            brand: Math.max(0, p.brands.filter(function (b) { return b !== '全部品牌' }).indexOf(it.brand)),
            model: it.model, condition: Math.max(0, D.CONDITION_OPTIONS.indexOf(it.condition)),
            year: Math.max(0, D.YEAR_OPTIONS.indexOf((it.year || 2024) + ' 年')),
            useYears: it.useYears || '', registerNo: it.registerNo || '',
            installIncluded: it.installIncluded !== false, warranty: it.warranty || '',
            price: it.price ? String(it.price / 10000) : '', negotiable: it.negotiable !== false,
            city: Math.max(0, D.CITIES.filter(function (c) { return c !== '全国' }).indexOf(it.city)),
            contact: it.contact || '', phone: it.phone || '',
            params: [
              (it.specs && it.specs[0] ? it.specs[0][1] : ''),
              (it.specs && it.specs[1] ? it.specs[1][1] : '')
            ].slice(0, 2)
          }
        }
      }
    } else if (!state.form || state.editingId) {
      state.form = blankForm()
      state.editingId = null
    }

    var f = state.form
    var cats = p.cats.filter(function (c) { return c.id > 0 })
    var brands = p.brands.filter(function (b) { return b !== '全部品牌' })
    var cityList = D.CITIES.filter(function (c) { return c !== '全国' })
    var tmpl = (p.paramTemplates[(f.cat || 0) + 1] || [['参数一', ''], ['参数二', '']])

    function row (label, req, inner) {
      return '<div class="f-row"><span class="f-label">' + (req ? '<em>*</em>' : '') + label + '</span>' + inner + '</div>'
    }
    function pickerRow (label, req, text, type) {
      return row(label, req, '<span class="f-val" data-act="pick-form" data-type="' + type + '">' + text + '</span>' +
        icon('arrow', 'width:13px;height:13px;color:#B7BCC4'))
    }
    function switchRow (label, on, type) {
      return row(label, false, '<span class="switch ' + (on ? 'on' : '') + '" data-act="toggle-form" data-type="' + type + '"></span>')
    }

    return '<div class="page page-plain" style="padding-bottom:96px">' +
      '<div class="p-top">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span>' +
      (isEstimate ? '免费估价' : (editId ? '编辑商品' : '发布商品')) + '</div>' +
      (isEstimate ? '' : '<div class="steps">' +
        '<div class="step on"><i>1</i><span>商品图片</span></div><div class="step-line"></div>' +
        '<div class="step on"><i>2</i><span>基本信息</span></div><div class="step-line"></div>' +
        '<div class="step"><i>3</i><span>提交上架</span></div>' +
        '</div>') +
      '</div>' +

      (isEstimate ? '<div class="estimate-tip">不确定价格？先把设备信息填好，平台会给出参考估价区间。</div>' : '') +
      domainTip() +

      '<div class="f-card"><div class="f-title">商品图片<small>最多 9 张，建议首图为整机正面</small></div>' +
      '<div class="upload">' +
      f.images.map(function (src, i) {
        return '<div class="u-item"><img src="' + src + '" alt="">' +
          '<span class="u-del" data-act="del-img" data-i="' + i + '">' + icon('close') + '</span></div>'
      }).join('') +
      (f.images.length < 9 ? '<div class="u-add" data-act="upload">' + icon('plus') + '<span>' + f.images.length + '/9</span></div>' : '') +
      '</div></div>' +

      '<div class="f-card"><div class="f-title">基本信息</div>' +
      row('商品标题', true, '<input data-field="title" value="' + f.title + '" placeholder="如：卡瓦 E70 牙科综合治疗台 双椅位">') +
      pickerRow('设备类目', true, cats[f.cat].name, 'cat') +
      pickerRow('品牌', true, brands[f.brand], 'brand') +
      row('型号', false, '<input data-field="model" value="' + f.model + '" placeholder="如：Estetica E70">') +
      pickerRow('成色', true, D.CONDITION_OPTIONS[f.condition], 'cond') +
      pickerRow('出厂年份', true, D.YEAR_OPTIONS[f.year], 'year') +
      row('使用年限', false, '<input data-field="useYears" value="' + f.useYears + '" placeholder="如：使用约 3 年 / 1200 人次">') +
      '</div>' +

      '<div class="f-card"><div class="f-title">合规与参数<small>按类目自动切换参数项</small></div>' +
      row('注册证号', false, '<input data-field="registerNo" value="' + f.registerNo + '" placeholder="如：国械注进 20173061234">') +
      switchRow('含安装调试', f.installIncluded, 'installIncluded') +
      row('原厂保修', false, '<input data-field="warranty" value="' + f.warranty + '" placeholder="如：剩余 8 个月 / 已过保">') +
      row(tmpl[0][0], false, '<input data-field="p0" value="' + (f.params[0] || '') + '" placeholder="' + tmpl[0][1] + '">') +
      row(tmpl[1][0], false, '<input data-field="p1" value="' + (f.params[1] || '') + '" placeholder="' + tmpl[1][1] + '">') +
      '</div>' +

      '<div class="f-card"><div class="f-title">价格与联系</div>' +
      row('期望售价', !isEstimate, '<input data-field="price" type="number" value="' + f.price + '" placeholder="请输入金额"><span class="f-unit">万元</span>') +
      switchRow('可否议价', f.negotiable, 'negotiable') +
      pickerRow('所在城市', true, cityList[f.city], 'city') +
      row('联系人', true, '<input data-field="contact" value="' + f.contact + '" placeholder="请输入您的称呼">') +
      row('手机号', true, '<input data-field="phone" type="tel" maxlength="11" value="' + f.phone + '" placeholder="用于买家与您联系">') +
      '</div>' +

      '<div class="f-tip"><div>· 提交后进入<b>待审核</b>，演示环境 2 秒后自动通过并上架</div>' +
      '<div>· 上架商品会出现在首页与设备列表中（标“我的”）</div></div>' +

      '<div class="p-actions">' +
      '<div class="p-save" data-act="draft">存草稿</div>' +
      '<div class="btn-solid" data-act="submit" data-estimate="' + (isEstimate ? 1 : 0) + '">' +
      (isEstimate ? '获取估价' : (editId ? '保存修改' : '提交上架')) + '</div>' +
      '</div></div>'
  }

  /* ---------------- 我的店铺（卖家中心） ---------------- */
  function pageSeller () {
    var items = state.myItems.filter(function (it) { return it.mine && it.domain === state.domain })
    var count = function (s) { return items.filter(function (i) { return i.status === s }).length }
    var views = items.reduce(function (a, b) { return a + (b.viewCount || 0) }, 0)

    function itemRow (it) {
      var acts = ''
      if (it.status === 'on') acts += '<span class="op-btn" data-act="seller-off" data-id="' + it.id + '">' + icon('down') + '下架</span>'
      else acts += '<span class="op-btn" data-act="seller-on" data-id="' + it.id + '">' + icon('up') + '上架</span>'
      acts += '<span class="op-btn" data-act="mine-edit" data-id="' + it.id + '">' + icon('edit') + '编辑</span>'
      acts += '<span class="op-btn danger" data-act="seller-del" data-id="' + it.id + '">' + icon('trash') + '删除</span>'

      return '<div class="sitem">' +
        '<div class="sitem-media" data-act="nav" data-to="detail?id=' + it.id + '">' +
        '<img src="' + it.cover + '" alt="">' +
        '<span class="st st-' + it.status + '">' + STATUS_TEXT[it.status] + '</span>' +
        '</div>' +
        '<div class="sitem-main">' +
        '<div class="sitem-title">' + it.title + '</div>' +
        '<div class="sitem-sub">' + subText(it) + ' · ' + it.city + '</div>' +
        '<div class="sitem-price">' + priceNum(it.price) + ' <small>浏览 ' + (it.viewCount || 0) + '</small></div>' +
        '<div class="sitem-ops">' + acts + '</div>' +
        '</div></div>'
    }

    return '<div class="page page-plain">' +
      '<div class="s-top">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span>我的店铺</div>' +
      '</div>' +

      '<div class="shop-card">' +
      '<div class="shop-logo">' + pack().brandName + '</div>' +
      '<div class="shop-main">' +
      '<b>我的店铺（示例）</b>' +
      '<small>' + pack().brandName + ' · 已认证卖家 · 在售 ' + count('on') + ' 台</small>' +
      '</div>' +
      '<div class="shop-btn" data-act="nav" data-to="publish">' + icon('plus') + '发布</div>' +
      '</div>' +

      '<div class="stat-row">' +
      '<div class="stat"><b>' + count('on') + '</b><span>上架中</span></div>' +
      '<div class="stat"><b>' + count('auditing') + '</b><span>待审核</span></div>' +
      '<div class="stat"><b>' + count('off') + '</b><span>已下架</span></div>' +
      '<div class="stat"><b>' + views + '</b><span>总浏览</span></div>' +
      '</div>' +

      '<div class="sec-head"><h3>我的商品</h3>' +
      '<span class="more" data-act="nav" data-to="publish">新增商品' + icon('plus') + '</span></div>' +

      (items.length ? items.map(itemRow).join('')
        : '<div class="empty">还没有商品，点右上角「发布」上架你的第一台设备</div>') +

      '<div class="seller-tip">演示环境：商品数据保存在本机浏览器，刷新不丢；正式版由后端存储并走平台审核。</div>' +
      '<div style="height:20px"></div>' + demoFab() +
      '</div>'
  }

  /* ---------------- 维修报修 ---------------- */
  function pageRepair () {
    var R = D.REPAIR
    var p = pack()
    var f = state.repair
    function pr (label, val, placeholder, act) {
      var empty = !val
      return '<div class="rp-row" data-act="' + act + '">' +
        '<span class="rp-label">' + label + '</span>' +
        '<span class="rp-val' + (empty ? ' ph' : '') + '">' + (val || placeholder) + '</span>' +
        icon('arrow', 'width:13px;height:13px;color:#B7BCC4') +
        '</div>'
    }
    return '<div class="page page-plain page-repair">' +
      '<div class="rp-hero">' + statusbar() + capsule() +
      '<div class="nav-title">维修服务</div>' +
      '<div class="rp-hero-sub">' + p.brandName + ' · 认证服务商 · 48 小时内上门</div>' +
      '<div class="rp-orders-link" data-act="nav" data-to="repair-orders">我的订单' + icon('arrow') + '</div>' +
      '</div>' +

      /* Banner 占位图 */
      '<div class="banner-slot" data-act="tip" data-tip="Banner 占位图">' +
      '<div class="bs-inner">' + icon('camera', 'width:22px;height:22px') +
      '<b>Banner 占位图</b><small>建议 710 × 260px · 放维修活动图</small></div></div>' +

      /* 预约流程 */
      '<div class="rp-flow">' +
      '<div class="rp-flow-head">' + icon('wrench') + '预约流程</div>' +
      '<div class="rp-steps">' + R.flow.map(function (st, i) {
        var cls = i === 0 ? 'on' : (i === 1 ? 'on' : '')
        return (i ? '<span class="rp-arrow">→</span>' : '') +
          '<div class="rp-step ' + cls + '"><i>' + st.no + '</i><b>' + st.name + '</b></div>'
      }).join('') + '</div></div>' +

      /* 表单 */
      '<div class="rp-card">' +
      '<div class="rp-addr" data-act="pick-addr">' +
      '<div class="rpa-main"><b>' + f.address.title + '</b>' +
      '<small>' + f.address.contact + ' ' + f.address.phone + '</small></div>' +
      icon('arrow', 'width:13px;height:13px;color:#B7BCC4') +
      '</div>' +
      pr('维修产品', f.product, '请选择维修产品', 'pick-product') +
      pr('联系时间', f.time, '请选择联系时间', 'pick-time') +
      '<div class="rp-desc">' +
      '<div class="rp-desc-label">问题描述</div>' +
      '<textarea id="rpDesc" maxlength="200" placeholder="请详细描述设备故障信息/报错信息">' + f.desc + '</textarea>' +
      '<div class="rp-counter"><span id="rpCount">' + f.desc.length + '</span>/200</div>' +
      '<div class="rp-upload">' +
      f.images.map(function (src, i) {
        return '<div class="rp-u"><img src="' + src + '" alt="">' +
          '<span class="rp-u-del" data-act="del-repair-img" data-i="' + i + '">' + icon('close') + '</span></div>'
      }).join('') +
      (f.images.length < 3 ? '<div class="rp-u-add" data-act="upload-repair">' + icon('plus') + '<span>上传图片</span></div>' : '') +
      '</div></div></div>' +

      /* 服务类型 */
      '<div class="rp-services">' + R.services.map(function (sv) {
        return '<div class="rp-service">' + icon(sv.icon) + '<b>' + sv.name + '</b><small>' + sv.desc + '</small></div>'
      }).join('') + '</div>' +

      '<div class="rp-actions"><div class="btn-solid" data-act="submit-repair">立即报修</div></div>' +
      demoFab() + tabbar('repair') +
      '</div>'
  }

  /* ---------------- 我的维修订单 ---------------- */
  function pageOrders () {
    var R = D.REPAIR
    var all = state.orders
    var kw = (state.orderKeyword || '').trim().toLowerCase()
    var list = state.orderTab === 'all' ? all.slice() : all.filter(function (o) { return o.status === state.orderTab })
    if (kw) {
      list = list.filter(function (o) {
        return (o.id + o.product + o.desc).toLowerCase().indexOf(kw) > -1
      })
    }
    var empty = '<div class="od-empty">' +
      '<div class="od-empty-art">' + icon('wrench', 'width:44px;height:44px') + '</div>' +
      '<div class="od-empty-txt">暂无数据</div>' +
      '<div class="od-empty-btn" data-act="nav" data-to="repair">去报修</div>' +
      '</div>'

    return '<div class="page page-plain page-orders">' +
      '<div class="rp-hero">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span>我的订单</div>' +
      '<div class="od-search">' + icon('search') +
      '<input id="odInput" value="' + (state.orderKeyword || '') + '" placeholder="订单号 / 维修项目">' +
      '<span class="od-search-btn" data-act="do-order-search">搜索</span>' +
      '</div></div>' +

      '<div class="od-tabs">' + R.statuses.map(function (t) {
        return '<div class="od-tab ' + (state.orderTab === t.k ? 'on' : '') + '" data-act="order-tab" data-k="' + t.k + '">' + t.t + '</div>'
      }).join('') + '</div>' +

      (list.length ? list.map(function (o) {
        return '<div class="od-item">' +
          '<div class="od-top">' +
          '<span class="od-no">' + o.id + '</span>' +
          '<span class="od-status s-' + o.status + '">' + R.statusText[o.status] + '</span>' +
          '</div>' +
          '<div class="od-title">' + o.product + '</div>' +
          '<div class="od-line">' + icon('pin', 'width:12px;height:12px') + o.address.title + '</div>' +
          '<div class="od-line">' + icon('clock', 'width:12px;height:12px') + o.time + ' · ' + o.address.contact + ' ' + o.address.phone + '</div>' +
          (o.desc ? '<div class="od-desc">' + o.desc + '</div>' : '') +
          '<div class="od-foot"><span class="od-time">' + o.createdAt + '</span>' +
          (o.status === 'pending' || o.status === 'assigned'
            ? '<span class="op-btn danger" data-act="order-cancel" data-id="' + o.id + '">取消报修</span>'
            : '<span class="op-btn" data-act="tip" data-tip="服务评价">再次报修</span>') +
          '</div></div>'
      }).join('') : empty) +
      '<div style="height:20px"></div>' + demoFab() +
      '</div>'
  }

  /* ---------------- 搜索 ---------------- */
  function pageSearch () {
    var p = pack()
    var results = state.searched ? filterDevices({ keyword: state.keyword }) : []
    var panel = !state.searched
      ? (state.history.length ? '<div class="s-block"><div class="s-title"><span>历史搜索</span>' +
          icon('close', 'cursor:pointer').replace('<svg', '<svg data-act="clear-history"') + '</div>' +
          '<div class="tags">' + state.history.map(function (h) {
            return '<span class="tag" data-act="kw" data-kw="' + h + '">' + h + '</span>'
          }).join('') + '</div></div>' : '') +
        '<div class="s-block"><div class="s-title"><span>热门搜索</span></div><div class="tags">' +
        p.hotWords.map(function (h) { return '<span class="tag hot" data-act="kw" data-kw="' + h + '">' + h + '</span>' }).join('') +
        '</div></div>' +
        '<div class="s-block"><div class="s-title"><span>大家都在找</span></div><div class="rank">' +
        p.rank.map(function (r, i) {
          return '<a data-act="kw" data-kw="' + r.name + '"><span class="no">' + (i + 1) + '</span>' +
            '<span class="nm">' + r.name + '</span><span class="cnt">' + r.count + ' 人查看</span></a>'
        }).join('') + '</div></div>'
      : '<div class="result-line"><span>“<em>' + state.keyword + '</em>” 的搜索结果</span>' +
        '<span>共 ' + results.length + ' 台</span></div>' +
        (results.length ? results.map(cardRow).join('') : '<div class="empty">没有找到相关设备，换个关键词试试</div>')

    return '<div class="page page-plain">' +
      '<div class="s-head"><div class="s-row">' +
      '<span class="s-back" data-act="back">' + icon('back') + '</span>' +
      '<div class="s-input">' + icon('search') +
      '<input id="kwInput" value="' + state.keyword + '" placeholder="CBCT / 牙科椅 / 种植机">' +
      (state.keyword ? '<span class="s-clear" data-act="clear-kw">' + icon('close') + '</span>' : '') +
      '</div>' +
      '<span class="s-cancel" data-act="do-search">搜索</span>' +
      '</div></div>' + panel +
      '<div style="height:24px"></div>' + demoFab() +
      '</div>'
  }

  /* ---------------- 资讯 ---------------- */
  function pageNews () {
    var p = pack()
    var list = state.newsTab === 'all' ? p.news : p.news.filter(function (n) { return n.tab === state.newsTab })
    var head = p.newsHead
    var cover = function (n) {
      if (n.tab === 'weekly') {
        return '<div class="news-cover"><span class="bub b1"></span><span class="bub b2"></span><span class="bub b3"></span>' +
          '<div class="nc-head">' + head.weekly + '</div>' +
          '<div class="nc-title"><i>' + head.weeklyTitle.slice(0, 2) + '</i>' + head.weeklyTitle.slice(2) + '</div>' +
          '<div class="nc-tag">掌握(行业一手资讯)</div></div>'
      }
      return '<div class="news-cover" style="background:radial-gradient(60% 90% at 12% 20%, rgba(255,255,255,.95), transparent 60%), linear-gradient(115deg,#E8F4DA 0%,#DFF0C4 55%,#F6F7D8 100%)">' +
        '<span class="bub b1"></span><span class="bub b2"></span><span class="bub b3"></span>' +
        '<div class="nc-head">' + head.company + '</div>' +
        '<div class="nc-title sm">' + head.companyTitle + '<span>动态</span></div>' +
        '<div class="nc-tag">' + p.brandName + ' · 平台公告</div></div>'
    }
    return '<div class="page page-white page-tab">' +
      '<div class="hero hero-flat">' + statusbar() + capsule() +
      '<div class="nav-title"><span class="nav-back" data-act="back">' + icon('back') + '</span>行业资讯</div>' +
      '<div class="news-tabs">' + p.newsTabs.map(function (t) {
        return '<div class="nt ' + (state.newsTab === t.k ? 'on' : '') + '" data-act="news-tab" data-tab="' + t.k + '">' + t.t + '</div>'
      }).join('') + '</div></div>' +
      '<div style="padding-top:12px">' + list.map(function (n) {
        return '<div class="news-card" data-act="open-news">' + cover(n) +
          '<div class="news-body"><h4>' + n.title + '</h4>' +
          '<div class="news-foot"><span class="logo">' + p.brandName + '</span><span class="who">' + p.brandName + '网</span>' +
          '<span class="thumb">' + icon('thumb') + n.likes + '</span></div></div></div>'
      }).join('') + '</div>' +
      '<div class="list-end">— 没有更多资讯了 —</div>' +
      demoFab() +
      '</div>'
  }

  /* ---------------- 我的 ---------------- */
  function pageMine () {
    var u = state.user
    var p = pack()
    var myCount = state.myItems.filter(function (it) { return it.mine && it.domain === state.domain && it.status === 'on' }).length
    return '<div class="page page-white page-tab">' +
      '<div class="mine-hero">' + statusbar() + capsule() +
      '<div class="mine-title">我的</div>' +
      '<div class="mine-tools" data-act="tip" data-tip="设置">' + icon('gear') + '</div>' +
      '<div class="mine-user" data-act="login">' +
      '<div class="mine-avatar">' + icon('userFill') + '</div>' +
      '<div class="mine-name">' + (u ? u.nickName : '授权登录') + '</div>' +
      (u ? '<div class="mine-sub">' + u.phone + ' · 未实名</div>' : '') +
      '</div></div>' +

      '<div class="quick-card">' +
      '<a data-act="tip" data-tip="关注产品">关注产品</a>' +
      '<a data-act="tip" data-tip="浏览历史">浏览历史</a>' +
      '<a data-act="tip" data-tip="帮助中心">帮助中心</a>' +
      '</div>' +

      '<div class="mine-block"><h3>卖家中心</h3>' +
      '<div class="seller-entry">' +
      '<span class="se-ic">' + icon('shop') + '</span>' +
      '<span class="se-main" data-act="nav" data-to="seller"><b>我的店铺</b><small>在售 ' + myCount + ' 台 · 管理商品与上架</small></span>' +
      '<span class="se-btn" data-act="nav" data-to="publish">' + icon('plus') + '发布</span>' +
      '</div></div>' +

      '<div class="mine-block"><h3>维修服务</h3>' +
      '<div class="seller-entry">' +
      '<span class="se-ic" style="background:linear-gradient(140deg,#BFE8A2,#5BAF5F);color:#fff">' + icon('wrench') + '</span>' +
      '<span class="se-main" data-act="nav" data-to="repair-orders"><b>我的维修订单</b>' +
      '<small>' + state.orders.length + ' 条记录 · 待接单 ' + state.orders.filter(function (o) { return o.status === 'pending' }).length + ' 条</small></span>' +
      '<span class="se-btn" data-act="nav" data-to="repair">报修</span>' +
      '</div></div>' +

      '<div class="mine-block"><h3>我的交易</h3><div class="trade-row">' +
      '<a data-act="tip" data-tip="我买到的"><span class="ic-round t-buy">' + icon('cart') + '</span>' +
      '<span><b>我买到的</b><small>点击查看已采购订单</small></span></a>' +
      '<a data-act="tip" data-tip="我卖出的"><span class="ic-round t-sell">' + icon('bars') + '</span>' +
      '<span><b>我卖出的</b><small>点击查看发布订单</small></span></a>' +
      '</div></div>' +

      '<div class="mine-block"><h3>我的功能</h3><div class="func-grid">' +
      '<a data-act="nav" data-to="publish?from=estimate"><span class="f-ic">' + icon('edit') + '</span><span>我的估价</span></a>' +
      '<a data-act="nav" data-to="seller"><span class="f-ic">' + icon('tag') + '</span><span>我的发布</span></a>' +
      '<a data-act="tip" data-tip="实名认证"><span class="f-ic">' + icon('shield') + '</span><span>实名认证</span></a>' +
      '<a data-act="tip" data-tip="联系客服"><span class="f-ic">' + icon('chat') + '</span><span>联系客服</span></a>' +
      '</div></div>' +

      '<div class="mine-block"><h3>保存与分享</h3>' +
      '<div class="save-row">' +
      '<div class="save-item" data-act="add-home"><span class="si-ic">' + icon('plus') + '</span><b>添加到桌面</b><small>像 App 一样打开</small></div>' +
      '<div class="save-item" data-act="copy-link"><span class="si-ic">' + icon('doclist') + '</span><b>复制链接</b><small>发给同事/客户</small></div>' +
      '<div class="save-item" data-act="tip" data-tip="扫码分享"><span class="si-ic">' + icon('camera') + '</span><b>扫码分享</b><small>打开 qr.html 展示</small></div>' +
      '</div></div>' +

      '<div class="mine-block"><h3>内容域</h3>' +
      '<div class="domain-row" data-act="switch-domain">' +
      '<span class="dr-main"><b>' + p.label + '</b><small>切换后全站内容随之变化，旧内容不删除</small></span>' +
      '<span class="dr-btn">切换</span>' +
      '</div></div>' +

      '<div class="version">' + p.brandName + ' v1.1.0 · 效果演示</div>' +
      consultFloat() + demoFab() + tabbar('mine') +
      '</div>'
  }

  /* ---------------- 屏幕总览 ---------------- */
  function pageWall () {
    var screens = [
      ['home', '01 首页', 'tab'], ['pick', '02 牙翼甄选', 'tab'], ['list?cat=1', '03 设备列表', '二级'],
      ['detail?id=DE2001', '04 设备详情', '二级'], ['publish', '05 发布商品', '二级'],
      ['repair', '06 维修服务', 'tab'], ['repair-orders', '07 我的订单', '二级'],
      ['seller', '08 我的店铺', '二级'], ['search', '09 搜索', '二级'],
      ['news', '10 资讯', '二级'], ['mine', '11 我的', 'tab']
    ]
    var base = location.href.split('#')[0]
    return '<div class="wall"><div class="wall-inner">' +
      '<div class="wall-head"><h1>牙翼 · 效果总览</h1>' +
      '<p>牙翼 · 二手牙科设备挂网 + 维修服务平台（11 个页面）。左边滑动查看全部，每台手机都是<b>可点击的</b>真实运行页面。' +
      '旧医美内容已隐藏，可在「我的 → 内容域」一键切回对比。</p></div>' +
      '<div class="wall-grid">' + screens.map(function (s) {
        return '<div class="wall-item"><iframe src="' + base + '#/' + s[0] + '" loading="lazy"></iframe>' +
          '<div class="cap"><b>' + s[1] + '</b><i>' + s[2] + '</i>' +
          '<a href="#/' + s[0] + '" style="margin-left:auto;color:#8C929B;font-size:11px;border-bottom:1px dashed #C6CCD3">独立打开</a></div></div>'
      }).join('') + '</div>' +
      '</div></div>'
  }

  /* ---------------- 弹层 ---------------- */
  var overlay = null
  function closeOverlay () {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
    overlay = null
  }
  function showSheet (title, options, current, onPick) {
    closeOverlay()
    overlay = document.createElement('div')
    overlay.className = 'mask'
    overlay.innerHTML = '<div class="sheet">' +
      (title ? '<div class="sheet-title">' + title + '</div>' : '') +
      options.map(function (o, i) {
        return '<div class="sheet-opt ' + (i === current ? 'on' : '') + '" data-i="' + i + '">' + o + '</div>'
      }).join('') +
      '<div class="sheet-opt" data-i="-1" style="text-align:center;color:#8C929B">取消</div></div>'
    document.body.appendChild(overlay)
    overlay.addEventListener('click', function (e) {
      var t = e.target.closest('.sheet-opt')
      if (e.target === overlay) { closeOverlay(); return }
      if (!t) return
      var i = Number(t.dataset.i)
      closeOverlay()
      if (i >= 0) onPick(i)
    })
  }
  function showDialog (title, body, onOk, confirmText) {
    closeOverlay()
    overlay = document.createElement('div')
    overlay.className = 'mask center'
    overlay.innerHTML = '<div class="dialog"><div class="d-title">' + title + '</div>' +
      '<div class="d-body">' + body + '</div><div class="d-btn">' + (confirmText || '知道了') + '</div></div>'
    document.body.appendChild(overlay)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('d-btn')) {
        closeOverlay()
        if (onOk) onOk()
      }
    })
  }
  var toastTimer = null
  function toast (msg) {
    var el = document.querySelector('.toast')
    if (el) el.parentNode.removeChild(el)
    el = document.createElement('div')
    el.className = 'toast'
    el.textContent = msg
    document.body.appendChild(el)
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el)
    }, 1600)
  }

  /* ---------------- 线索外发（复制 / 拨号） ---------------- */
  function copyText (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      var ok = false
      try { ok = document.execCommand('copy') } catch (e) {}
      document.body.removeChild(ta)
      ok ? resolve() : reject(new Error('copy failed'))
    })
  }

  var CONTACT = D.CONTACT || { name: '牙翼客服', phone: '', wechat: '' }

  function showLead (title, text, tip, onClose) {
    closeOverlay()
    overlay = document.createElement('div')
    overlay.className = 'mask center'
    overlay.innerHTML =
      '<div class="lead">' +
      '<div class="lead-title">' + title + '</div>' +
      '<div class="lead-tip">' + (tip || '复制下面的信息，发给牙翼客服微信即可') + '</div>' +
      '<textarea class="lead-text" readonly id="leadText">' + text + '</textarea>' +
      '<div class="lead-ops">' +
      '<span class="lead-btn" data-lead="copy">复制信息</span>' +
      '<a class="lead-btn primary" href="tel:' + CONTACT.phone + '">直接打电话</a>' +
      '</div>' +
      '<div class="lead-close" data-lead="close">关闭</div>' +
      '</div>'
    document.body.appendChild(overlay)
    overlay.addEventListener('click', function (e) {
      var t = e.target
      if (t.getAttribute && t.getAttribute('data-lead') === 'copy') {
        copyText(text).then(function () {
          toast('已复制，去微信粘贴发给客服')
        }).catch(function () {
          var el = document.getElementById('leadText')
          if (el) { el.focus(); el.select() }
          toast('长按上面的文字全选后复制')
        })
        return
      }
      if (t === overlay || (t.getAttribute && t.getAttribute('data-lead') === 'close')) {
        closeOverlay()
        if (onClose) onClose()
      }
    })
  }

  function leadDeviceText (d) {
    var url = location.href.split('#')[0] + '#/detail?id=' + d.id
    return '【设备咨询】' + (CONTACT.name || '牙翼客服') + '你好，我在牙翼上看到这台设备：\n' +
      '名称：' + d.title + '\n' +
      '编号：' + d.id + '\n' +
      '价格：' + priceNum(d.price) + '\n' +
      '城市：' + d.city + (d.district ? ' ' + d.district : '') + '\n' +
      '成色：' + d.condition + (d.year ? ' / ' + d.year + ' 年' : '') + '\n' +
      '链接：' + url
  }

  function leadRepairText (o) {
    return '【维修报修】\n' +
      '单号：' + o.id + '\n' +
      '设备：' + o.product + '\n' +
      '地址：' + o.address.title + '\n' +
      '联系人：' + o.address.contact + ' ' + o.address.phone + '\n' +
      '联系时间：' + o.time + '\n' +
      '故障描述：' + o.desc
  }

  function leadDeviceSellText (it) {
    return '【我要卖机】\n' +
      '标题：' + it.title + '\n' +
      '类目：' + it.categoryName + '\n' +
      '品牌型号：' + it.brand + ' ' + it.model + '\n' +
      '成色/年份：' + it.condition + ' / ' + (it.year || '-') + '\n' +
      '价格：' + priceNum(it.price) + '\n' +
      '城市：' + it.city + '\n' +
      '注册证号：' + (it.registerNo || '无') + '\n' +
      '含安装调试：' + (it.installIncluded ? '是' : '否') + '\n' +
      '联系人：' + (it.contact || '') + ' ' + (it.phone || '')
  }

  /* ---------------- 路由 ---------------- */
  var app = document.getElementById('app')

  function parseHash () {
    var h = (location.hash || '').replace(/^#\/?/, '')
    if (!h) h = 'home'
    var parts = h.split('?')
    var params = {}
    ;(parts[1] || '').split('&').forEach(function (kv) {
      if (!kv) return
      var pp = kv.split('=')
      params[pp[0]] = decodeURIComponent(pp[1] || '')
    })
    return { name: parts[0] || 'home', params: params }
  }

  var SCREENS = {
    home: pageHome, pick: pagePick, list: pageList, detail: pageDetail,
    publish: pagePublish, seller: pageSeller, search: pageSearch,
    repair: pageRepair, 'repair-orders': pageOrders,
    news: pageNews, mine: pageMine, wall: pageWall
  }

  function render () {
    var r = parseHash()
    var fn = SCREENS[r.name] || pageHome
    app.classList.toggle('full', r.name === 'wall')
    app.innerHTML = fn(r.params)
    if (r.name !== 'search') window.scrollTo(0, 0)
    wirePage()
  }

  function go (to) { location.hash = '#/' + to; closeOverlay() }

  /* ---------------- 交互 ---------------- */
  function wirePage () {
    var swiper = document.querySelector('.d-swiper')
    if (swiper) {
      swiper.addEventListener('scroll', function () {
        var total = swiper.children.length
        var i = Math.round(swiper.scrollLeft / swiper.clientWidth) + 1
        var el = document.querySelector('.d-count')
        if (el) el.textContent = Math.min(i, total) + ' / ' + total
      })
    }
    var input = document.getElementById('kwInput')
    if (input) {
      input.addEventListener('input', function () { state.keyword = input.value })
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch() })
      setTimeout(function () {
        try { input.focus({ preventScroll: true }) } catch (e) { input.focus() }
      }, 60)
    }
    var desc = document.getElementById('rpDesc')
    if (desc) {
      desc.addEventListener('input', function () {
        state.repair.desc = desc.value
        var c = document.getElementById('rpCount')
        if (c) c.textContent = desc.value.length
      })
    }
    var odInput = document.getElementById('odInput')
    if (odInput) {
      odInput.addEventListener('input', function () { state.orderKeyword = odInput.value })
      odInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { render() } })
    }
    document.querySelectorAll('[data-field]').forEach(function (el) {
      el.addEventListener('input', function () {
        var k = el.dataset.field
        if (k === 'p0' || k === 'p1') state.form.params[k === 'p0' ? 0 : 1] = el.value
        else state.form[k] = el.value
      })
    })
  }

  function doSearch (kw) {
    if (kw !== undefined) state.keyword = kw
    var k = String(state.keyword || '').trim()
    if (!k) { toast('请输入搜索关键词'); return }
    state.history = [k].concat(state.history.filter(function (h) { return h !== k })).slice(0, 10)
    saveJSON('zm_history', state.history)
    state.keyword = k
    state.searched = true
    render()
  }

  function saveMyItems () { saveJSON('zm_my_items', state.myItems) }

  function buildItemFromForm () {
    var p = pack()
    var f = state.form
    var cats = p.cats.filter(function (c) { return c.id > 0 })
    var brands = p.brands.filter(function (b) { return b !== '全部品牌' })
    var cityList = D.CITIES.filter(function (c) { return c !== '全国' })
    var cat = cats[f.cat]
    var tmpl = p.paramTemplates[cat.id] || [['参数一', ''], ['参数二', '']]
    var specs = tmpl.map(function (t, i) {
      return [t[0], f.params[i] || '—']
    }).filter(function (s) { return s[1] !== '—' })
    specs.push(['所在地', cityList[f.city]])

    var cover = f.images[0] || IMG['eq-1']
    return D.makeDevice({
      id: 'MY' + Date.now(),
      domain: state.domain,
      title: f.title.trim(),
      brand: brands[f.brand],
      model: f.model,
      categoryId: cat.id,
      categoryName: cat.name,
      condition: D.CONDITION_OPTIONS[f.condition],
      year: parseInt(D.YEAR_OPTIONS[f.year], 10),
      useYears: f.useYears,
      registerNo: f.registerNo,
      installIncluded: f.installIncluded,
      warranty: f.warranty,
      price: f.price ? Math.round(Number(f.price) * 10000) : null,
      negotiable: f.negotiable,
      city: cityList[f.city],
      district: '本机演示',
      tagText: '我的',
      tags: ['我的商品'].concat(f.registerNo ? ['注册证有效'] : []).concat(f.installIncluded ? ['含安装调试'] : []),
      specs: specs,
      seller: { name: '我的店铺（示例）', verified: true, count: 1, rate: '100%' },
      cover: cover,
      images: f.images.slice(),
      h: 158,
      distanceKm: 1,
      viewCount: 0,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      desc: [
        '1. ' + (f.year ? D.YEAR_OPTIONS[f.year] + ' 出厂，' : '') + '自用设备转让，手续齐全' +
          (f.registerNo ? '，注册证号 ' + f.registerNo : '') + '。',
        '2. 设备运行正常，已做整机保养；' + (f.installIncluded ? '含安装调试。' : '不含安装，可协助安排。'),
        '3. 支持上门看机、第三方验机，' + (f.negotiable ? '价格可议。' : '一口价。')
      ]
    })
  }

  function submitPublish (isEstimate) {
    var f = state.form
    if (!f.images.length && !isEstimate) return toast('请至少上传 1 张商品图片')
    if (!f.title.trim()) return toast('请填写商品标题')
    if (!f.contact.trim()) return toast('请填写联系人')
    if (!/^1\d{10}$/.test(f.phone.trim())) return toast('请填写正确的手机号')
    if (!isEstimate && !String(f.price).trim()) return toast('请填写期望售价')

    if (isEstimate) {
      var yr = parseInt(D.YEAR_OPTIONS[f.year], 10)
      var base = Math.max(1, 20 - Math.max(0, 2024 - yr) * 2)
      showDialog('估价完成（演示）',
        '参考区间：¥' + base + '–' + (base + 8) + ' 万\n正式版本由平台根据品牌、型号、成色、注册证与近期成交价给出区间。',
        function () { location.hash = '#/seller' })
      return
    }

    if (state.editingId) {
      var idx = state.myItems.map(function (x) { return x.id }).indexOf(state.editingId)
      if (idx > -1) {
        var built = buildItemFromForm()
        built.id = state.editingId
        built.status = state.myItems[idx].status
        built.viewCount = state.myItems[idx].viewCount
        built.mine = true
        state.myItems[idx] = built
        saveMyItems()
      }
      state.form = null
      state.editingId = null
      showDialog('保存成功', '商品信息已更新。', function () { location.hash = '#/seller' })
      return
    }

    var item = buildItemFromForm()
    item.mine = true
    item.status = 'auditing'
    state.myItems.unshift(item)
    saveMyItems()
    state.form = null
    state.editingId = null

    showLead('商品信息已生成', leadDeviceSellText(item), '把这条信息发给牙翼客服（微信），我们审核后帮你上架')

    setTimeout(function () {
      var target = state.myItems.filter(function (x) { return x.id === item.id })[0]
      if (target && target.status === 'auditing') {
        target.status = 'on'
        saveMyItems()
        var cur = parseHash()
        if (cur.name === 'seller' || cur.name === 'home') {
          render()
          toast('审核通过，已上架')
        }
      }
    }, 2000)
  }

  var ACTIONS = {
    nav: function (el) { go(el.dataset.to) },
    tab: function (el) { go(el.dataset.to) },
    back: function () {
      if (history.length > 1) history.back()
      else location.hash = '#/home'
    },
    city: function () {
      showSheet('选择城市', D.CITIES, D.CITIES.indexOf(state.city), function (i) {
        state.city = D.CITIES[i]
        render()
      })
    },
    'home-sort': function (el) { state.homeSort = el.dataset.key; render() },
    'pick-sort': function () {
      state.pick.sort = state.pick.sort === 'distance' ? 'new' : 'distance'
      render()
    },
    'pick-filter': function (el) {
      var p = pack()
      var type = el.dataset.type
      if (type === 'brand') showSheet('品牌', p.brands, state.pick.brand, function (i) { state.pick.brand = i; render() })
      else if (type === 'price') showSheet('价格区间', D.PRICE_RANGES, state.pick.price, function (i) { state.pick.price = i; render() })
      else showSheet('出厂年份', D.YEAR_FILTERS, state.pick.year, function (i) { state.pick.year = i; render() })
    },
    'list-sort': function (el) {
      var k = el.dataset.key
      if (k === 'priceAsc' && state.list.sort === 'priceAsc') state.list.priceDesc = !state.list.priceDesc
      else { state.list.sort = k; state.list.priceDesc = false }
      state.listCount = 8
      render()
    },
    'list-cat': function (el) {
      state.listCount = 8
      location.hash = '#/list?cat=' + el.dataset.id
    },
    'list-more': function () { state.listCount += 8; render() },
    fav: function (el) {
      var id = el.dataset.id
      state.favs[id] = !state.favs[id]
      saveJSON('zm_favs', state.favs)
      toast(state.favs[id] ? '已收藏' : '已取消收藏')
      render()
    },
    call: function () {
      if (CONTACT.phone) location.href = 'tel:' + CONTACT.phone
      else toast('请先在 data.js 里配置客服电话')
    },
    consult: function (el) {
      var id = el && el.dataset ? el.dataset.id : ''
      if (id) {
        var dv = deviceById(id)
        if (dv) return showLead('咨询这台设备', leadDeviceText(dv), '复制后发给牙翼客服微信，或直接打电话')
      }
      showLead('在线咨询',
        '【在线咨询】\n你好，我想咨询牙翼平台上的设备，方便的时候请联系我。',
        '复制后发给牙翼客服微信，或直接打电话')
    },
    'news-tab': function (el) { state.newsTab = el.dataset.tab; render() },
    'open-news': function () { showDialog('资讯详情', '演示环境：正式版本会跳转资讯详情页（富文本 / webview）。') },
    login: function () {
      if (state.user) {
        showSheet('账号', ['退出登录'], -1, function () {
          state.user = null
          saveJSON('zm_user', null)
          render()
        })
      } else {
        state.user = { nickName: '牙翼用户', phone: '138****8888' }
        saveJSON('zm_user', state.user)
        toast('登录成功（演示）')
        render()
      }
    },
    tip: function (el) { showDialog(el.dataset.tip || '功能', '演示环境：这个入口在正式版会跳转到对应页面。') },

    /* 内容域切换 */
    'switch-domain': function () {
      var keys = Object.keys(DOMAINS)
      var cur = keys.indexOf(state.domain)
      showSheet('切换内容域', keys.map(function (k) { return DOMAINS[k].label }), cur, function (i) {
        state.domain = keys[i]
        saveJSON('zm_domain', state.domain)
        state.list.cat = 0
        state.listCount = 8
        toast('已切换到 ' + DOMAINS[state.domain].label)
        render()
      })
    },

    /* 卖家中心 */
    'seller-on': function (el) {
      var it = state.myItems.filter(function (x) { return x.id === el.dataset.id })[0]
      if (it) { it.status = 'on'; saveMyItems(); toast('已上架'); render() }
    },
    'seller-off': function (el) {
      var it = state.myItems.filter(function (x) { return x.id === el.dataset.id })[0]
      if (it) { it.status = 'off'; saveMyItems(); toast('已下架'); render() }
    },
    'seller-del': function (el) {
      var id = el.dataset.id
      showDialog('删除商品', '删除后不可恢复（演示环境仅本机生效）。', function () {
        state.myItems = state.myItems.filter(function (x) { return x.id !== id })
        saveMyItems()
        toast('已删除')
        render()
      }, '确认删除')
    },
    'mine-edit': function (el) { go('publish?edit=' + el.dataset.id) },

    /* 搜索 */
    kw: function (el) { doSearch(el.dataset.kw) },
    'do-search': function () { doSearch() },
    'clear-kw': function () { state.keyword = ''; state.searched = false; render() },
    'clear-history': function () { state.history = []; saveJSON('zm_history', []); render() },

    /* 发布表单 */
    'del-img': function (el) { state.form.images.splice(Number(el.dataset.i), 1); render() },
    upload: function () {
      var inp = document.createElement('input')
      inp.type = 'file'
      inp.accept = 'image/*'
      inp.multiple = true
      inp.addEventListener('change', function () {
        var files = Array.prototype.slice.call(inp.files || []).slice(0, 9 - state.form.images.length)
        if (!files.length) return
        var done = 0
        files.forEach(function (fl) {
          var fr = new FileReader()
          fr.onload = function () {
            state.form.images.push(fr.result)
            if (++done === files.length) render()
          }
          fr.readAsDataURL(fl)
        })
      })
      inp.click()
    },
    'toggle-form': function (el) {
      var t = el.dataset.type
      state.form[t] = !state.form[t]
      render()
    },
    'pick-form': function (el) {
      var p = pack()
      var f = state.form
      var type = el.dataset.type
      if (type === 'cat') {
        var cats = p.cats.filter(function (c) { return c.id > 0 })
        showSheet('设备类目', cats.map(function (c) { return c.name }), f.cat, function (i) { f.cat = i; f.params = ['', '']; render() })
      } else if (type === 'brand') {
        showSheet('品牌', p.brands.filter(function (b) { return b !== '全部品牌' }), f.brand, function (i) { f.brand = i; render() })
      } else if (type === 'cond') {
        showSheet('成色', D.CONDITION_OPTIONS, f.condition, function (i) { f.condition = i; render() })
      } else if (type === 'year') {
        showSheet('出厂年份', D.YEAR_OPTIONS, f.year, function (i) { f.year = i; render() })
      } else {
        showSheet('所在城市', D.CITIES.filter(function (c) { return c !== '全国' }), f.city, function (i) { f.city = i; render() })
      }
    },
    draft: function () { toast('已存草稿（演示）') },
    submit: function (el) { submitPublish(el.dataset.estimate === '1') },

    /* 维修报修 */
    'pick-addr': function () {
      var list = D.REPAIR.addressList
      showSheet('选择地址', list.map(function (a) { return a.title + '（' + a.contact + '）' }), -1, function (i) {
        state.repair.address = list[i]
        render()
      })
    },
    'pick-product': function () {
      showSheet('选择维修产品', D.REPAIR.products, D.REPAIR.products.indexOf(state.repair.product), function (i) {
        state.repair.product = D.REPAIR.products[i]
        render()
      })
    },
    'pick-time': function () {
      showSheet('选择联系时间', D.REPAIR.times, D.REPAIR.times.indexOf(state.repair.time), function (i) {
        state.repair.time = D.REPAIR.times[i]
        render()
      })
    },
    'upload-repair': function () {
      var inp = document.createElement('input')
      inp.type = 'file'
      inp.accept = 'image/*'
      inp.multiple = true
      inp.addEventListener('change', function () {
        var files = Array.prototype.slice.call(inp.files || []).slice(0, 3 - state.repair.images.length)
        if (!files.length) return
        var done = 0
        files.forEach(function (fl) {
          var fr = new FileReader()
          fr.onload = function () {
            state.repair.images.push(fr.result)
            if (++done === files.length) render()
          }
          fr.readAsDataURL(fl)
        })
      })
      inp.click()
    },
    'del-repair-img': function (el) {
      state.repair.images.splice(Number(el.dataset.i), 1)
      render()
    },
    'submit-repair': function () {
      var f = state.repair
      if (!f.product) return toast('请选择维修产品')
      if (!f.time) return toast('请选择联系时间')
      if (!f.desc.trim()) return toast('请描述设备故障情况')
      var d = new Date()
      var oid = 'WX' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) +
        ('000' + (state.orders.length + 1)).slice(-4)
      state.orders.unshift({
        id: oid, status: 'pending', product: f.product, address: f.address,
        time: f.time, desc: f.desc.trim(), images: f.images.slice(),
        createdAt: d.toISOString().slice(0, 16).replace('T', ' ')
      })
      saveJSON('zm_orders', state.orders)
      state.repair = { address: f.address, product: '', time: '', desc: '', images: [] }
      showLead('报修信息已生成', leadRepairText(state.orders[0]),
        '把这条信息发给牙翼客服（微信），我们 2 小时内联系你',
        function () { location.hash = '#/repair-orders' })
    },
    'order-tab': function (el) { state.orderTab = el.dataset.k; render() },
    'do-order-search': function () {
      var el = document.getElementById('odInput')
      state.orderKeyword = el ? el.value : ''
      render()
    },
    'order-cancel': function (el) {
      var id = el.dataset.id
      showDialog('取消报修', '取消后可以重新提交报修。', function () {
        state.orders = state.orders.map(function (o) {
          if (o.id === id) o.status = 'canceled'
          return o
        })
        saveJSON('zm_orders', state.orders)
        toast('已取消')
        render()
      }, '确认取消')
    },

    'add-home': function () {
      showDialog('添加到手机桌面',
        'iPhone：用 Safari 打开 → 底部「分享」按钮 → 添加到主屏幕\n\n安卓：用浏览器打开 → 右上角菜单 → 添加到主屏幕 / 添加到桌面\n\n微信内打开的话，先点右上角「···」→ 在浏览器中打开，再按上面操作。',
        null, '知道了')
    },
    'copy-link': function () {
      var url = location.href.split('#')[0]
      copyText(url).then(function () { toast('链接已复制，去微信粘贴发送') })
        .catch(function () { showLead('复制链接发给对方', url, '长按上面的链接复制') })
    },

    screens: function () {
      showSheet('跳到页面',
        ['屏幕总览（全部 9 页）', '首页', '再美甄选', '设备列表', '设备详情', '发布商品', '我的店铺', '搜索', '资讯', '我的'],
        -1, function (i) {
          var map = ['wall', 'home', 'pick', 'list?cat=1', 'detail?id=DE2001', 'publish', 'seller', 'search', 'news', 'mine']
          location.hash = '#/' + map[i]
        })
    }
  }

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]')
    if (!el || !app.contains(el)) return
    var act = ACTIONS[el.dataset.act]
    if (act) {
      e.preventDefault()
      e.stopPropagation()
      act(el, e)
    }
  })

  /* ---------------- 启动 ---------------- */
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">'
  Object.keys(ICONS).forEach(function (k) {
    sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'
  })
  sprite += '</svg>'
  document.body.insertAdjacentHTML('afterbegin', sprite)

  window.addEventListener('hashchange', function () {
    closeOverlay()
    render()
  })
  if (!location.hash && window.innerWidth >= 900) {
    location.hash = '#/wall'
    return
  }
  render()

  window.__demoReady = true
  window.__demoState = state
  window.__demoDomains = DOMAINS
})()
