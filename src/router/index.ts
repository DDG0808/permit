import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // 临时使用hash模式避免404问题，建议配置服务器后改回history模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeViewOptimized.vue')
    },
    {
      path: '/wizard',
      name: 'wizard',
      component: () => import('@/views/WizardViewOptimized.vue')
    },
    {
      path: '/analyzer',
      name: 'analyzer',
      component: () => import('@/views/AnalyzerView.vue')
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('@/views/KnowledgeView.vue')
    },
    {
      path: '/responsive-test',
      name: 'responsive-test',
      component: () => import('@/views/ResponsiveTestView.vue')
    },
    {
      path: '/animation-demo',
      name: 'animation-demo',
      component: () => import('@/views/AnimationDemoView.vue')
    },
    {
      path: '/home-optimized',
      name: 'home-optimized',
      component: () => import('@/views/HomeViewOptimized.vue')
    },
    {
      path: '/ui-comparison',
      name: 'ui-comparison',
      component: () => import('@/views/UIComparisonView.vue')
    }
  ]
})

export default router
