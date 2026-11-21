/* 演示页端到端交互自测：注入到 demo/index.html 后运行，结果渲染成可见面板 */
window.addEventListener('load', function () {
  var log = []
  var $ = function (s) { return document.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)) }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  function click (el) {
    if (!el) throw new Error('element missing')
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }
  function check (name, cond) { log.push((cond ? 'PASS  ' : 'FAIL  ') + name) }
  function goTo (hash) { location.hash = hash; return sleep(180) }

  ;(async function () {
    try {
      await sleep(250)

      // 1. 牙科内容域
      check('默认内容域为牙科（牙翼）', $('.nav-title').textContent.indexOf('牙翼') > -1)

      // 2. 首页六宫格 -> 列表
      click($('.cat-1'))
      await sleep(240)
      check('六宫格 -> 列表页', location.hash === '#/list?cat=1' && $$('.lcard').length > 0)
      check('列表标题为牙科类目', $('.nav-title').textContent.indexOf('牙科综合治疗台') > -1)

      // 3. 分类切换
      click($$('[data-act=list-cat]')[2])
      await sleep(240)
      check('列表分类切换（影像设备）', $$('.lcard').length > 0)

      // 4. 卡片 -> 详情
      click($('.lcard'))
      await sleep(240)
      check('列表卡片 -> 详情页', location.hash.indexOf('#/detail?id=') === 0 && !!$('.d-title'))
      check('详情含合规核验模块', !!$('.verify-row'))

      // 5. 收藏
      click($('[data-act=fav]'))
      await sleep(200)
      check('详情页收藏切换', $('.d-actions .op').textContent.indexOf('已收藏') > -1)

      // 6. 卖家中心
      await goTo('#/seller')
      check('我的店铺：商品列表渲染', $$('.sitem').length === 3)
      check('我的店铺：状态标签齐全', !!$('.st-on') && !!$('.st-auditing') && !!$('.st-off'))

      // 7. 下架
      click($('[data-act=seller-off]'))
      await sleep(240)
      check('商品下架操作', $('.st-on') === null)

      // 8. 发布流程
      await goTo('#/publish')
      check('发布页渲染', !!$('.upload') && $$('.f-card').length >= 3)
      var f = window.__demoState.form
      f.title = '测试 CBCT 设备'
      f.contact = '张三'
      f.phone = '13800138000'
      f.price = '30'
      f.images = [IMG['eq-3']]
      click($('#app .btn-solid[data-act=submit]'))
      await sleep(400)
      check('发布提交 -> 线索弹层（可复制发送）', !!$('.lead') && !!$('#leadText'))
      check('线索文本含商品信息', $('#leadText').value.indexOf('【我要卖机】') > -1)
      click($('.lead-close'))
      await sleep(240)
      check('弹层可关闭', !$('.lead'))
      click($('.lead-close') || document.body)
      await sleep(2600)
      var mine = window.__demoState.myItems.filter(function (x) { return x.title === '测试 CBCT 设备' })[0]
      check('提交后自动审核通过并上架', !!mine && mine.status === 'on')

      // 9. 上架商品出现在商城
      await goTo('#/home')
      check('我的商品出现在商城（带“我的”标记）', $$('.mine-tag').length > 0)

      // 10. 编辑商品回填
      await goTo('#/publish?edit=MY9001')
      check('编辑页回填数据', $('input[data-field=title]').value.indexOf('卡瓦 E80') > -1)

      // 11. 搜索
      await goTo('#/search')
      click($$('[data-act=kw]')[0])
      await sleep(280)
      check('搜索关键词出结果', $('.result-line') && $('.result-line').textContent.indexOf('搜索结果') > -1)

      // 12. 维修报修流程
      await goTo('#/repair')
      await sleep(400)
      check('维修页：预约流程渲染', $$('.rp-step').length === 3)
      check('维修页：Banner 占位图', !!$('.banner-slot'))
      click($('[data-act=pick-product]'))
      await sleep(350)
      check('维修产品选择弹层', $$('.sheet-opt').length > 2)
      click($$('.sheet-opt')[1])
      await sleep(350)
      check('维修产品已选中', !!window.__demoState.repair.product)
      click($('[data-act=pick-time]'))
      await sleep(350)
      click($$('.sheet-opt')[0])
      await sleep(350)
      var rp = window.__demoState.repair
      rp.desc = '椅位升降卡顿，脚踏无响应'
      var beforeOrders = window.__demoState.orders.length
      click($('[data-act=submit-repair]'))
      await sleep(400)
      check('报修提交 -> 线索弹层', !!$('.lead'))
      check('报修文本含单号与故障描述', $('#leadText').value.indexOf('【维修报修】') > -1 && $('#leadText').value.indexOf('椅位升降卡顿') > -1)
      click($('.lead-close'))
      await sleep(500)
      check('订单生成并跳转我的订单', window.__demoState.orders.length === beforeOrders + 1 && location.hash === '#/repair-orders')
      check('订单列表渲染', $$('.od-item').length === beforeOrders + 1)
      click($$('[data-act=order-tab]')[2])
      await sleep(300)
      check('订单状态筛选（待上门 → 空态）', !!$('.od-empty'))

      // 13. 内容域切换（仅开发者模式 ?dev=1 才出现）
      await goTo('#/mine')
      if ($('[data-act=switch-domain]')) {
        click($('[data-act=switch-domain]'))
        await sleep(200)
        click($$('.sheet-opt')[1])
        await sleep(300)
        check('切换到旧医美内容域', window.__demoState.domain === 'aesthetic')
        await goTo('#/home')
        check('医美域显示旧内容', $('.b-tag').textContent.indexOf('医美') > -1)
        await goTo('#/mine')
        click($('[data-act=switch-domain]'))
        await sleep(200)
        click($$('.sheet-opt')[0])
        await sleep(240)
      } else {
        check('客户版已隐藏内容域切换（需 ?dev=1）', true)
      }

      // 14. 总览墙
      await goTo('#/wall')
      await sleep(900)
      check('屏幕总览墙 11 屏', $$('.wall-item iframe').length === 11)
    } catch (e) {
      log.push('ERROR ' + e.message)
    }

    var ok = log.filter(function (l) { return l.indexOf('PASS') === 0 }).length
    var box = document.createElement('div')
    box.style.cssText = 'position:fixed;left:0;top:0;right:0;z-index:99999;background:#0b0f10;color:#8f8;' +
      'font:11px/1.5 monospace;padding:8px;white-space:pre-wrap;max-height:100vh;overflow:auto'
    box.textContent = '交互自测：' + ok + '/' + log.length + ' 通过\n' + log.join('\n')
    document.body.appendChild(box)
    window.__testDone = true
  })()
})
