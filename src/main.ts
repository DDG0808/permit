// 导入全局样式
import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 在开发环境中导入测试工具
if (import.meta.env.DEV) {
  import('./utils/license-generator-test')
}

const app = createApp(App)

app.use(router)

app.mount('#app')
