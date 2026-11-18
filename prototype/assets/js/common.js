/* ==========================================================================
   再美二手光电 · 原型公共脚本
   作用：注入图标 sprite、渲染自定义 tabBar / 胶囊按钮
   说明：小程序中这些会由 <custom-tab-bar> 与 custom navigationBar 承担
   ========================================================================== */
(function () {
  'use strict';

  var ICONS = {
    home: '<path d="M3.4 10.3 12 3.6l8.6 6.7V20a.9.9 0 0 1-.9.9h-4.5v-6.2H9.3v6.2H4.3a.9.9 0 0 1-.9-.9z"/>',
    star: '<path d="M12 3.5l2.75 5.6 6.15.9-4.45 4.35 1.05 6.15L12 17.6l-5.5 2.9 1.05-6.15L3.1 10l6.15-.9z"/>',
    news: '<rect x="3.5" y="5" width="17" height="14" rx="3.4"/><path d="M7.5 9.4h5M7.5 12.6h9M7.5 15.8h6.2"/>',
    user: '<circle cx="12" cy="7.9" r="3.6"/><path d="M4.7 20.2c.9-3.5 3.8-5.5 7.3-5.5s6.4 2 7.3 5.5"/>',
    search: '<circle cx="10.9" cy="10.9" r="6.5"/><path d="M15.7 15.7 20.4 20.4"/>',
    shop: '<path d="M4 9.6h16l-1.1-4.3H5.1z"/><path d="M4.7 9.6v9.3a1.7 1.7 0 0 0 1.7 1.7h11.2a1.7 1.7 0 0 0 1.7-1.7V9.6"/><path d="M9.7 20.6v-5.2h4.6v5.2"/>',
    doclist: '<rect x="3.6" y="4.6" width="16.8" height="14.8" rx="3.2"/><path d="M7.6 9.4h8.8M7.6 12.6h8.8M7.6 15.8h5.2"/>',
    medbag: '<rect x="3.4" y="7.4" width="17.2" height="12.6" rx="3.2"/><path d="M8.9 7.4V5.9a2 2 0 0 1 2-2h2.2a2 2 0 0 1 2 2v1.5"/><path d="M12 11.2v4.8M9.6 13.6h4.8"/>',
    badge: '<path d="M12 3.6l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.3l5.4-.8z"/>',
    tag: '<path d="M4.2 11.4V5.6a1.5 1.5 0 0 1 1.5-1.5h5.8l8.3 8.3-7.3 7.3z"/><circle cx="8.4" cy="8.4" r="1.3"/>',
    money: '<circle cx="12" cy="12" r="8.3"/><path d="M9.1 8.5 12 11.9l2.9-3.4M12 11.9V17M9.7 13.5h4.6M9.7 15.3h4.6"/>',
    gear: '<path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.8-1.3-2-3.4-2 .9a7.6 7.6 0 0 0-2.6-1.5L14.3 3h-4l-.3 2.2a7.6 7.6 0 0 0-2.6 1.5l-2-.9-2 3.4 1.8 1.3a7.7 7.7 0 0 0 0 3l-1.8 1.3 2 3.4 2-.9a7.6 7.6 0 0 0 2.6 1.5l.3 2.2h4l.3-2.2a7.6 7.6 0 0 0 2.6-1.5l2 .9 2-3.4z"/><circle cx="12" cy="12" r="2.9"/>',
    cart: '<circle cx="9.6" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M3 4.6h2.3l2.4 10.2h10.4l2.2-7.4H6.3"/>',
    bars: '<path d="M5.4 19.4V12M12 19.4V5.6M18.6 19.4v-4.2"/>',
    edit: '<path d="M13.4 3.6H7a2 2 0 0 0-2 2v12.9a2 2 0 0 0 2 2h10.1a2 2 0 0 0 2-2V9.2z"/><path d="M13.4 3.6v5.6h5.6"/><path d="M8.9 13.9h4.2M8.9 17h6"/>',
    thumb: '<path d="M8.1 10.4 11.7 4c1.35 0 2.2.9 2 2.25l-.7 3.05h4.4c1.2 0 2.05.95 1.85 2.15l-1 5.5c-.2 1-1.05 1.6-2.05 1.6H8.1z"/><path d="M8.1 10.4H4.6v8.9h3.5z"/>',
    caret: '<path d="M6.5 9.4h11l-5.5 6.4z" fill="currentColor" stroke="none"/>',
    arrow: '<path d="M9.6 5.4 16.2 12l-6.6 6.6"/>',
    camera: '<path d="M3.6 9.2h3l1.6-2.3h7.6l1.6 2.3h3v9.9H3.6z"/><circle cx="12" cy="13.9" r="3.3"/>',
    plus: '<path d="M12 5.6v12.8M5.6 12h12.8"/>',
    back: '<path d="M14.6 5 8 12l6.6 7"/>',
    share: '<circle cx="17.6" cy="6.2" r="2.3"/><circle cx="6.4" cy="12" r="2.3"/><circle cx="17.6" cy="17.8" r="2.3"/><path d="M8.5 10.9l6.9-3.6M8.5 13.1l6.9 3.6"/>',
    loc: '<path d="M12 20.6s6.3-5.6 6.3-10.2A6.3 6.3 0 0 0 5.7 10.4c0 4.6 6.3 10.2 6.3 10.2z"/><circle cx="12" cy="10.3" r="2.2"/>',
    shield: '<path d="M12 3.5 18.8 6v5.5c0 4.1-2.8 7.3-6.8 8.7-4-1.4-6.8-4.6-6.8-8.7V6z"/><path d="M8.9 12.1l2.2 2.2 4.1-4.4"/>',
    chat: '<path d="M4.2 6.4h15.6v9.2h-8.1l-4.3 3.5v-3.5H4.2z"/>',
    filter: '<path d="M4 6.5h16M7 12h10M10 17.5h4"/>',
    close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"/>',
    clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 1.9"/>',
    check: '<path d="M5.4 12.4l4.4 4.4L18.6 7.6"/>'
  };

  /* 1. 图标 sprite */
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
  for (var k in ICONS) {
    // 不在 symbol 上写 fill/stroke，统一由 .ic 的 CSS 继承，方便按场景覆盖
    sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
  }
  sprite += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);

  /* 2. 胶囊按钮 */
  document.querySelectorAll('[data-capsule]').forEach(function (host) {
    host.innerHTML =
      '<span class="dots"><i></i><i></i><i></i></span>' +
      '<span class="dash"></span>' +
      '<span class="minus"><i></i></span>' +
      '<span class="dash"></span>' +
      '<span class="ring"><i></i></span>';
    host.classList.add('capsule');
  });

  /* 3. 自定义 tabBar */
  var TABS = [
    { k: 'home', t: '首页', i: 'home', h: 'home.html' },
    { k: 'pick', t: '甄选', i: 'star', h: 'pick.html' },
    { k: 'center' },
    { k: 'news', t: '资讯', i: 'news', h: 'news.html' },
    { k: 'mine', t: '我的', i: 'user', h: 'mine.html' }
  ];
  document.querySelectorAll('[data-tabbar]').forEach(function (bar) {
    var active = bar.getAttribute('data-tabbar') || '';
    var html = '';
    TABS.forEach(function (it) {
      if (it.k === 'center') {
        html += '<a class="tab-center" href="publish.html" aria-label="发布设备">' +
          '<span class="bubble"><b>转</b><i>设备</i></span></a>';
        return;
      }
      html += '<a class="' + (active === it.k ? 'on' : '') + '" href="' + it.h + '">' +
        '<svg class="ic"><use href="#i-' + it.i + '"/></svg><span>' + it.t + '</span></a>';
    });
    html += '<div class="home-indicator"></div>';
    bar.innerHTML = html;
  });
})();
