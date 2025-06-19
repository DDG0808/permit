<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  type GlobalTheme,
  darkTheme
} from 'naive-ui'
import PageHeader from '@/components/common/PageHeader.vue'
import PageTransition from '@/components/PageTransition.vue'

const route = useRoute()

// 初始化深色主题
onMounted(() => {
  // 设置深色主题
  document.documentElement.setAttribute('data-theme', 'dark')

  // 更新meta标签
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  const color = '#000000'

  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color)
  } else {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.head.appendChild(meta)
  }
})

// 计算是否显示头部导航
const showHeader = computed(() => {
  // 首页不显示头部导航（因为首页有自己的导航设计）
  return route.path !== '/'
})

// Naive UI深色主题配置
const naiveTheme = darkTheme
</script>

<template>
  <NConfigProvider :theme="naiveTheme">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <div id="app" class="app-container">
            <PageHeader v-if="showHeader" class="app-header" />
            <main
              class="app-main"
              :class="{
                'app-main--with-header': showHeader,
                'app-main--home': route.path === '/'
              }"
            >
              <div class="app-content">
                <RouterView v-slot="{ Component }">
                  <PageTransition name="auto">
                    <component :is="Component" />
                  </PageTransition>
                </RouterView>
              </div>
            </main>
          </div>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
/* 应用根组件样式 - 使用新设计系统 */

/* 注意：全局重置已在main.css中定义 */

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family-system);
  transition: background-color var(--duration-300) var(--ease-out),
              color var(--duration-300) var(--ease-out);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: min-height var(--duration-300) var(--ease-out);
}

.app-main--with-header {
  min-height: calc(100vh - 64px);
}

.app-main--home {
  min-height: 100vh;
}

.app-content {
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

/* 注意：滚动条样式已在main.css中定义 */
/* 注意：全局链接样式已在main.css中定义 */

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all var(--duration-300) var(--ease-apple);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(var(--spacing-8));
}

.page-leave-to {
  opacity: 0;
  transform: translateX(calc(-1 * var(--spacing-8)));
}

/* Naive UI 组件现代化样式增强 */
:deep(.n-button) {
  border-radius: var(--radius-lg) !important;
  font-weight: var(--font-weight-medium) !important;
  font-family: var(--font-family-system) !important;
  transition: all var(--duration-200) var(--ease-out) !important;
  box-shadow: var(--shadow-sm) !important;
}

:deep(.n-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-md) !important;
}

:deep(.n-button:active) {
  transform: translateY(0) !important;
}

/* 现代化卡片样式 */
:deep(.n-card) {
  border-radius: var(--radius-xl) !important;
  box-shadow: var(--shadow-sm) !important;
  border: 1px solid var(--color-border-light) !important;
  transition: all var(--duration-300) var(--ease-out) !important;
  background: var(--color-background-primary) !important;
}

:deep(.n-card:hover) {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-lg) !important;
  border-color: var(--color-primary-alpha-20) !important;
}

/* 现代化输入框样式 */
:deep(.n-input) {
  border-radius: var(--radius-lg) !important;
  font-family: var(--font-family-system) !important;
  transition: all var(--duration-200) var(--ease-out) !important;
}

:deep(.n-input:focus-within) {
  box-shadow: 0 0 0 2px var(--color-primary-alpha-20) !important;
}

/* 现代化标签样式 */
:deep(.n-tag) {
  border-radius: var(--radius-md) !important;
  font-weight: var(--font-weight-medium) !important;
  font-family: var(--font-family-system) !important;
}

/* 现代化进度条样式 */
:deep(.n-progress) {
  border-radius: var(--radius-full) !important;
}

/* 现代化选择器样式 */
:deep(.n-select) {
  border-radius: var(--radius-lg) !important;
}

/* 现代化开关样式 */
:deep(.n-switch) {
  border-radius: var(--radius-full) !important;
}

/* 响应式布局优化 */
@media (max-width: 768px) {
  .app-content {
    padding: 0 var(--spacing-4);
  }

  .app-main--with-header {
    min-height: calc(100vh - 56px); /* 移动端头部高度较小 */
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 0 var(--spacing-3);
  }

  /* 移动端Naive UI组件优化 */
  :deep(.n-button) {
    min-height: 44px !important; /* 符合移动端触摸标准 */
  }

  :deep(.n-input) {
    min-height: 44px !important;
  }
}

/* 注意：焦点样式已在main.css中定义 */
/* 注意：选择文本样式已在main.css中定义 */

/* 深色主题样式 */
[data-theme="dark"] .app-container {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
}

/* 深色模式下的Naive UI组件优化 */
[data-theme="dark"] :deep(.n-card) {
  background: var(--color-background-secondary) !important;
  border-color: var(--color-border) !important;
}

/* 注意：减少动画模式已在新设计系统中定义 */

/* 高性能动画优化 */
.app-container,
.app-main,
.app-content {
  will-change: auto;
}

/* 确保页面过渡的性能 */
.page-enter-active,
.page-leave-active {
  will-change: transform, opacity;
}

.page-enter-active.page-leave-active {
  will-change: auto;
}
</style>
