/**
 * 演示数据（无后端时使用）
 * 接入真实接口后，只需把 utils/config.js 的 useMock 改为 false
 */

const CITIES = ['全国', '上海', '北京', '广州', '深圳', '杭州', '成都', '南京', '武汉', '西安']

// 六宫格入口
const HOME_CATS = [
  { key: 'second', name: '二手设备', icon: 'shop', cls: 'cat-1', url: '/pages/list/list?cat=1' },
  { key: 'transfer', name: '机构转让', icon: 'doclist', cls: 'cat-2', url: '/pages/list/list?cat=6' },
  { key: 'repair', name: '维修保养', icon: 'medbag', cls: 'cat-3', url: '/pages/list/list?cat=7' },
  { key: 'pick', name: '再美甄选', icon: 'star', cls: 'cat-4', url: '/pages/pick/pick' },
  { key: 'sell', name: '我要卖机', icon: 'tag', cls: 'cat-5', url: '/pages/publish/publish' },
  { key: 'estimate', name: '免费估价', icon: 'money', cls: 'cat-6', url: '/pages/publish/publish?from=estimate' }
]

// 设备分类（列表页 chips）
const CATEGORIES = [
  { id: 0, name: '全部' },
  { id: 1, name: '激光设备' },
  { id: 2, name: '射频设备' },
  { id: 3, name: '注射类' },
  { id: 4, name: '塑形减脂' },
  { id: 5, name: '检测设备' },
  { id: 6, name: '机构转让' },
  { id: 7, name: '维修保养' }
]

const BRANDS = ['全部品牌', 'Lumenis 科医人', '赛诺龙 Candela', '飞顿 Alma', '半岛', '欧洲之星 Fotona', '路创丽', '索塔 热玛吉']
const PRICE_RANGES = ['不限价格', '10 万以下', '10-30 万', '30-60 万', '60 万以上']
const YEARS = ['不限年份', '2023 年后', '2021-2022', '2019-2020', '2019 前']

const CONDITIONS = ['7成新', '8成新', '9成新', '9.9新']

const RAW = [
  {
    title: '科医人 M22 超光子 王者之心 2022 款 含备用主机头',
    brand: 'Lumenis 科医人', model: 'M22', cat: '激光设备',
    condition: '9成新', year: 2022, price: 580000, negotiable: true,
    city: '上海', district: '浦东新区', pick: true, tagText: '甄选',
    tags: ['平台核验', '可开发票', '支持验机'], h: 320, distanceKm: 3,
    seller: { name: '上海星辰医美门诊部', verified: true, count: 12, rate: '98%' }
  },
  {
    title: '赛诺龙 超皮秒 Picoway 五代 含手具',
    brand: '赛诺龙 Candela', model: 'Picoway', cat: '激光设备',
    condition: '8成新', year: 2021, price: 420000, negotiable: true,
    city: '北京', district: '朝阳区', pick: false, tagText: '在售',
    tags: ['整机保养', '配件齐全'], h: 350, distanceKm: 1068,
    seller: { name: '北京悦颜医疗美容', verified: true, count: 8, rate: '96%' }
  },
  {
    title: '半岛 超声炮 全脸抗衰 三代',
    brand: '半岛', model: 'ULTRA', cat: '射频设备',
    condition: '9成新', year: 2023, price: 168000, negotiable: true,
    city: '广州', district: '天河区', pick: false, tagText: '急出',
    tags: ['一台一价', '可议价'], h: 300, distanceKm: 1210,
    seller: { name: '广州荟美医疗门诊', verified: false, count: 3, rate: '100%' }
  },
  {
    title: '飞顿 黑金超光子 DPL 平台',
    brand: '飞顿 Alma', model: 'DPL', cat: '激光设备',
    condition: '8成新', year: 2020, price: 215000, negotiable: true,
    city: '成都', district: '武侯区', pick: false, tagText: '在售',
    tags: ['机构转让', '可看机'], h: 330, distanceKm: 1660,
    seller: { name: '成都锦美医疗美容', verified: true, count: 5, rate: '95%' }
  },
  {
    title: '路创丽 Cooltech 冷冻减脂仪',
    brand: '路创丽', model: 'Cooltech', cat: '塑形减脂',
    condition: '8成新', year: 2020, price: 98000, negotiable: true,
    city: '杭州', district: '西湖区', pick: true, tagText: '甄选',
    tags: ['含耗材', '可开发票'], h: 310, distanceKm: 175,
    seller: { name: '杭州素颜医疗', verified: false, count: 2, rate: '99%' }
  },
  {
    title: '欧洲之星 Fotona 4D 口腔全能版',
    brand: '欧洲之星 Fotona', model: 'SP Dynamis', cat: '激光设备',
    condition: '9成新', year: 2022, price: 268000, negotiable: false,
    city: '深圳', district: '南山区', pick: true, tagText: '甄选',
    tags: ['平台核验', '出质检报告'], h: 340, distanceKm: 1342,
    seller: { name: '深圳轻医美连锁', verified: true, count: 9, rate: '97%' }
  },
  {
    title: '德玛莎 水光仪 四代 全自动',
    brand: '德玛莎', model: 'Derma Shine', cat: '注射类',
    condition: '9成新', year: 2023, price: 46000, negotiable: true,
    city: '上海', district: '徐汇区', pick: false, tagText: '在售',
    tags: ['配件齐全'], h: 290, distanceKm: 8,
    seller: { name: '上海妍美皮肤管理', verified: false, count: 1, rate: '100%' }
  },
  {
    title: '索塔 热玛吉 五代 FLX 探头含两支',
    brand: '索塔 热玛吉', model: 'Thermage FLX', cat: '射频设备',
    condition: '8成新', year: 2021, price: 388000, negotiable: true,
    city: '北京', district: '海淀区', pick: true, tagText: '甄选',
    tags: ['平台核验', '支持验机'], h: 315, distanceKm: 1068,
    seller: { name: '北京丽格医美', verified: true, count: 15, rate: '98%' }
  },
  {
    title: '医用红蓝光治疗仪 蓝光祛痘',
    brand: '康普', model: 'LED-200', cat: '检测设备',
    condition: '7成新', year: 2019, price: null, negotiable: true,
    city: '武汉', district: '江汉区', pick: false, tagText: '可议价',
    tags: ['低价转让'], h: 296, distanceKm: 830,
    seller: { name: '武汉芯美皮肤诊所', verified: false, count: 2, rate: '93%' }
  },
  {
    title: 'Endymed 黄金微针 相控射频',
    brand: 'Endymed', model: 'Intensif', cat: '射频设备',
    condition: '9成新', year: 2022, price: 88000, negotiable: true,
    city: '南京', district: '建邺区', pick: true, tagText: '甄选',
    tags: ['整机保养'], h: 325, distanceKm: 270,
    seller: { name: '南京笙美医疗美容', verified: true, count: 4, rate: '96%' }
  },
  {
    title: 'VISIA 7 皮肤检测仪 含分析工作站',
    brand: 'Canfield', model: 'VISIA 7', cat: '检测设备',
    condition: '8成新', year: 2021, price: 62000, negotiable: true,
    city: '西安', district: '雁塔区', pick: false, tagText: '在售',
    tags: ['含工作站'], h: 305, distanceKm: 1480,
    seller: { name: '西安予美医疗美容', verified: false, count: 1, rate: '100%' }
  },
  {
    title: '德仕 麻醉机 DR-808 含监护',
    brand: '德仕', model: 'DR-808', cat: '机构转让',
    condition: '8成新', year: 2024, price: null, negotiable: true,
    city: '长沙', district: '岳麓区', pick: false, tagText: '机构转让',
    tags: ['机构转让', '可开票'], h: 336, distanceKm: 1080,
    seller: { name: '长沙星雅整形医院', verified: true, count: 6, rate: '99%' }
  }
]

