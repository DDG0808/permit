<template>
  <header class="apple-header">
    <div class="header-container">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <RouterLink to="/" class="brand-link">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div class="logo-glow"></div>
          </div>
          <div class="brand-text">
            <span class="brand-title">开源许可证助手</span>
          </div>
        </RouterLink>
      </div>

      <!-- 主导航 -->
      <nav class="main-navigation">
        <div class="nav-container">
          <div
            v-for="item in menuOptions"
            :key="item.key"
            class="nav-item"
            :class="{ active: activeKey === item.key }"
            @click="handleMenuSelect(item.key)"
          >
            <div class="nav-item-content">
              <div class="nav-icon">
                <NIcon>
                  <component :is="item.icon" />
                </NIcon>
              </div>
              <span class="nav-text">{{ item.label }}</span>
            </div>
            <div class="nav-indicator"></div>
          </div>
        </div>
      </nav>

      <!-- 操作区域 -->
      <div class="actions-section">
        <div class="action-group">
          <a
            href="https://github.com/your-username/open-source-license-helper"
            target="_blank"
            class="github-link"
            title="查看源码"
          >
            <div class="github-icon">
              <NIcon>
                <LogoGithub />
              </NIcon>
            </div>
            <div class="link-glow"></div>
          </a>
        </div>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="mobile-toggle">
        <button
          class="mobile-toggle-btn"
          @click="showMobileMenu = !showMobileMenu"
          :class="{ active: showMobileMenu }"
        >
          <div class="toggle-icon">
            <span class="line line-1"></span>
            <span class="line line-2"></span>
            <span class="line line-3"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <Transition name="mobile-slide">
      <div v-if="showMobileMenu" class="mobile-menu">
        <div class="mobile-backdrop" @click="showMobileMenu = false"></div>
        <div class="mobile-panel">
          <div class="mobile-header">
            <div class="mobile-brand">
              <div class="mobile-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span class="mobile-title">许可证助手</span>
            </div>
          </div>

          <nav class="mobile-navigation">
            <div
              v-for="item in menuOptions"
              :key="item.key"
              class="mobile-nav-item"
              :class="{ active: activeKey === item.key }"
              @click="handleMobileMenuSelect(item.key)"
            >
              <div class="mobile-nav-icon">
                <NIcon>
                  <component :is="item.icon" />
                </NIcon>
              </div>
              <span class="mobile-nav-text">{{ item.label }}</span>
              <div class="mobile-nav-arrow">→</div>
            </div>
          </nav>

          <div class="mobile-footer">
            <div class="mobile-actions">
              <a
                href="https://github.com/your-username/open-source-license-helper"
                target="_blank"
                class="mobile-github"
              >
                <NIcon>
                  <LogoGithub />
                </NIcon>
                <span>查看源码</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { NIcon } from 'naive-ui'
import {
  DocumentTextOutline, LogoGithub,
  MenuOutline, CloseOutline, HomeOutline, HelpCircleOutline,
  AnalyticsOutline, LibraryOutline
} from '@vicons/ionicons5'


// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const activeKey = ref<string>('')
const showMobileMenu = ref(false)

// 菜单选项
const menuOptions = [
  {
    label: '首页',
    key: 'home',
    icon: HomeOutline,
    path: '/'
  },
  {
    label: '选择向导',
    key: 'wizard',
    icon: HelpCircleOutline,
    path: '/wizard'
  },
  {
    label: 'GitHub分析',
    key: 'analyzer',
    icon: AnalyticsOutline,
    path: '/analyzer'
  },
  {
    label: '知识库',
    key: 'knowledge',
    icon: LibraryOutline,
    path: '/knowledge'
  }
]

// 计算属性 - 移除面包屑相关逻辑，保持简洁

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 根据路径设置活跃菜单项
    const menuItem = menuOptions.find(item => item.path === newPath)
    if (menuItem) {
      activeKey.value = menuItem.key
    }
    // 关闭移动端菜单
    showMobileMenu.value = false
  },
  { immediate: true }
)

// 事件处理
const handleMenuSelect = (key: string) => {
  const menuItem = menuOptions.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

const handleMobileMenuSelect = (key: string) => {
  handleMenuSelect(key)
  showMobileMenu.value = false
}

// 移除主题切换功能，保持单一深色主题



// 导入h函数用于渲染图标
import { h } from 'vue'
</script>

<style scoped>
/* Apple Design Award 风格的现代化头部 */
.apple-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* 默认深色主题 */
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* ===== 品牌区域 ===== */
.brand-section {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 16px;
  padding: 8px;
  margin: -8px;
  position: relative;
}

.brand-link:hover {
  transform: translateY(-2px);
}

.brand-logo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.logo-icon {
  color: white;
  z-index: 2;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: 16px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 0;
}

.brand-link:hover .logo-glow {
  opacity: 0.6;
}

.brand-link:hover .logo-icon {
  transform: scale(1.1);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.02em;
  margin: 0;
}

/* ===== 主导航 ===== */
.main-navigation {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: 0 32px;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 4px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  position: relative;
  z-index: 2;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
  transition: all var(--duration-200) var(--ease-apple);
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
}

.nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: 16px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
}

