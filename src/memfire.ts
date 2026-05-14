import { createClient } from '@supabase/supabase-js'

// MemFire Cloud 配置
// 你需要先在 https://cloud.memfiredb.com 创建项目，然后填入下面的配置
const MEMFIRE_URL = import.meta.env.VITE_MEMFIRE_URL || ''
const MEMFIRE_ANON_KEY = import.meta.env.VITE_MEMFIRE_ANON_KEY || ''

// 如果没有配置时，使用占位符（不会报错
let memfireClient: any = null

if (MEMFIRE_URL && MEMFIRE_ANON_KEY) {
  try {
    memfireClient = createClient(MEMFIRE_URL, MEMFIRE_ANON_KEY)
    console.log('MemFire Cloud 已初始化成功')
  } catch (error) {
    console.warn('MemFire Cloud 初始化失败:', error)
  }
} else {
  console.log('未配置 MemFire Cloud，使用本地存储')
}

export { memfireClient }