const DEVICES = RAW.map((r, i) => {
  const coverIdx = (i % 8) + 1
  return {
    id: 'EQ' + (1001 + i),
    title: r.title,
    brand: r.brand,
    model: r.model,
    categoryName: r.cat,
    categoryId: (CATEGORIES.find(c => c.name === r.cat) || { id: 0 }).id,
    condition: r.condition,
    year: r.year,
    price: r.price,
    negotiable: r.negotiable,
    city: r.city,
    district: r.district,
    isPick: r.pick,
    tagText: r.tagText,
    tags: r.tags,
    h: r.h,
    distanceKm: r.distanceKm,
    seller: r.seller,
    viewCount: 320 + i * 137,
    cover: '/assets/images/eq-' + coverIdx + '.png',
    images: [
      '/assets/images/eq-' + coverIdx + '.png',
      '/assets/images/eq-' + ((i + 2) % 8 + 1) + '.png',
      '/assets/images/eq-' + ((i + 4) % 8 + 1) + '.png'
    ],
    desc: [
      '1. ' + r.year + ' 年采购行货，正规渠道导入，手续齐全，可提供采购凭证与发票。',
      '2. 设备运行正常，' + r.model + ' 各项功能测试通过，已做整机保养。',
      '3. 因门诊升级设备转让，支持上门看机、第三方验机，可协助安排物流发货。'
    ],
    createdAt: `2024-0${(i % 9) + 1}-1${i % 9} 10:00:00`
  }
})

const NEWS = [
  {
    id: 'N1',
    tab: 'weekly',
    title: '医美周报｜第十三期：全球认证 + 国货突破，医美硬实力进阶',
    author: '再美网',
    likes: 1,
    views: '2,318',
    cover: 'weekly'
  },
  {
    id: 'N2',
    tab: 'weekly',
    title: '医美周报｜第十二期：明星资本入局，医美新品扎堆来袭',
    author: '再美网',
    likes: 3,
    views: '1,876',
    cover: 'weekly'
  },
  {
    id: 'N3',
    tab: 'company',
    title: '再美甄选上线：每台设备出质检报告，二手医美设备也能“无忧购”',
    author: '再美网',
    likes: 12,
    views: '5,042',
    cover: 'company'
  }
]

const HOT_WORDS = ['M22 超光子', '紧致提升', '皮秒', '水光针仪', '光子嫩肤', '皮秒祛斑', '黄金微针', '红光治疗仪']

const RANK = [
  { name: '科医人 M22 王者之心', count: 2318 },
  { name: '赛诺龙 超皮秒 Picoway', count: 1876 },
  { name: '半岛 超声炮', count: 1542 },
  { name: '飞顿 黑金超光子', count: 1097 },
  { name: '路创丽 冷冻减脂仪', count: 864 }
]

module.exports = {
  CITIES,
  HOME_CATS,
  CATEGORIES,
  BRANDS,
  PRICE_RANGES,
  YEARS,
  CONDITIONS,
  DEVICES,
  NEWS,
  HOT_WORDS,
  RANK
}
