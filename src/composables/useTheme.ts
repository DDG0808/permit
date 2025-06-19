/**
 * 全局主题管理系统
 * 提供统一的主题切换和状态管理
 */

import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import type { Ref, InjectionKey } from 'vue'

// 主题类型定义
export type Theme = 'light' | 'dark'
export type ThemeMode = Theme | 'auto'

// 主题状态接口
export interface ThemeState {
  theme: Ref<Theme>
  mode: Ref<ThemeMode>
  isDark: Ref<boolean>
  isLight: Ref<boolean>
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  setMode: (mode: ThemeMode) => void
}

// 注入键
const THEME_KEY: InjectionKey<ThemeState> = Symbol('theme')

// 存储键
const STORAGE_KEY = 'app-theme-mode'

// 系统主题检测
const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 应用主题到DOM
const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  
  // 更新meta标签
  updateMetaThemeColor(theme)
  
  // 触发自定义事件
  const event = new CustomEvent('theme-changed', {
    detail: { theme, isDark: theme === 'dark' }
  })
  window.dispatchEvent(event)
}

// 更新meta主题色
const updateMetaThemeColor = (theme: Theme) => {
  if (typeof document === 'undefined') return
  
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  const color = theme === 'dark' ? '#000000' : '#ffffff'
  
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color)
  } else {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = color
    document.head.appendChild(meta)
  }
}

// 存储主题模式
const saveThemeMode = (mode: ThemeMode) => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch (error) {
    console.warn('Failed to save theme mode:', error)
  }
}

// 读取主题模式
const loadThemeMode = (): ThemeMode => {
  if (typeof localStorage === 'undefined') return 'dark'
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved as ThemeMode
    }
  } catch (error) {
    console.warn('Failed to load theme mode:', error)
  }
  return 'dark' // 默认深色模式
}

// 计算实际主题
const computeTheme = (mode: ThemeMode): Theme => {
  if (mode === 'auto') {
    return getSystemTheme()
  }
  return mode
}

/**
 * 创建主题管理器
 */
export function createTheme(): ThemeState {
  // 响应式状态
  const mode = ref<ThemeMode>('dark')
  const theme = ref<Theme>('dark')
  
  // 计算属性
  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')
  
  // 更新主题
  const updateTheme = () => {
    const newTheme = computeTheme(mode.value)
    if (theme.value !== newTheme) {
      theme.value = newTheme
      applyTheme(newTheme)
    }
  }
  
  // 设置主题模式
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    saveThemeMode(newMode)
    updateTheme()
  }
  
  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setMode(newTheme)
  }
  
  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  // 监听模式变化
  watch(mode, updateTheme, { immediate: false })
  
  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (mode.value === 'auto') {
        updateTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // 清理函数
    const cleanup = () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
    
    // 在组件卸载时清理
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', cleanup)
    }
  }
  
  // 初始化
  const initialize = () => {
    const savedMode = loadThemeMode()
    mode.value = savedMode
    updateTheme()
  }
  
  // 立即初始化
  initialize()
  
  return {
    theme,
    mode,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    setMode
  }
}

/**
 * 提供主题状态
 */
export function provideTheme(): ThemeState {
  const themeState = createTheme()
  provide(THEME_KEY, themeState)
  return themeState
}

/**
 * 注入主题状态
 */
export function useTheme(): ThemeState {
  const themeState = inject(THEME_KEY)
  if (!themeState) {
    throw new Error('useTheme must be used within a theme provider')
  }
  return themeState
}

/**
 * 独立使用主题（不依赖注入）
 */
export function useThemeStandalone(): ThemeState {
  return createTheme()
}
