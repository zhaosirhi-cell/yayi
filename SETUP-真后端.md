# 让设备"别人也能看到"——接入云端（约 10 分钟）

现在的问题：设备数据存在**浏览器本地**，所以你发了别人看不到。
解决办法：把数据放到云端数据库，**只有你能上架，所有客户都能看**。

方案已经写进代码了，你只需要完成下面 5 步把钥匙填进去。

---

## 第 1 步：注册 Supabase 并建项目（3 分钟）

1. 打开 **https://supabase.com** → **Start your project** → 用 **GitHub 账号**登录（就是你刚登录的 zhaosirhi-cell）
2. **New project**
   - Name：`yayi`
   - Database Password：设一个强密码，**记下来**
   - Region：**Southeast Asia (Singapore)** 或 **Northeast Asia (Tokyo)**
3. 等 1–2 分钟初始化

## 第 2 步：建表（1 分钟）

左侧 **SQL Editor** → **New query** → 把仓库里 **`supabase/schema.sql`** 全文粘进去 → **Run**

会建好 4 张表：
- `devices` 设备（**所有人能看，只有登录的你能改**）
- `sell_leads` 卖机线索（**只有你能看**）
- `repair_orders` 维修工单（**只有你能看**）
- `news` 资讯（所有人能看）

## 第 3 步：开图片存储（1 分钟）

1. 左侧 **Storage** → **New bucket**
2. Name：**`device-images`** → 勾 **Public bucket** → Create
3. 回 **SQL Editor**，把 `schema.sql` 最下面被 `--` 注释掉的 storage 策略那几行**去掉注释**后执行

## 第 4 步：创建你的店主账号（1 分钟）

左侧 **Authentication → Users → Add user → Create new user**：

- Email：填你自己的邮箱（例如 `boss@yayi.com`）
- Password：设一个密码
- **勾选 Auto Confirm User**（否则登录会失败）

这个账号就是你的"店主账号"，**只有登录后才能上架/看线索**。客户不需要注册。

## 第 5 步：把两个密钥填进配置（30 秒）

左侧 **Project Settings → API**，复制这两个值：

| 名称 | 长相 |
|---|---|
| Project URL | `https://xxxxx.supabase.co` |
| anon public key | `eyJhbGciOi...`（很长） |

打开 **`tools/demo/config.js`**，填进去：

```js
window.ZM_CONFIG = {
  supabaseUrl: 'https://xxxxx.supabase.co',
  supabaseKey: 'eyJhbGciOi...',
  bucket: 'device-images'
}
```

> ⚠️ 只要 **anon public**，**不要**用 `service_role`（那个是超级权限）。

## 第 6 步：发布（1 分钟）

```bash
node tools/build-demo.js
node tools/push-via-api.js zhaosirhi-cell yayi main
```

等 30 秒，线上就更新了。

---

## 接入后你怎么用

### 上架设备
1. 打开 https://zhaosirhi-cell.github.io/yayi/ → **我的** → **我的店铺** → **店主登录**（用第 4 步的邮箱密码）
2. 点「上架」→ 填资料、传图 → 提交
3. **所有客户刷新页面立刻就能看到**

### 客户那边
- 只能浏览设备、看参数、搜筛
- 点「立即咨询」→ 复制信息 + 加微信 14756753210 找你
- **看不到任何其他人的联系方式，也上传不了设备**

### 卖机线索
- 客户在「我要卖机」填资料（可传 4 张图）→ 提交后**直接进你的数据库**
- 你在「我的店铺」里能看到线索列表，点「打电话」直接联系，处理完点「标记已联系」

### 维修单
- 客户提交报修 → 直接进数据库
- 你在 Supabase 控制台 **Table Editor → repair_orders** 里能看到（后续可以做成页面）

---

## 常见问题

**Q：客户需要注册吗？**
不需要。客户是匿名访问，只能读上架中的设备、只能提交线索，看不到任何管理数据。

**Q：我的账号密码会泄露吗？**
不会。密码只存在 Supabase，前端只持有登录后的临时 token（有效期 1 小时，存在你自己浏览器）。

**Q：图片存在哪？**
Supabase Storage 的 `device-images` 桶，自动生成 CDN 链接。免费额度 1GB，够放几百台设备的图。

**Q：免费额度够吗？**
数据库 500MB、存储 1GB、每月 API 不限次。按你的量级（几十台设备、私域客户）**完全够用，不用付费**。

**Q：以后要给小程序用怎么办？**
同一套 Supabase 可以直接被小程序调用（把 `wx.request` 指过去），或者迁到腾讯云 CloudBase。

---

## 没填密钥之前会怎样

`config.js` 里两个值留空时，页面**自动走本地演示数据**（也就是现在线上的样子），不影响你继续给客户看。填好之后自动切换成云端。
