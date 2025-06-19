<template>
  <div class="theme-toggle">
    <NButton
      :type="buttonType"
      :size="size"
      :circle="circle"
      :quaternary="quaternary"
      @click="toggleTheme"
      :title="tooltipText"
      class="theme-toggle-button"
    >
      <template #icon>
        <NIcon :size="iconSize">
          <Transition name="theme-icon" mode="out-in">
            <SunnyOutline v-if="isDark" key="sun" />
            <MoonOutline v-else key="moon" />
          </Transition>
        </NIcon>
      </template>
      <span v-if="showText" class="theme-toggle-text">
        {{ isDark ? '浅色模式' : '深色模式' }}
      </span>
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useOsTheme } from 'naive-ui'
import { NButton, NIcon } from 'naive-ui'
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5'

// Props
interface Props {
  size?: 'tiny' | 'small' | 'medium' | 'large'
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  circle?: boolean
  quaternary?: boolean
  showText?: boolean
  persistent?: boolean // 是否持久化主题设置
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'default',
  circle: true,
  quaternary: true,
  showText: false,
  persistent: true
})

// 响应式状态
const isDark = ref(false)
const osTheme = useOsTheme()

// 计算属性
const buttonType = computed(() => {
  return props.quaternary ? 'default' : props.type
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'tiny': return 14
    case 'small': return 16
    case 'large': return 20
    default: return 18
  }
})

const tooltipText = computed(() => {
  return isDark.value ? '切换到浅色模式' : '切换到深色模式'
})

// 主题管理
const THEME_KEY = 'app-theme'

const getStoredTheme = (): string | null => {
  if (!props.persistent) return null
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

const setStoredTheme = (theme: string) => {
  if (!props.persistent) return
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // 忽略存储错误
  }
}

const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
  const root = document.documentElement
  
  if (theme === 'auto') {
    // 跟随系统主题
    const systemIsDark = osTheme.value === 'dark'
    isDark.value = systemIsDark
    root.setAttribute('data-theme', systemIsDark ? 'dark' : 'light')
  } else {
    isDark.value = theme === 'dark'
    root.setAttribute('data-theme', theme)
  }
  
  // 更新meta标签以支持状态栏样式
  updateMetaThemeColor(isDark.value)
}

const updateMetaThemeColor = (dark: boolean) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  const color = dark ? '#101014' : '#ffffff'
  
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color)
  } else {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.head.appendChild(meta)
  }
}

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  applyTheme(newTheme)
  setStoredTheme(newTheme)
  
  // 触发自定义事件
  const event = new CustomEvent('theme-changed', {
    detail: { theme: newTheme, isDark: isDark.value }
  })
  window.dispatchEvent(event)
}

// 初始化主题
const initTheme = () => {
  // 强制使用深色模式
  applyTheme('dark')
  setStoredTheme('dark')
}

// 移除系统主题监听，始终保持深色模式

// 生命周期
onMounted(() => {
  initTheme()
  
  // 监听存储变化（多标签页同步）
  if (props.persistent) {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_KEY && e.newValue) {
        applyTheme(e.newValue as 'light' | 'dark' | 'auto')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 清理
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }
})

// 暴露方法给父组件
defineExpose({
  toggleTheme,
  isDark: computed(() => isDark.value),
  setTheme: applyTheme
})
</script>

<style scoped>
.theme-toggle {
  display: inline-block;
}

.theme-toggle-button {
  transition: all var(--transition-duration-medium) var(--cubic-bezier-ease-in-out);
}

.theme-toggle-button:hover {
  transform: translateY(-1px);
}

.theme-toggle-text {
  margin-left: var(--space-small);
  font-weight: 500;
}

/* 主题图标过渡动画 */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

/* 深色模式下的特殊样式 */
[data-theme="dark"] .theme-toggle-button {
  color: var(--text-color-1);
}

[data-theme="dark"] .theme-toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 浅色模式下的特殊样式 */
[data-theme="light"] .theme-toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-text {
    display: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .theme-toggle-button {
    border: 2px solid currentColor;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle-button,
  .theme-icon-enter-active,
  .theme-icon-leave-active {
    transition: none !important;
  }
  
  .theme-icon-enter-from,
  .theme-icon-leave-to {
    transform: none !important;
  }
}

/* 焦点样式 */
.theme-toggle-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 活跃状态 */
.theme-toggle-button:active {
  transform: translateY(0) scale(0.95);
}

/* 禁用状态 */
.theme-toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 加载状态 */
.theme-toggle-button.loading {
  pointer-events: none;
}

.theme-toggle-button.loading .n-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
