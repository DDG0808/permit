/**
 * 现代化组件库的TypeScript类型定义
 * 为所有现代化组件提供完整的类型支持
 */

// ============================================================================
// 通用类型定义
// ============================================================================

/** 组件尺寸类型 */
export type ComponentSize = 'small' | 'medium' | 'large'

/** 组件变体类型 */
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'

/** 组件状态类型 */
export type ComponentState = 'normal' | 'hover' | 'active' | 'disabled' | 'loading'

// ============================================================================
// ModernButton 组件类型
// ============================================================================

/** 按钮变体类型 */
export type ModernButtonVariant = ComponentVariant

/** 按钮尺寸类型 */
export type ModernButtonSize = ComponentSize

/** 按钮属性接口 */
export interface ModernButtonProps {
  /** 按钮变体 */
  variant?: ModernButtonVariant
  /** 按钮尺寸 */
  size?: ModernButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 图标组件 */
  icon?: any
  /** 是否为块级按钮 */
  block?: boolean
  /** 是否为圆形按钮 */
  round?: boolean
  /** 是否为幽灵按钮 */
  ghost?: boolean
}

/** 按钮事件接口 */
export interface ModernButtonEmits {
  /** 点击事件 */
  click: [event: MouseEvent]
}

// ============================================================================
// ModernCard 组件类型
// ============================================================================

/** 卡片变体类型 */
export type ModernCardVariant = ComponentVariant

/** 卡片尺寸类型 */
export type ModernCardSize = ComponentSize

/** 卡片属性接口 */
export interface ModernCardProps {
  /** 卡片变体 */
  variant?: ModernCardVariant
  /** 卡片尺寸 */
  size?: ModernCardSize
  /** 卡片标题 */
  title?: string
  /** 是否可悬浮 */
  hoverable?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否有边框 */
  bordered?: boolean
  /** 是否为玻璃拟态 */
  glass?: boolean
  /** 是否装饰性 */
  decorative?: boolean
  /** 是否提升 */
  elevated?: boolean
}

/** 卡片事件接口 */
export interface ModernCardEmits {
  /** 点击事件 */
  click: [event: MouseEvent]
}

// ============================================================================
// GlassPanel 组件类型
// ============================================================================

/** 玻璃面板变体类型 */
export type GlassPanelVariant = ComponentVariant | 'strong' | 'subtle'

/** 玻璃面板强度类型 */
export type GlassPanelIntensity = 'light' | 'medium' | 'heavy'

/** 玻璃面板属性接口 */
export interface GlassPanelProps {
  /** 面板变体 */
  variant?: GlassPanelVariant
  /** 模糊强度 */
  intensity?: GlassPanelIntensity
  /** 自定义模糊值 */
  blur?: number
  /** 透明度 */
  opacity?: number
  /** 是否圆角 */
  rounded?: boolean
  /** 是否有边框 */
  bordered?: boolean
  /** 是否装饰性 */
  decorative?: boolean
  /** 是否发光 */
  glowing?: boolean
  /** 是否浮动 */
  floating?: boolean
  /** 宽度 */
  width?: string | number
  /** 高度 */
  height?: string | number
  /** 内边距 */
  padding?: string | number
}

// ============================================================================
// ModernInput 组件类型
// ============================================================================

/** 输入框变体类型 */
export type ModernInputVariant = ComponentVariant

/** 输入框尺寸类型 */
export type ModernInputSize = ComponentSize

/** 输入框类型 */
export type ModernInputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'

/** 输入框属性接口 */
export interface ModernInputProps {
  /** 输入值 */
  modelValue?: string | number
  /** 输入框类型 */
  type?: ModernInputType
  /** 输入框尺寸 */
  size?: ModernInputSize
  /** 输入框变体 */
  variant?: ModernInputVariant
  /** 标签文本 */
  label?: string
  /** 占位符文本 */
  placeholder?: string
  /** 帮助文本 */
  helpText?: string
  /** 错误信息 */
  errorMessage?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否必填 */
  required?: boolean
  /** 是否可清除 */
  clearable?: boolean
  /** 是否显示字符计数 */
  showCount?: boolean
  /** 最大长度 */
  maxlength?: number
  /** 自动完成 */
  autocomplete?: string
  /** 前缀图标 */
  prefixIcon?: any
  /** 后缀图标 */
  suffixIcon?: any
}

/** 输入框事件接口 */
export interface ModernInputEmits {
  /** 值更新事件 */
  'update:modelValue': [value: string]
  /** 获得焦点事件 */
  focus: [event: FocusEvent]
  /** 失去焦点事件 */
  blur: [event: FocusEvent]
  /** 清除事件 */
  clear: []
  /** 键盘按下事件 */
  keydown: [event: KeyboardEvent]
}

// ============================================================================
// 主题相关类型
// ============================================================================

/** 主题模式类型 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** 主题配置接口 */
export interface ThemeConfig {
  /** 主题模式 */
  mode: ThemeMode
  /** 主色调 */
  primaryColor?: string
  /** 成功色 */
  successColor?: string
  /** 警告色 */
  warningColor?: string
  /** 错误色 */
  errorColor?: string
  /** 圆角大小 */
  borderRadius?: number
  /** 字体大小 */
  fontSize?: number
}

// ============================================================================
// 动画相关类型
// ============================================================================

/** 动画类型 */
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'elastic'

/** 动画方向类型 */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'in' | 'out'

/** 动画配置接口 */
export interface AnimationConfig {
  /** 动画类型 */
  type: AnimationType
  /** 动画方向 */
  direction?: AnimationDirection
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 动画延迟（毫秒） */
  delay?: number
  /** 动画缓动函数 */
  easing?: string
  /** 是否循环 */
  loop?: boolean
}

// ============================================================================
// 响应式相关类型
// ============================================================================

/** 断点类型 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** 响应式值类型 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

/** 间距类型 */
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64

/** 响应式间距类型 */
export type ResponsiveSpacing = ResponsiveValue<Spacing>

// ============================================================================
// 工具类型
// ============================================================================

/** 可选属性类型 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 必需属性类型 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/** 深度部分类型 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** 深度只读类型 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// ============================================================================
// 组件实例类型
// ============================================================================

/** 现代化按钮组件实例类型 */
export interface ModernButtonInstance {
  /** 获得焦点 */
  focus(): void
  /** 失去焦点 */
  blur(): void
}

/** 现代化输入框组件实例类型 */
export interface ModernInputInstance {
  /** 获得焦点 */
  focus(): void
  /** 失去焦点 */
  blur(): void
  /** 选中所有文本 */
  select(): void
}

// ============================================================================
// 所有类型已在上面直接导出，无需重复导出
// ============================================================================
