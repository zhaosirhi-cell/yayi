/* =============================================================
 * 内容域数据包
 *   dental     —— 牙科（当前默认）
 *   aesthetic  —— 旧医美（整包保留，仅隐藏，可通过“内容域切换”回看）
 *   两包结构完全一致，页面只认当前域，不做任何删除
 * ============================================================= */
(function (global) {
  'use strict'

  var CITIES = ['全国', '上海', '北京', '广州', '深圳', '杭州', '成都', '南京', '武汉', '西安']
  var CONDITION_OPTIONS = ['7成新', '8成新', '9成新', '9.9新']
  var YEAR_OPTIONS = []
  for (var y = 2024; y >= 2010; y--) YEAR_OPTIONS.push(y + ' 年')

  /* ---------------- 设备字段补齐 ---------------- */
  function makeDevice (o) {
    var d = {
      id: o.id,
      domain: o.domain,
      title: o.title,
      brand: o.brand || '',
      model: o.model || '',
      categoryId: o.categoryId,
      categoryName: o.categoryName,
      condition: o.condition || '',
      year: o.year || null,
      useYears: o.useYears || '',
      registerNo: o.registerNo || '',
      installIncluded: o.installIncluded !== false,
      warranty: o.warranty || '',
      price: o.price === undefined ? null : o.price,
      negotiable: o.negotiable !== false,
      city: o.city,
      district: o.district || '',
      isPick: !!o.isPick,
      tagText: o.tagText || '在售',
      tags: o.tags || [],
      specs: o.specs || [],
      desc: o.desc || [],
      h: o.h || 160,
      distanceKm: o.distanceKm || 0,
      viewCount: o.viewCount || 120,
      createdAt: o.createdAt || '2024-08-01 10:00:00',
      cover: o.cover,
      images: o.images,
      seller: o.seller || { name: '牙翼认证卖家', verified: true, count: 1, rate: '99%' }
    }
    if (!d.images) d.images = [d.cover]
    return d
  }

  /* =============================================================
   * 牙科
   * ============================================================= */
  var DENTAL_CATS = [
    { id: 0, name: '全部' },
    { id: 1, name: '牙科综合治疗台' },
    { id: 2, name: '影像设备' },
    { id: 3, name: '种植设备' },
    { id: 4, name: '消毒灭菌' },
    { id: 5, name: '器械耗材' },
    { id: 6, name: '诊所整体转让' },
    { id: 7, name: '维修保养' }
  ]

  // 发布商品时按类目给出的两个专属参数（淘宝式的“类目模板”）
  var DENTAL_PARAM_TEMPLATES = {
    1: [['椅位数', '如 2 台'], ['水电气要求', '如 三相电 + 0.6MPa 气压']],
    2: [['视野 FOV', '如 15×15cm'], ['球管累计曝光', '如 3.2 万次']],
    3: [['扭矩范围', '如 5–70 N·cm'], ['接口类型', '如 NSK / 卡瓦']],
    4: [['灭菌等级 / 容积', '如 B 类 60L'], ['最近生物监测', '如 2024-06']],
    5: [['接口类型', '如 NSK 快速接口'], ['能否高温高压灭菌', '如 可']],
    6: [['转让范围', '如 设备 + 装修 + 证照'], ['牙椅数量', '如 4 台']],
    7: [['服务类型', '如 整机保养 / 年保'], ['响应时长', '如 48 小时内']]
  }

  var DENTAL_DEVICES = [
    makeDevice({
      id: 'DE2001', domain: 'dental', categoryId: 1, categoryName: '牙科综合治疗台',
      title: '卡瓦 KaVo Estetica E70 牙科综合治疗台 双椅位 含医生椅',
      brand: 'KaVo 卡瓦', model: 'Estetica E70', condition: '9成新', year: 2021, useYears: '使用约 3 年',
      registerNo: '国械注进 20173061234', installIncluded: true, warranty: '原厂保修剩余 8 个月',
      price: 280000, city: '上海', district: '徐汇区', isPick: true, tagText: '甄选',
      tags: ['注册证有效', '含安装调试', '可开发票'], h: 160, distanceKm: 5,
      specs: [['椅位数', '2 台'], ['标配', '口腔灯 / 痰盂 / 洁牙机'], ['水电气', '三相电 + 0.6MPa 气压'], ['附件', '医生椅 2、助手椅 2'], ['使用年限', '约 3 年'], ['所在地', '上海 徐汇']],
      seller: { name: '上海齿悦口腔门诊部', verified: true, count: 12, rate: '98%' }
    }),
    makeDevice({
      id: 'DE2002', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '登士柏西诺德 Axeos 口腔 CBCT 三合一',
      brand: 'Dentsply Sirona 登士柏西诺德', model: 'Axeos', condition: '8成新', year: 2019, useYears: '球管曝光 3.2 万次',
      registerNo: '国械注进 20163051208', installIncluded: true, warranty: '已过保，可平台延保',
      price: 680000, city: '北京', district: '朝阳区', isPick: false, tagText: '在售',
      tags: ['软件授权可转移', '含机房方案', '支持验机'], h: 175, distanceKm: 1068,
      specs: [['视野 FOV', '15×15cm'], ['分辨率', '0.075mm'], ['球管累计曝光', '3.2 万次'], ['软件授权', '可转移至新主体'], ['机房要求', '约 6㎡，含铅防护'], ['所在地', '北京 朝阳']],
      seller: { name: '北京悦齿医疗美容门诊', verified: true, count: 8, rate: '96%' }
    }),
    makeDevice({
      id: 'DE2003', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '朗视 LargeV Smart3D-X CBCT 全景一体机',
      brand: 'LargeV 朗视', model: 'Smart3D-X', condition: '9成新', year: 2022, useYears: '使用约 2 年',
      registerNo: '国械注准 20203061234', installIncluded: true, warranty: '原厂保修剩余 14 个月',
      price: 450000, city: '深圳', district: '南山区', isPick: true, tagText: '甄选',
      tags: ['注册证有效', '国产行货', '含安装'], h: 150, distanceKm: 1342,
      specs: [['视野 FOV', '16×9cm'], ['分辨率', '0.09mm'], ['球管累计曝光', '1.1 万次'], ['软件授权', '随机转移'], ['机房要求', '约 4㎡'], ['所在地', '深圳 南山']],
      seller: { name: '深圳齿科连锁（南山店）', verified: true, count: 9, rate: '97%' }
    }),
    makeDevice({
      id: 'DE2004', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '怡友 Ewoo Green X 口腔全景机',
      brand: 'Ewoo 怡友', model: 'Green X', condition: '8成新', year: 2020, useYears: '使用约 4 年',
      registerNo: '国械注进 20183061234', installIncluded: true, warranty: '已过保',
      price: 128000, city: '广州', district: '天河区', isPick: false, tagText: '急出',
      tags: ['整机保养', '配件齐全'], h: 165, distanceKm: 1210,
      specs: [['类型', '全景 / 头颅'], ['分辨率', '0.1mm'], ['球管累计曝光', '5.6 万次'], ['软件授权', '随机转移'], ['所在地', '广州 天河']],
      seller: { name: '广州德齿口腔', verified: false, count: 3, rate: '100%' }
    }),
    makeDevice({
      id: 'DE2005', domain: 'dental', categoryId: 3, categoryName: '种植设备',
      title: 'NSK Surgic Pro 种植机 含马达与脚踏',
      brand: 'NSK', model: 'Surgic Pro', condition: '9成新', year: 2022, useYears: '使用约 2 年',
      registerNo: '国械注进 20183041234', installIncluded: false, warranty: '原厂保修剩余 6 个月',
      price: 56000, city: '成都', district: '武侯区', isPick: true, tagText: '甄选',
      tags: ['注册证有效', '含马达', '可验机'], h: 155, distanceKm: 1660,
      specs: [['扭矩范围', '5–70 N·cm'], ['接口类型', 'NSK / 卡瓦通用'], ['含马达', '2 支'], ['配套', '脚踏 + 支架'], ['所在地', '成都 武侯']],
      seller: { name: '成都锦齿口腔', verified: true, count: 5, rate: '95%' }
    }),
    makeDevice({
      id: 'DE2006', domain: 'dental', categoryId: 4, categoryName: '消毒灭菌',
      title: '蓝野 Runyes SEA 60L B 级高压灭菌器',
      brand: 'Runyes 蓝野', model: 'SEA-60L', condition: '8成新', year: 2021, useYears: '灭菌循环约 1800 次',
      registerNo: '国械注准 20172571234', installIncluded: false, warranty: '已过保',
      price: 18000, city: '杭州', district: '西湖区', isPick: false, tagText: '在售',
      tags: ['含生物监测报告', '可开发票'], h: 148, distanceKm: 175,
      specs: [['灭菌等级 / 容积', 'B 类 60L'], ['最近生物监测', '2024-06 通过'], ['使用次数', '约 1800 次'], ['附件', '托盘 4 个'], ['所在地', '杭州 西湖']],
      seller: { name: '杭州素齿口腔', verified: false, count: 2, rate: '99%' }
    }),
    makeDevice({
      id: 'DE2007', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '3Shape TRIOS 3 口内扫描仪 含移动推车',
      brand: '3Shape', model: 'TRIOS 3', condition: '8成新', year: 2020, useYears: '使用约 4 年',
      registerNo: '国械注进 20183021234', installIncluded: false, warranty: '已过保',
      price: 96000, city: '北京', district: '海淀区', isPick: true, tagText: '甄选',
      tags: ['含软件授权', '可演示', '平台核验'], h: 170, distanceKm: 1068,
      specs: [['类型', '口内扫描仪'], ['扫描精度', '约 20μm'], ['软件授权', 'TRIOS 账号可转移'], ['配件', '移动推车 + 校准件'], ['所在地', '北京 海淀']],
      seller: { name: '北京丽齿口腔门诊', verified: true, count: 15, rate: '98%' }
    }),
    makeDevice({
      id: 'DE2008', domain: 'dental', categoryId: 1, categoryName: '牙科综合治疗台',
      title: '菲曼特 Fimet F1 牙科治疗台 单椅位',
      brand: 'Fimet 菲曼特', model: 'F1', condition: '7成新', year: 2018, useYears: '使用约 6 年',
      registerNo: '国械注进 20153061234', installIncluded: true, warranty: '无',
      price: 65000, city: '武汉', district: '江汉区', isPick: false, tagText: '可议价',
      tags: ['低价转让', '可看机'], h: 152, distanceKm: 830,
      specs: [['椅位数', '1 台'], ['标配', '口腔灯 / 痰盂'], ['水电气', '单相电 + 0.5MPa'], ['附件', '医生椅 1'], ['所在地', '武汉 江汉']],
      seller: { name: '武汉芯齿口腔诊所', verified: false, count: 2, rate: '93%' }
    }),
    makeDevice({
      id: 'DE2009', domain: 'dental', categoryId: 5, categoryName: '器械耗材',
      title: '啄木鸟 Woodpecker 超声骨刀 含手柄与工作尖',
      brand: 'Woodpecker 啄木鸟', model: 'Surgy-Bone', condition: '9成新', year: 2023, useYears: '使用不足 1 年',
      registerNo: '国械注准 20203011234', installIncluded: false, warranty: '原厂保修剩余 10 个月',
      price: 12000, city: '南京', district: '建邺区', isPick: false, tagText: '在售',
      tags: ['含工作尖', '注册证有效'], h: 145, distanceKm: 270,
      specs: [['接口类型', '啄木鸟原厂'], ['能否高温高压灭菌', '手柄可灭菌'], ['含工作尖', '6 支'], ['所在地', '南京 建邺']],
      seller: { name: '南京笙齿口腔', verified: true, count: 4, rate: '96%' }
    }),
    makeDevice({
      id: 'DE2010', domain: 'dental', categoryId: 1, categoryName: '牙科综合治疗台',
      title: '西诺 Sinol 连体式牙科椅 4 台打包转让',
      brand: 'Sinol 西诺', model: 'S2316', condition: '8成新', year: 2020, useYears: '使用约 4 年',
      registerNo: '国械注准 20193071234', installIncluded: true, warranty: '无',
      price: null, city: '西安', district: '雁塔区', isPick: false, tagText: '打包出',
      tags: ['4 台打包', '含安装'], h: 158, distanceKm: 1480,
      specs: [['椅位数', '4 台'], ['标配', '口腔灯 / 痰盂 / 洁牙机'], ['水电气', '三相电 + 0.6MPa'], ['打包说明', '整批出，不单卖'], ['所在地', '西安 雁塔']],
      seller: { name: '西安予齿口腔门诊', verified: false, count: 1, rate: '100%' }
    }),
    makeDevice({
      id: 'DE2011', domain: 'dental', categoryId: 6, categoryName: '诊所整体转让',
      title: '深圳南山口腔门诊部整店转让（4 台牙椅 + CBCT + 装修 + 证照）',
      brand: '整店转让', model: '—', condition: '8成新', year: 2019, useYears: '经营 5 年，稳定客源',
      registerNo: '医疗机构执业许可证在有效期', installIncluded: true, warranty: '—',
      price: null, city: '深圳', district: '南山区', isPick: true, tagText: '整店转让',
      tags: ['含证照', '含装修', '可接续经营'], h: 168, distanceKm: 1342,
      specs: [['转让范围', '设备 + 装修 + 证照 + 客源'], ['牙椅数量', '4 台'], ['设备清单', 'CBCT、口扫、灭菌器、种植机'], ['面积', '约 320㎡'], ['所在地', '深圳 南山']],
      seller: { name: '深圳南山齿科（转让方）', verified: true, count: 6, rate: '99%' }
    }),
    makeDevice({
      id: 'DE2012', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '卡瓦 KaVo DEXIS 数字牙片机 含传感器',
      brand: 'KaVo 卡瓦', model: 'DEXIS', condition: '8成新', year: 2019, useYears: '使用约 5 年',
      registerNo: '国械注进 20173021234', installIncluded: false, warranty: '已过保',
      price: 38000, city: '上海', district: '浦东新区', isPick: false, tagText: '在售',
      tags: ['含传感器', '软件可转移'], h: 162, distanceKm: 8,
      specs: [['类型', '口内数字牙片'], ['传感器尺寸', '2 号'], ['软件授权', '可转移'], ['所在地', '上海 浦东']],
      seller: { name: '上海星辰齿科', verified: true, count: 12, rate: '98%' }
    }),
    makeDevice({
      id: 'DE2013', domain: 'dental', categoryId: 5, categoryName: '器械耗材',
      title: 'VDW Gold Reciproc 根管马达',
      brand: 'VDW', model: 'Gold Reciproc', condition: '9成新', year: 2022, useYears: '使用不足 2 年',
      registerNo: '国械注进 20183011234', installIncluded: false, warranty: '原厂保修剩余 4 个月',
      price: 4800, city: '长沙', district: '岳麓区', isPick: false, tagText: '在售',
      tags: ['含锉针', '可验机'], h: 146, distanceKm: 1080,
      specs: [['接口类型', 'NSK 快速接口'], ['能否高温高压灭菌', '机身可灭菌'], ['含锉针', '2 盒'], ['所在地', '长沙 岳麓']],
      seller: { name: '长沙星齿口腔', verified: true, count: 6, rate: '99%' }
    }),
    makeDevice({
      id: 'DE2014', domain: 'dental', categoryId: 2, categoryName: '影像设备',
      title: '普兰梅卡 Planmeca ProMax 3D Plus CBCT',
      brand: 'Planmeca 普兰梅卡', model: 'ProMax 3D Plus', condition: '9成新', year: 2021, useYears: '球管曝光 1.8 万次',
      registerNo: '国械注进 20183061234', installIncluded: true, warranty: '原厂保修剩余 12 个月',
      price: 850000, city: '上海', district: '静安区', isPick: true, tagText: '甄选',
      tags: ['注册证有效', '含机房方案', '支持验机'], h: 170, distanceKm: 6,
      specs: [['视野 FOV', '20×17cm'], ['分辨率', '0.075mm'], ['球管累计曝光', '1.8 万次'], ['软件授权', 'Roman 软件可转移'], ['所在地', '上海 静安']],
      seller: { name: '上海静安齿科中心', verified: true, count: 21, rate: '99%' }
    }),
    makeDevice({
      id: 'DE2015', domain: 'dental', categoryId: 5, categoryName: '器械耗材',
      title: '啄木鸟 UDS-E 超声洁牙机 含工作尖',
      brand: 'Woodpecker 啄木鸟', model: 'UDS-E', condition: '8成新', year: 2021, useYears: '使用约 3 年',
      registerNo: '国械注准 20193011234', installIncluded: false, warranty: '无',
      price: 3200, city: '杭州', district: '拱墅区', isPick: false, tagText: '可议价',
      tags: ['含工作尖', '整机保养'], h: 150, distanceKm: 175,
      specs: [['接口类型', '啄木鸟原厂'], ['能否高温高压灭菌', '手柄可灭菌'], ['含工作尖', '4 支'], ['所在地', '杭州 拱墅']],
      seller: { name: '杭州素齿口腔', verified: false, count: 2, rate: '99%' }
    }),
    makeDevice({
      id: 'DE2016', domain: 'dental', categoryId: 7, categoryName: '维修保养',
      title: '牙科综合治疗台整机保养年保服务（含 4 次上门）',
      brand: '平台服务', model: '年保套餐', condition: '服务', year: null, useYears: '按年签约',
      registerNo: '—', installIncluded: true, warranty: '服务期内',
      price: 12000, city: '上海', district: '全城', isPick: false, tagText: '服务',
      tags: ['48 小时响应', '含易损件', '可开票'], h: 155, distanceKm: 3,
      specs: [['服务类型', '整机保养 + 年保'], ['响应时长', '48 小时内上门'], ['服务次数', '4 次 / 年'], ['含配件', '易损件免费更换'], ['服务区域', '上海 全城']],
      seller: { name: '牙翼认证服务商 · 沪齿维保', verified: true, count: 3, rate: '99%' }
    })
  ].map(function (d, i) {
    var idx = (i % 8) + 1
    d.cover = IMG['eq-' + idx]
    d.images = [IMG['eq-' + idx], IMG['eq-' + (((i + 2) % 8) + 1)], IMG['eq-' + (((i + 4) % 8) + 1)]]
    d.viewCount = 260 + i * 173
    d.createdAt = '2024-0' + ((i % 8) + 1) + '-1' + (i % 9) + ' 10:00:00'
    if (!d.desc.length) {
      d.desc = [
        '1. ' + (d.year ? d.year + ' 年装机，' : '') + '正规渠道采购，手续齐全，可提供采购凭证与发票。',
        '2. 设备运行正常，' + (d.model || d.brand) + ' 各项功能测试通过，已做整机保养。',
        '3. 因诊所升级设备转让，支持上门看机、第三方验机，可协助安排物流与安装。'
      ]
    }
    return d
  })

  /* =============================================================
   * 旧医美内容（整包保留，默认隐藏）
   * ============================================================= */
  var AES_CATS = [
    { id: 0, name: '全部' },
    { id: 1, name: '激光设备' },
    { id: 2, name: '射频设备' },
    { id: 3, name: '注射类' },
    { id: 4, name: '塑形减脂' },
    { id: 5, name: '检测设备' },
    { id: 6, name: '机构转让' },
    { id: 7, name: '维修保养' }
  ]

  var AES_RAW = [
    ['科医人 M22 超光子 王者之心 2022 款 含备用主机头', 'Lumenis 科医人', 'M22', '激光设备', '9成新', 2022, 580000, '上海', '浦东新区', true, '甄选', ['平台核验', '可开发票', '支持验机'], 160, 3, '上海星辰医美门诊部', true, 12, '98%'],
    ['赛诺龙 超皮秒 Picoway 五代 含手具', '赛诺龙 Candela', 'Picoway', '激光设备', '8成新', 2021, 420000, '北京', '朝阳区', false, '在售', ['整机保养', '配件齐全'], 175, 1068, '北京悦颜医疗美容', true, 8, '96%'],
    ['半岛 超声炮 全脸抗衰 三代', '半岛', 'ULTRA', '射频设备', '9成新', 2023, 168000, '广州', '天河区', false, '急出', ['一台一价', '可议价'], 150, 1210, '广州荟美医疗门诊', false, 3, '100%'],
    ['飞顿 黑金超光子 DPL 平台', '飞顿 Alma', 'DPL', '激光设备', '8成新', 2020, 215000, '成都', '武侯区', false, '在售', ['机构转让', '可看机'], 165, 1660, '成都锦美医疗美容', true, 5, '95%'],
    ['路创丽 Cooltech 冷冻减脂仪', '路创丽', 'Cooltech', '塑形减脂', '8成新', 2020, 98000, '杭州', '西湖区', true, '甄选', ['含耗材', '可开发票'], 155, 175, '杭州素颜医疗', false, 2, '99%'],
    ['欧洲之星 Fotona 4D 口腔全能版', '欧洲之星 Fotona', 'SP Dynamis', '激光设备', '9成新', 2022, 268000, '深圳', '南山区', true, '甄选', ['平台核验', '出质检报告'], 170, 1342, '深圳轻医美连锁', true, 9, '97%'],
    ['德玛莎 水光仪 四代 全自动', '德玛莎', 'Derma Shine', '注射类', '9成新', 2023, 46000, '上海', '徐汇区', false, '在售', ['配件齐全'], 145, 8, '上海妍美皮肤管理', false, 1, '100%'],
    ['索塔 热玛吉 五代 FLX 探头含两支', '索塔 热玛吉', 'Thermage FLX', '射频设备', '8成新', 2021, 388000, '北京', '海淀区', true, '甄选', ['平台核验', '支持验机'], 158, 1068, '北京丽格医美', true, 15, '98%'],
    ['医用红蓝光治疗仪 蓝光祛痘', '康普', 'LED-200', '检测设备', '7成新', 2019, null, '武汉', '江汉区', false, '可议价', ['低价转让'], 148, 830, '武汉芯美皮肤诊所', false, 2, '93%'],
    ['Endymed 黄金微针 相控射频', 'Endymed', 'Intensif', '射频设备', '9成新', 2022, 88000, '南京', '建邺区', true, '甄选', ['整机保养'], 162, 270, '南京笙美医疗美容', true, 4, '96%'],
    ['VISIA 7 皮肤检测仪 含分析工作站', 'Canfield', 'VISIA 7', '检测设备', '8成新', 2021, 62000, '西安', '雁塔区', false, '在售', ['含工作站'], 152, 1480, '西安予美医疗美容', false, 1, '100%'],
    ['德仕 麻醉机 DR-808 含监护', '德仕', 'DR-808', '机构转让', '8成新', 2024, null, '长沙', '岳麓区', false, '机构转让', ['机构转让', '可开票'], 168, 1080, '长沙星雅整形医院', true, 6, '99%']
  ]

  var AES_DEVICES = AES_RAW.map(function (r, i) {
    var catId = (AES_CATS.filter(function (c) { return c.name === r[3] })[0] || { id: 0 }).id
    var d = makeDevice({
      id: 'EQ' + (1001 + i), domain: 'aesthetic',
      title: r[0], brand: r[1], model: r[2], categoryId: catId, categoryName: r[3],
      condition: r[4], year: r[5], price: r[6], city: r[7], district: r[8],
      isPick: r[9], tagText: r[10], tags: r[11], h: r[12], distanceKm: r[13],
      seller: { name: r[14], verified: r[15], count: r[16], rate: r[17] },
      registerNo: '国械注进 20' + (16 + (i % 6)) + '30123' + (10 + i),
      installIncluded: true, warranty: i % 3 === 0 ? '原厂保修剩余 6 个月' : '已过保',
      specs: [
        ['品牌', r[1]], ['型号', r[2]], ['设备分类', r[3]],
        ['出厂年份', r[5] + ' 年'], ['成色', r[4]], ['使用情况', '正常使用'],
        ['配件', '齐全'], ['所在地', r[7] + ' ' + r[8]]
      ],
      viewCount: 320 + i * 137,
      createdAt: '2024-0' + ((i % 9) + 1) + '-1' + (i % 9) + ' 10:00:00'
    })
    d.cover = IMG['eq-' + ((i % 8) + 1)]
    d.images = [d.cover, IMG['eq-' + (((i + 2) % 8) + 1)], IMG['eq-' + (((i + 4) % 8) + 1)]]
    d.desc = [
      '1. ' + r[5] + ' 年采购行货，正规渠道导入，手续齐全，可提供采购凭证与发票。',
      '2. 设备运行正常，' + r[2] + ' 各项功能测试通过，已做整机保养。',
      '3. 因门诊升级设备转让，支持上门看机、第三方验机，可协助安排物流发货。'
    ]
    return d
  })

  /* =============================================================
   * 两个内容域
   * ============================================================= */
  var DOMAINS = {
    dental: {
      key: 'dental',
      label: '牙科版',
      brandName: '牙翼',
      platformTag: '二手牙科设备买卖平台',
      bannerTitle: '牙翼<em>甄选</em>·无忧购',
      bannerSub: ['注册证可查', '出检测报告', '支持上门验机'],
      homeCats: [
        { name: '牙科治疗台', icon: 'shop', cls: 'cat-1', to: 'list?cat=1' },
        { name: '影像设备', icon: 'camera', cls: 'cat-2', to: 'list?cat=2' },
        { name: '种植设备', icon: 'medbag', cls: 'cat-3', to: 'list?cat=3' },
        { name: '消毒灭菌', icon: 'shield', cls: 'cat-4', to: 'list?cat=4' },
        { name: '器械耗材', icon: 'tag', cls: 'cat-5', to: 'list?cat=5' },
        { name: '整体转让', icon: 'doclist', cls: 'cat-6', to: 'list?cat=6' }
      ],
      quickActions: [
        { name: '我要卖机', icon: 'plus', desc: '自主上架设备', to: 'publish' },
        { name: '免费估价', icon: 'money', desc: '先估价再挂牌', to: 'publish?from=estimate' },
        { name: '维修报修', icon: 'wrench', desc: '48 小时上门', to: 'repair' }
      ],
      cats: DENTAL_CATS,
      brands: ['全部品牌', 'KaVo 卡瓦', 'Dentsply Sirona 登士柏西诺德', 'Planmeca 普兰梅卡', 'Ewoo 怡友', 'LargeV 朗视', 'Runyes 蓝野', 'Sinol 西诺', 'Fimet 菲曼特', '3Shape', 'NSK', 'Woodpecker 啄木鸟', 'VDW'],
      notice: '平台已完成 862 台牙科设备核验 · 今日新上架 23 台',
      pickNote: '甄选好机：注册证核验 · 出检测报告 · 支持无忧购',
      guarantee: [['shield', '注册证核验'], ['check', '出检测报告'], ['chat', '可上门验机']],
      newsTabs: [{ k: 'all', t: '全部' }, { k: 'weekly', t: '口腔周报' }, { k: 'company', t: '公司新闻' }],
      news: [
        { id: 'N1', tab: 'weekly', title: '口腔设备周报｜第十三期：种植集采落地一年，诊所设备升级方向变了', likes: 4 },
        { id: 'N2', tab: 'weekly', title: '口腔设备周报｜第十二期：数字化口腔渗透率破 40%，CBCT + 口扫成标配', likes: 7 },
        { id: 'N3', tab: 'company', title: '牙翼上线：每台设备可查注册证、维保记录与上门验机报告', likes: 12 }
      ],
      newsHead: { weekly: 'Dental Equipment Weekly', weeklyTitle: '口腔周报', company: 'Company News · 牙翼', companyTitle: '牙翼' },
      hotWords: ['CBCT', '牙科椅', '种植机', '口扫 3Shape', 'B 级灭菌器', '超声骨刀', '全景机', '根管马达'],
      rank: [
        { name: '卡瓦 KaVo E70 牙科椅', count: 2318 },
        { name: '朗视 Smart3D CBCT', count: 1876 },
        { name: '3Shape TRIOS 口扫', count: 1542 },
        { name: 'NSK 种植机', count: 1097 },
        { name: '蓝野 B 级灭菌器', count: 864 }
      ],
      paramTemplates: DENTAL_PARAM_TEMPLATES,
      devices: DENTAL_DEVICES,
      aestheticsWarn: ''
    },

    aesthetic: {
      key: 'aesthetic',
      label: '医美版（旧内容·已隐藏）',
      brandName: '再美二手光电',
      platformTag: '二手医美设备买卖平台',
      bannerTitle: '再美<em>甄选</em>·无忧购',
      bannerSub: ['放心 · 省心 · 安心', 'REST ASSURED'],
      homeCats: [
        { name: '二手设备', icon: 'shop', cls: 'cat-1', to: 'list?cat=1' },
        { name: '机构转让', icon: 'doclist', cls: 'cat-2', to: 'list?cat=6' },
        { name: '维修保养', icon: 'medbag', cls: 'cat-3', to: 'list?cat=7' },
        { name: '再美甄选', icon: 'star', cls: 'cat-4', to: 'pick' },
        { name: '我要卖机', icon: 'tag', cls: 'cat-5', to: 'publish' },
        { name: '免费估价', icon: 'money', cls: 'cat-6', to: 'publish?from=estimate' }
      ],
      quickActions: [],
      cats: AES_CATS,
      brands: ['全部品牌', 'Lumenis 科医人', '赛诺龙 Candela', '飞顿 Alma', '半岛', '欧洲之星 Fotona', '路创丽', '索塔 热玛吉'],
      notice: '平台已完成 1,286 台设备核验 · 今日新上架 37 台',
      pickNote: '甄选好机：平台质检 · 出报告 · 支持无忧购',
      guarantee: [['shield', '平台核验'], ['check', '出质检报告'], ['chat', '可上门看机']],
      newsTabs: [{ k: 'all', t: '全部' }, { k: 'weekly', t: '医美周报' }, { k: 'company', t: '公司新闻' }],
      news: [
        { id: 'N1', tab: 'weekly', title: '医美周报｜第十三期：全球认证 + 国货突破，医美硬实力进阶', likes: 1 },
        { id: 'N2', tab: 'weekly', title: '医美周报｜第十二期：明星资本入局，医美新品扎堆来袭', likes: 3 },
        { id: 'N3', tab: 'company', title: '再美甄选上线：每台设备出质检报告，二手医美设备也能“无忧购”', likes: 12 }
      ],
      newsHead: { weekly: 'Medical Beauty Weekly Report', weeklyTitle: '医美周报', company: 'Company News · 再美', companyTitle: '再美' },
      hotWords: ['M22 超光子', '紧致提升', '皮秒', '水光针仪', '光子嫩肤', '皮秒祛斑', '黄金微针', '红光治疗仪'],
      rank: [
        { name: '科医人 M22 王者之心', count: 2318 },
        { name: '赛诺龙 超皮秒 Picoway', count: 1876 },
        { name: '半岛 超声炮', count: 1542 },
        { name: '飞顿 黑金超光子', count: 1097 },
        { name: '路创丽 冷冻减脂仪', count: 864 }
      ],
      paramTemplates: {
        1: [['功率', '如 30W'], ['手具', '如 2 支']],
        2: [['功率', '如 200W'], ['探头', '如 2 个']],
        3: [['类型', '如水光仪'], ['耗材', '如 含耗材']],
        4: [['类型', '如冷冻减脂'], ['探头', '如 2 个']],
        5: [['类型', '如皮肤检测'], ['工作站', '如 含工作站']],
        6: [['转让范围', '如 设备 + 装修'], ['面积', '如 200㎡']],
        7: [['服务类型', '如 整机保养'], ['响应时长', '如 48 小时内']]
      },
      devices: AES_DEVICES,
      aestheticsWarn: '当前为旧医美内容，仅用于对比演示，默认对外不展示。'
    }
  }

  global.ZM_DATA = {
    DOMAINS: DOMAINS,
    CITIES: CITIES,
    CONDITION_OPTIONS: CONDITION_OPTIONS,
    YEAR_OPTIONS: YEAR_OPTIONS,
    PRICE_RANGES: ['不限价格', '1 万以下', '1-10 万', '10-50 万', '50 万以上'],
    YEAR_FILTERS: ['不限年份', '2023 年后', '2021-2022', '2019-2020', '2019 前'],
    makeDevice: makeDevice,

    /* ---------------- 维修服务 ---------------- */
    REPAIR: {
      flow: [
        { no: '01', name: '选择地址' },
        { no: '02', name: '选择产品' },
        { no: '03', name: '立即报修' }
      ],
      addressList: [
        { title: '河南省平顶山市卫东区中诺口腔', contact: '赵爽', phone: '15603753210' },
        { title: '河南省平顶山市新华区明朗齿科', contact: '李医生', phone: '13803751234' },
        { title: '郑州市金水区齿悦口腔门诊部', contact: '王先生', phone: '13512345678' }
      ],
      products: [
        '牙科综合治疗台', '口腔 CBCT', '全景机 / 牙片机', '种植机',
        '灭菌器 / 消毒设备', '高速手机 / 低速手机', '根管马达 / 超声骨刀', '其他设备'
      ],
      times: ['尽快联系我', '今天 14:00–18:00', '明天上午', '明天下午', '其他时间（电话沟通）'],
      services: [
        { icon: 'wrench', name: '故障报修', desc: '48 小时内上门' },
        { icon: 'shield', name: '整机保养', desc: '年保套餐更划算' },
        { icon: 'check', name: '安装调试', desc: '新机到位调试' }
      ],
      statuses: [
        { k: 'all', t: '全部' },
        { k: 'pending', t: '待接单' },
        { k: 'assigned', t: '待上门' },
        { k: 'done', t: '已完成' },
        { k: 'canceled', t: '已取消' }
      ],
      statusText: { pending: '待接单', assigned: '待上门', done: '已完成', canceled: '已取消' }
    }
  }
})(window)
