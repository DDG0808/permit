/**
 * 现代化组件库入口文件
 * 统一导出所有现代化组件和相关类型
 */

// ============================================================================
// 组件导入
// ============================================================================

import ModernButton from './ModernButton.vue'
import ModernCard from './ModernCard.vue'
import GlassPanel from './GlassPanel.vue'
import ModernInput from './ModernInput.vue'

// ============================================================================
// 类型导入
// ============================================================================

export type {
  // 通用类型
  ComponentSize,
  ComponentVariant,
  ComponentState,
  
  // 按钮相关类型
  ModernButtonVariant,
  ModernButtonSize,
  ModernButtonProps,
  ModernButtonEmits,
  ModernButtonInstance,
  
  // 卡片相关类型
  ModernCardVariant,
  ModernCardSize,
  ModernCardProps,
  ModernCardEmits,
  
  // 玻璃面板相关类型
  GlassPanelVariant,
  GlassPanelIntensity,
  GlassPanelProps,
  
  // 输入框相关类型
  ModernInputVariant,
  ModernInputSize,
  ModernInputType,
  ModernInputProps,
  ModernInputEmits,
  ModernInputInstance,
  
  // 主题相关类型
  ThemeMode,
  ThemeConfig,
  
  // 动画相关类型
  AnimationType,
  AnimationDirection,
  AnimationConfig,
  
  // 响应式相关类型
  Breakpoint,
  ResponsiveValue,
  Spacing,
  ResponsiveSpacing,
  
  // 工具类型
  Optional,
  RequiredProps,
  DeepPartial,
  DeepReadonly
} from '@/types/modern.types'

// ============================================================================
// 组件导出
// ============================================================================

export {
  ModernButton,
  ModernCard,
  GlassPanel,
  ModernInput
}

// ============================================================================
// 组件库对象
// ============================================================================

const ModernUIComponents = {
  ModernButton,
  ModernCard,
  GlassPanel,
  ModernInput
}

// ============================================================================
// 组件安装函数（用于Vue插件）
// ============================================================================

import type { App } from 'vue'

/**
 * 安装现代化组件库
 * @param app Vue应用实例
 * @param options 安装选项
 */
export function install(app: App, options?: {
  /** 组件名前缀 */
  prefix?: string
  /** 是否全局注册所有组件 */
  registerAll?: boolean
  /** 要注册的组件列表 */
  components?: string[]
}) {
  const {
    prefix = 'Modern',
    registerAll = true,
    components = []
  } = options || {}

  // 组件映射
  const componentMap = {
    Button: ModernButton,
    Card: ModernCard,
    GlassPanel: GlassPanel,
    Input: ModernInput
  }

  // 注册组件
  if (registerAll) {
    // 注册所有组件
    Object.entries(componentMap).forEach(([name, component]) => {
      app.component(`${prefix}${name}`, component)
    })
  } else if (components.length > 0) {
    // 注册指定组件
    components.forEach(name => {
      const component = componentMap[name as keyof typeof componentMap]
      if (component) {
        app.component(`${prefix}${name}`, component)
      }
    })
  }
}

// ============================================================================
// 组件库信息
// ============================================================================

export const version = '1.0.0'
export const name = 'Modern UI Components'
export const description = '基于Apple Design Award设计趋势的现代化Vue组件库'

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查是否为有效的组件尺寸
 * @param size 尺寸值
 * @returns 是否有效
 */
export function isValidSize(size: string): size is import('@/types/modern.types').ComponentSize {
  return ['small', 'medium', 'large'].includes(size)
}

/**
 * 检查是否为有效的组件变体
 * @param variant 变体值
 * @returns 是否有效
 */
export function isValidVariant(variant: string): variant is import('@/types/modern.types').ComponentVariant {
  return ['default', 'primary', 'secondary', 'success', 'warning', 'error'].includes(variant)
}

/**
 * 获取组件的CSS类名
 * @param component 组件名
 * @param variant 变体
 * @param size 尺寸
 * @param modifiers 修饰符
 * @returns CSS类名数组
 */
export function getComponentClasses(
  component: string,
  variant?: import('@/types/modern.types').ComponentVariant,
  size?: import('@/types/modern.types').ComponentSize,
  modifiers?: Record<string, boolean>
): string[] {
  const classes = [`modern-${component}`]
  
  if (variant) {
    classes.push(`modern-${component}--${variant}`)
  }
  
  if (size) {
    classes.push(`modern-${component}--${size}`)
  }
  
  if (modifiers) {
    Object.entries(modifiers).forEach(([key, value]) => {
      if (value) {
        classes.push(`modern-${component}--${key}`)
      }
    })
  }
  
  return classes
}

/**
 * 创建响应式值处理器
 * @param value 响应式值
 * @param breakpoints 断点配置
 * @returns 处理后的值
 */
export function createResponsiveValue<T>(
  value: import('@/types/modern.types').ResponsiveValue<T>,
  breakpoints: Record<import('@/types/modern.types').Breakpoint, number>
): T {
  if (typeof value === 'object' && value !== null) {
    // 根据当前屏幕宽度返回对应的值
    const width = window.innerWidth
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a)

    for (const [breakpoint, minWidth] of sortedBreakpoints) {
      const breakpointKey = breakpoint as keyof typeof value
      if (width >= minWidth && value[breakpointKey] !== undefined) {
        return value[breakpointKey] as T
      }
    }

    // 返回默认值（最小断点的值）
    const defaultBreakpoint = sortedBreakpoints[sortedBreakpoints.length - 1][0] as keyof typeof value
    return value[defaultBreakpoint] as T
  }

  return value as T
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID
 */
export function generateId(prefix = 'modern'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param fn 要节流的函数
 * @param delay 延迟时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

// ============================================================================
// Vue插件导出
// ============================================================================

export const ModernUI = {
  install,
  version,
  name,
  description
}

// 默认导出
export default ModernUI
