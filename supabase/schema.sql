-- ============================================================
-- 牙翼 · Supabase 数据库（只有店主能上架，客户只浏览+留线索）
-- 用法：Supabase 控制台 → SQL Editor → 新建查询 → 整段粘贴 → Run
-- 可重复执行
-- ============================================================

-- ---------- 设备商品（只有店主能写） ----------
create table if not exists public.devices (
  id               bigserial primary key,
  title            text not null,
  category_id      int,
  category_name    text not null,
  brand            text,
  model            text,
  condition        text,
  year             int,
  use_years        text,
  register_no      text,
  install_included boolean default true,
  warranty         text,
  price            numeric,                     -- null = 面议，单位：元
  negotiable       boolean default true,
  city             text,
  district         text,
  specs            jsonb  default '[]'::jsonb,  -- [[参数名, 参数值], ...]
  tags             text[] default '{}',
  desc_lines       text[] default '{}',
  cover            text,
  images           text[] default '{}',
  status           text default 'on',           -- on / off / sold（你手动控制）
  is_pick          boolean default false,       -- 甄选角标
  view_count       int default 0,
  sort_order       int default 0,               -- 手动排序，越大越前
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
create index if not exists devices_status_idx on public.devices (status, created_at desc);
create index if not exists devices_cat_idx    on public.devices (category_id, status);

-- ---------- 卖机线索（客户提交，只有你能看） ----------
create table if not exists public.sell_leads (
  id          bigserial primary key,
  title       text,                 -- 设备名称
  brand       text,
  model       text,
  condition   text,
  year        int,
  price       numeric,
  city        text,
  contact     text not null,        -- 联系人
  phone       text not null,
  note        text,
  images      text[] default '{}',
  handled     boolean default false, -- 你是否已联系
  created_at  timestamptz default now()
);
create index if not exists leads_idx on public.sell_leads (created_at desc);

-- ---------- 维修工单（客户提交，只有你能看） ----------
create table if not exists public.repair_orders (
  id           bigserial primary key,
  order_no     text unique not null,
  product      text not null,
  address      text not null,
  contact      text not null,
  phone        text not null,
  contact_time text,
  description  text,
  images       text[] default '{}',
  status       text default 'pending',   -- pending / assigned / done / canceled
  engineer     text,
  visit_at     timestamptz,
  finish_note  text,
  created_at   timestamptz default now()
);
create index if not exists repairs_idx on public.repair_orders (status, created_at desc);

-- ---------- 资讯 ----------
create table if not exists public.news (
  id         bigserial primary key,
  tab        text default 'company',
  title      text not null,
  cover      text,
  body       text,
  likes      int default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

-- ---------- updated_at 自动更新 ----------
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;

drop trigger if exists devices_touch on public.devices;
create trigger devices_touch before update on public.devices
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 权限：所有人能看上架商品；只有登录的店主能改
--       客户能提交线索/报修；只有店主能看线索
-- ============================================================
alter table public.devices       enable row level security;
alter table public.sell_leads    enable row level security;
alter table public.repair_orders enable row level security;
alter table public.news          enable row level security;

-- devices：匿名可读上架的；登录用户（店主）全部可读写
drop policy if exists devices_public_read on public.devices;
create policy devices_public_read on public.devices for select
  using (status = 'on' or auth.role() = 'authenticated');

drop policy if exists devices_owner_write on public.devices;
create policy devices_owner_write on public.devices for insert
  to authenticated with check (true);

drop policy if exists devices_owner_update on public.devices;
create policy devices_owner_update on public.devices for update
  to authenticated using (true);

drop policy if exists devices_owner_delete on public.devices;
create policy devices_owner_delete on public.devices for delete
  to authenticated using (true);

-- sell_leads：谁都能提交；只有登录的店主能看/改
drop policy if exists leads_insert on public.sell_leads;
create policy leads_insert on public.sell_leads for insert to anon, authenticated with check (true);

drop policy if exists leads_owner_read on public.sell_leads;
create policy leads_owner_read on public.sell_leads for select to authenticated using (true);

drop policy if exists leads_owner_update on public.sell_leads;
create policy leads_owner_update on public.sell_leads for update to authenticated using (true);

-- repair_orders：客户能提交；店主能看/改
drop policy if exists repair_insert on public.repair_orders;
create policy repair_insert on public.repair_orders for insert to anon, authenticated with check (true);

drop policy if exists repair_owner_read on public.repair_orders;
create policy repair_owner_read on public.repair_orders for select to authenticated using (true);

drop policy if exists repair_owner_update on public.repair_orders;
create policy repair_owner_update on public.repair_orders for update to authenticated using (true);

-- news：所有人可读
drop policy if exists news_read on public.news;
create policy news_read on public.news for select using (published = true);

-- 浏览量 +1（匿名也能调）
create or replace function public.inc_view(device_id bigint) returns void as $$
  update public.devices set view_count = view_count + 1 where id = device_id and status = 'on';
$$ language sql security definer;

-- ============================================================
-- 图片存储桶：在 Storage 里手动建 public 桶 device-images
-- 建完后执行下面这段
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('device-images','device-images', true)
--   on conflict (id) do nothing;
-- drop policy if exists img_read on storage.objects;
-- create policy img_read on storage.objects for select using (bucket_id = 'device-images');
-- drop policy if exists img_write on storage.objects;
-- create policy img_write on storage.objects for insert to authenticated with check (bucket_id = 'device-images');
-- drop policy if exists img_delete on storage.objects;
-- create policy img_delete on storage.objects for delete to authenticated using (bucket_id = 'device-images');

-- ============================================================
-- 演示数据（想先有内容就跑这段；图片留空，之后你在后台补）
-- ============================================================
insert into public.news (tab, title, likes) values
  ('weekly',  '口腔设备周报｜第十三期：种植集采落地一年，诊所设备升级方向变了', 4),
  ('weekly',  '口腔设备周报｜第十二期：数字化口腔渗透率破 40%，CBCT + 口扫成标配', 7),
  ('company', '牙翼上线：每台设备可查注册证、维保记录与上门验机报告', 12)
on conflict do nothing;