.nav-item:hover .nav-indicator {
  opacity: 0.2;
  transform: scale(1);
}

.nav-item:hover .nav-icon,
.nav-item:hover .nav-text {
  color: white;
  transform: translateY(-1px);
}

.nav-item.active .nav-indicator {
  opacity: 1;
  transform: scale(1);
}

.nav-item.active .nav-icon,
.nav-item.active .nav-text {
  color: white;
}

/* ===== 操作区域 ===== */
.actions-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.action-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* 主题切换按钮样式已移除 */

.github-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all var(--duration-200) var(--ease-apple);
  overflow: hidden;
}

.github-icon {
  font-size: 18px;
  z-index: 2;
  transition: transform var(--duration-200) var(--ease-apple);
}

.link-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: var(--radius-xl);
  opacity: 0;
  filter: blur(8px);
  transition: opacity var(--duration-200) var(--ease-apple);
  z-index: 0;
}

.github-link:hover {
  transform: translateY(-2px);
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.github-link:hover .link-glow {
  opacity: 0.4;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
}

/* ===== 移动端切换按钮 ===== */
.mobile-toggle {
  display: none;
}

.mobile-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-apple);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-icon {
  position: relative;
  width: 20px;
  height: 16px;
}

.line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  transition: all var(--duration-300) var(--ease-apple);
}

.line-1 {
  top: 0;
}

.line-2 {
  top: 7px;
}

.line-3 {
  top: 14px;
}

.mobile-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.mobile-toggle-btn.active .line-1 {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle-btn.active .line-2 {
  opacity: 0;
}

.mobile-toggle-btn.active .line-3 {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* ===== 移动端菜单 ===== */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-modal);
  display: flex;
}

.mobile-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-panel {
  position: relative;
  width: 320px;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
}

.mobile-header {
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.mobile-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: white;
  letter-spacing: -0.01em;
}

.mobile-navigation {
  flex: 1;
  padding: var(--spacing-4) 0;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-apple);
  position: relative;
  border-left: 3px solid transparent;
}

.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.7);
  transition: all var(--duration-200) var(--ease-apple);
}

.mobile-nav-text {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: rgba(255, 255, 255, 0.7);
  transition: all var(--duration-200) var(--ease-apple);
}

.mobile-nav-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: var(--font-size-lg);
  transition: all var(--duration-200) var(--ease-apple);
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: rgba(0, 122, 255, 0.5);
}

.mobile-nav-item:hover .mobile-nav-icon,
.mobile-nav-item:hover .mobile-nav-text {
  color: white;
}

.mobile-nav-item:hover .mobile-nav-arrow {
  color: #007AFF;
  transform: translateX(4px);
}

.mobile-nav-item.active {
  background: rgba(0, 122, 255, 0.1);
  border-left-color: #007AFF;
}

.mobile-nav-item.active .mobile-nav-icon,
.mobile-nav-item.active .mobile-nav-text {
  color: #007AFF;
}

.mobile-footer {
  padding: var(--spacing-4) var(--spacing-6) var(--spacing-6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.mobile-github {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all var(--duration-200) var(--ease-apple);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-github:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

/* ===== 动画效果 ===== */
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: all var(--duration-300) var(--ease-apple);
}

.mobile-slide-enter-from .mobile-backdrop,
.mobile-slide-leave-to .mobile-backdrop {
  opacity: 0;
}

.mobile-slide-enter-from .mobile-panel,
.mobile-slide-leave-to .mobile-panel {
  transform: translateX(-100%);
}

.mobile-slide-enter-to .mobile-backdrop,
.mobile-slide-leave-from .mobile-backdrop {
  opacity: 1;
}

.mobile-slide-enter-to .mobile-panel,
.mobile-slide-leave-from .mobile-panel {
  transform: translateX(0);
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .header-container {
    padding: 0 var(--spacing-4);
    height: 64px;
  }

  .main-navigation {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
  }

  .brand-title {
    font-size: var(--font-size-base);
  }

  .action-group {
    gap: var(--spacing-2);
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 var(--spacing-3);
    height: 60px;
  }

  .brand-text {
    display: none;
  }

  .brand-link {
    gap: 0;
    padding: var(--spacing-1);
    margin: calc(-1 * var(--spacing-1));
  }

  .brand-logo {
    width: 36px;
    height: 36px;
  }

  .mobile-panel {
    width: 280px;
  }

  .github-link {
    width: 36px;
    height: 36px;
  }

  .mobile-toggle-btn {
    width: 36px;
    height: 36px;
  }
}

/* ===== 主题适配 ===== */
/* 默认深色主题样式已在上面定义 */

/* 浅色主题适配 - 保持header始终为深色风格 */
/* 移除浅色主题样式，让header始终保持深色Apple风格 */

/* Header始终保持深色Apple风格，不随主题变化 */
</style>
