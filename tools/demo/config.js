/* ============================================================
 * 后端配置
 *   1. 去 https://supabase.com 建项目
 *   2. SQL Editor 里跑 supabase/schema.sql
 *   3. Storage 里建 public 桶 device-images
 *   4. Project Settings → API 复制下面两个值填进来
 * 两个值留空 = 使用本地演示数据（不上传、不共享）
 * ============================================================ */
window.ZM_CONFIG = {
  supabaseUrl: '',      // 例如 https://abcdefgh.supabase.co
  supabaseKey: '',      // anon public key（很长的那串，别用 service_role）
  bucket: 'device-images'
}
