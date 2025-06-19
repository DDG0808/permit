<template>
  <div
    :class="cardClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <!-- 背景装饰 -->
    <div v-if="decorative" class="modern-card-decoration"></div>
    
    <!-- 头部 -->
    <div v-if="$slots.header || title" class="modern-card-header">
      <slot name="header">
        <h3 v-if="title" class="modern-card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.extra" class="modern-card-extra">
        <slot name="extra" />
      </div>
    </div>
    
    <!-- 内容 -->
    <div class="modern-card-content">
      <slot />
    </div>
    
    <!-- 底部 -->
    <div v-if="$slots.footer" class="modern-card-footer">
      <slot name="footer" />
    </div>
    
    <!-- 悬浮指示器 -->
    <div v-if="hoverable" class="modern-card-hover-indicator"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ModernCardVariant, ModernCardSize } from '@/types/modern.types'

// Props定义
interface Props {
  variant?: ModernCardVariant
  size?: ModernCardSize
  title?: string
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  bordered?: boolean
  glass?: boolean
  decorative?: boolean
  elevated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  hoverable: false,
  clickable: false,
  loading: false,
  bordered: true,
  glass: false,
  decorative: false,
  elevated: false
})

// Emits定义
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// 计算属性
const cardClasses = computed(() => [
  'modern-card',
  `modern-card--${props.variant}`,
  `modern-card--${props.size}`,
  {
    'modern-card--hoverable': props.hoverable,
    'modern-card--clickable': props.clickable,
    'modern-card--loading': props.loading,
    'modern-card--bordered': props.bordered,
    'modern-card--glass': props.glass,
    'modern-card--decorative': props.decorative,
    'modern-card--elevated': props.elevated
  }
])

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const handleMouseEnter = () => {
  // 鼠标悬浮效果
}

const handleMouseLeave = () => {
  // 鼠标离开效果
}
</script>

<style scoped>
/* 现代化卡片基础样式 */
.modern-card {
  position: relative;
  background: var(--color-background-primary);
  border-radius: var(--radius-2xl);
  transition: all var(--duration-300) var(--ease-out);
  overflow: hidden;
}

/* 尺寸变体 */
.modern-card--small {
  padding: var(--spacing-4);
}

.modern-card--medium {
  padding: var(--spacing-6);
}

.modern-card--large {
  padding: var(--spacing-8);
}

/* 颜色变体 */
.modern-card--default {
  background: var(--color-background-primary);
  box-shadow: var(--shadow-sm);
}

.modern-card--primary {
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-20);
}

.modern-card--success {
  background: var(--color-success-alpha-10);
  border: 1px solid var(--color-success-alpha-20);
}

.modern-card--warning {
  background: var(--color-warning-alpha-10);
  border: 1px solid var(--color-warning-alpha-20);
}

.modern-card--error {
  background: var(--color-error-alpha-10);
  border: 1px solid var(--color-error-alpha-20);
}

/* 边框样式 */
.modern-card--bordered {
  border: 1px solid var(--color-border);
}

/* 玻璃拟态效果 */
.modern-card--glass {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

/* 装饰性样式 */
.modern-card--decorative {
  background: linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%);
}

.modern-card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: var(--bg-gradient-primary);
  opacity: 0.1;
  border-radius: 0 var(--radius-2xl) 0 100%;
  pointer-events: none;
}

/* 悬浮效果 */
.modern-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.modern-card--glass.modern-card--hoverable:hover {
  box-shadow: var(--shadow-xl), var(--shadow-glass);
  border-color: var(--color-primary-alpha-20);
}

/* 可点击样式 */
.modern-card--clickable {
  cursor: pointer;
}

.modern-card--clickable:active {
  transform: translateY(-2px);
}

/* 提升效果 */
.modern-card--elevated {
  box-shadow: var(--shadow-lg);
}

/* 加载状态 */
.modern-card--loading {
  position: relative;
  pointer-events: none;
}

.modern-card--loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-primary);
  opacity: 0.8;
  z-index: 1;
}

.modern-card--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin var(--duration-1000) linear infinite;
  z-index: 2;
}

/* 头部样式 */
.modern-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--color-separator-non-opaque);
}

.modern-card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-family: var(--font-family-system);
}

.modern-card-extra {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* 内容样式 */
.modern-card-content {
  flex: 1;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* 底部样式 */
.modern-card-footer {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-separator-non-opaque);
}

/* 悬浮指示器 */
.modern-card-hover-indicator {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity var(--duration-200) var(--ease-out);
}

.modern-card--hoverable:hover .modern-card-hover-indicator {
  opacity: 1;
}

/* 动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .modern-card--default {
  background: var(--color-background-elevated);
  border-color: var(--color-border-secondary);
}

[data-theme="dark"] .modern-card--decorative {
  background: linear-gradient(135deg, var(--color-background-elevated) 0%, var(--color-background-secondary) 100%);
}

[data-theme="dark"] .modern-card-decoration {
  opacity: 0.05;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-card--large {
    padding: var(--spacing-6);
  }
  
  .modern-card--medium {
    padding: var(--spacing-4);
  }
  
  .modern-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .modern-card-extra {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
