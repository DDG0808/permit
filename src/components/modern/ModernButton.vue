<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="modern-button-loading">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- 图标 -->
    <div v-if="icon && !loading" class="modern-button-icon">
      <component :is="icon" />
    </div>
    
    <!-- 内容 -->
    <span v-if="$slots.default" class="modern-button-content">
      <slot />
    </span>
    
    <!-- 涟漪效果 -->
    <div ref="rippleContainer" class="modern-button-ripple"></div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ModernButtonProps, ModernButtonVariant, ModernButtonSize } from '@/types/modern.types'

// Props定义
interface Props {
  variant?: ModernButtonVariant
  size?: ModernButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: any
  block?: boolean
  round?: boolean
  ghost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
  round: false,
  ghost: false
})

// Emits定义
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 响应式引用
const rippleContainer = ref<HTMLElement>()

// 计算属性
const buttonClasses = computed(() => [
  'modern-button',
  `modern-button--${props.variant}`,
  `modern-button--${props.size}`,
  {
    'modern-button--disabled': props.disabled,
    'modern-button--loading': props.loading,
    'modern-button--block': props.block,
    'modern-button--round': props.round,
    'modern-button--ghost': props.ghost
  }
])

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  
  // 创建涟漪效果
  createRipple(event)
  
  emit('click', event)
}

const handleMouseEnter = () => {
  // 鼠标悬浮效果
}

const handleMouseLeave = () => {
  // 鼠标离开效果
}

// 涟漪效果
const createRipple = (event: MouseEvent) => {
  if (!rippleContainer.value) return
  
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  const ripple = document.createElement('div')
  ripple.className = 'ripple-effect'
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  
  rippleContainer.value.appendChild(ripple)
  
  // 动画结束后移除元素
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, 600)
}
</script>

<style scoped>
/* 现代化按钮基础样式 */
.modern-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-family-system);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-out);
  overflow: hidden;
  user-select: none;
  outline: none;
  background: transparent;
  
  /* 防止文本选择 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.modern-button:focus-visible {
  outline: 2px solid var(--color-primary-alpha-50);
  outline-offset: 2px;
}

/* 尺寸变体 */
.modern-button--small {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
}

.modern-button--medium {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-base);
}

.modern-button--large {
  height: 48px;
  padding: 0 var(--spacing-6);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-xl);
}

/* 颜色变体 */
.modern-button--primary {
  background: var(--bg-gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.modern-button--primary:hover:not(.modern-button--disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modern-button--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.modern-button--secondary:hover:not(.modern-button--disabled) {
  background: var(--color-background-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.modern-button--success {
  background: var(--bg-gradient-success);
  color: white;
  box-shadow: var(--shadow-md);
}

.modern-button--warning {
  background: var(--bg-gradient-warning);
  color: white;
  box-shadow: var(--shadow-md);
}

.modern-button--error {
  background: var(--bg-gradient-error);
  color: white;
  box-shadow: var(--shadow-md);
}

/* 幽灵按钮 */
.modern-button--ghost {
  background: transparent !important;
  border: 1px solid currentColor;
  box-shadow: none !important;
}

.modern-button--ghost.modern-button--primary {
  color: var(--color-primary);
}

.modern-button--ghost:hover:not(.modern-button--disabled) {
  background: var(--color-primary-alpha-10) !important;
}

/* 圆形按钮 */
.modern-button--round {
  border-radius: var(--radius-full);
}

/* 块级按钮 */
.modern-button--block {
  width: 100%;
}

/* 禁用状态 */
.modern-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 加载状态 */
.modern-button--loading {
  cursor: wait;
}

.modern-button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: var(--radius-full);
  animation: spin var(--duration-1000) linear infinite;
}

/* 图标样式 */
.modern-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
}

/* 内容样式 */
.modern-button-content {
  display: flex;
  align-items: center;
}

/* 涟漪效果容器 */
.modern-button-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

/* 涟漪效果 */
.ripple-effect {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  transform: scale(0);
  animation: ripple var(--duration-700) ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .modern-button--secondary {
  background: var(--color-background-elevated);
  border-color: var(--color-border-secondary);
}

[data-theme="dark"] .modern-button--secondary:hover:not(.modern-button--disabled) {
  background: var(--color-background-elevated-hover);
}
</style>
