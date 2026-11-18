-- ============================================================
-- 牙翼 · Supabase 数据库结构 + 权限规则
-- 用法：Supabase 控制台 → SQL Editor → 新建查询 → 整段粘贴 → Run
-- 幂等：重复执行不会报错（都是 if not exists / drop policy if exists）
-- ============================================================

-- ---------- 1. 用户 ----------
create table if not exists public.users (
  id          uuid primary key references auth.users on delete cascade,
  nick_name   text,
  phone       text,
  role        text default 'buyer',      -- buyer / seller / service / admin
  verified    boolean default false,
  created_at  timestamptz default now()
);

-- ---------- 2. 设备商品 ----------
create table if not exists public.devices (
  id               bigserial primary key,
  seller_id        uuid references public.users(id) on delete cascade not null,
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
  price            numeric,                    -- null = 面议，单位：元
  negotiable       boolean default true,
  city             text,
  district         text,
  specs            jsonb   default '[]'::jsonb, -- [[参数名, 参数值], ...]
  tags             text[]  default '{}',
  desc_lines       text[]  default '{}',
  cover            text,
  images           text[]  default '{}',
  status           text default 'auditing',    -- auditing / on / off / sold / rejected
  reject_reason    text,
  is_pick          boolean default false,      -- 平台甄选
  view_count       int default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
create index if not exists devices_status_idx  on public.devices (status, created_at desc);
create index if not exists devices_cat_idx     on public.devices (category_id, status);
create index if not exists devices_city_idx    on public.devices (city, status);
create index if not exists devices_seller_idx  on public.devices (seller_id);

-- ---------- 3. 维修工单 ----------
create table if not exists public.repair_orders (
  id           bigserial primary key,
  order_no     text unique not null,
  user_id      uuid references public.users(id) on delete set null,
  product      text not null,
  address      text not null,
  contact      text not null,
  phone        text not null,
  contact_time text,
  description  text,
  images       text[] default '{}',
  status       text default 'pending',   -- pending / assigned / done / canceled
  engineer     text,                     -- 服务商 / 工程师
  visit_at     timestamptz,
  finish_note  text,                     -- 完工说明
  created_at   timestamptz default now()
);
create index if not exists repairs_status_idx on public.repair_orders (status, created_at desc);
create index if not exists repairs_user_idx   on public.repair_orders (user_id);

-- ---------- 4. 收藏 ----------
create table if not exists public.favorites (
  user_id    uuid references public.users(id) on delete cascade,
  device_id  bigint references public.devices(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, device_id)
);

-- ---------- 5. 资讯（可选，先留着） ----------
create table if not exists public.news (
  id         bigserial primary key,
  tab        text default 'company',   -- weekly / company
  title      text not null,
  cover      text,
  body       text,
  likes      int default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

-- ---------- 6. updated_at 自动更新 ----------
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

drop trigger if exists devices_touch on public.devices;
create trigger devices_touch before update on public.devices
  for each row execute function public.touch_updated_at();

-- ---------- 7. 新用户自动建档 ----------
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.users (id, nick_name) values (new.id, '牙翼用户')
  on conflict (id) do nothing;
  return new;
end $$ language plpgsql;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 行级权限（RLS）：没登录只能看上架商品，卖家只能改自己的
-- ============================================================
alter table public.users         enable row level security;
alter table public.devices       enable row level security;
alter table public.repair_orders enable row level security;
alter table public.favorites     enable row level security;
alter table public.news          enable row level security;

-- users：本人可读写
drop policy if exists users_self_select on public.users;
create policy users_self_select on public.users for select using (auth.uid() = id);
drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users for update using (auth.uid() = id);

-- devices：所有人能看上架中的；卖家能看/改/删自己的
drop policy if exists devices_public_read on public.devices;
create policy devices_public_read on public.devices for select
  using (status = 'on' or seller_id = auth.uid());

drop policy if exists devices_seller_insert on public.devices;
create policy devices_seller_insert on public.devices for insert
  with check (auth.uid() = seller_id);

drop policy if exists devices_seller_update on public.devices;
create policy devices_seller_update on public.devices for update
  using (auth.uid() = seller_id);

drop policy if exists devices_seller_delete on public.devices;
create policy devices_seller_delete on public.devices for delete
  using (auth.uid() = seller_id);

-- 浏览量 +1（给匿名/买家用的安全函数，不动其它字段）
create or replace function public.inc_view(device_id bigint) returns void as $$
  update public.devices set view_count = view_count + 1 where id = device_id and status = 'on';
$$ language sql security definer;

-- repair_orders：本人可建/可看自己的；服务商与管理员可看全部（按 role 判断）
drop policy if exists repair_insert on public.repair_orders;
create policy repair_insert on public.repair_orders for insert
  with check (auth.uid() = user_id or auth.uid() is null);

drop policy if exists repair_read on public.repair_orders;
create policy repair_read on public.repair_orders for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','service'))
  );

drop policy if exists repair_update on public.repair_orders;
create policy repair_update on public.repair_orders for update
  using (
    user_id = auth.uid()
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','service'))
  );

-- favorites：只能看/改自己的
drop policy if exists fav_all on public.favorites;
create policy fav_all on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- news：所有人可读已发布的
drop policy if exists news_read on public.news;
create policy news_read on public.news for select using (published = true);

-- ============================================================
-- 存储：图片桶（在 Storage 里手动建一个 public 桶，名字 device-images）
-- 建完后跑下面这段策略
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('device-images','device-images', true)
--   on conflict (id) do nothing;
--
-- drop policy if exists img_public_read on storage.objects;
-- create policy img_public_read on storage.objects for select
--   using (bucket_id = 'device-images');
--
-- drop policy if exists img_auth_write on storage.objects;
-- create policy img_auth_write on storage.objects for insert
--   to authenticated with check (bucket_id = 'device-images');

-- ============================================================
-- 演示用初始数据（想先有内容就执行这一段）
-- ============================================================
insert into public.news (tab, title, likes) values
  ('weekly',  '口腔设备周报｜第十三期：种植集采落地一年，诊所设备升级方向变了', 4),
  ('weekly',  '口腔设备周报｜第十二期：数字化口腔渗透率破 40%，CBCT + 口扫成标配', 7),
  ('company', '牙翼上线：每台设备可查注册证、维保记录与上门验机报告', 12)
on conflict do nothing;
