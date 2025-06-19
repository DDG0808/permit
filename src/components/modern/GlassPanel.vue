<template>
  <div
    :class="panelClasses"
    :style="panelStyles"
  >
    <!-- 背景装饰层 -->
    <div v-if="decorative" class="glass-panel-decoration">
      <div class="decoration-element decoration-1"></div>
      <div class="decoration-element decoration-2"></div>
      <div class="decoration-element decoration-3"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="glass-panel-content">
      <slot />
    </div>
    
    <!-- 边框光效 -->
    <div v-if="glowing" class="glass-panel-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GlassPanelVariant, GlassPanelIntensity } from '@/types/modern.types'

// Props定义
interface Props {
  variant?: GlassPanelVariant
  intensity?: GlassPanelIntensity
  blur?: number
  opacity?: number
  rounded?: boolean
  bordered?: boolean
  decorative?: boolean
  glowing?: boolean
  floating?: boolean
  width?: string | number
  height?: string | number
  padding?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  intensity: 'medium',
  blur: 10,
  opacity: 0.8,
  rounded: true,
  bordered: true,
  decorative: false,
  glowing: false,
  floating: false
})

// 计算属性
const panelClasses = computed(() => [
  'glass-panel',
  `glass-panel--${props.variant}`,
  `glass-panel--${props.intensity}`,
  {
    'glass-panel--rounded': props.rounded,
    'glass-panel--bordered': props.bordered,
    'glass-panel--decorative': props.decorative,
    'glass-panel--glowing': props.glowing,
    'glass-panel--floating': props.floating
  }
])

const panelStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  if (props.padding) {
    styles.padding = typeof props.padding === 'number' ? `${props.padding}px` : props.padding
  }
  
  // 自定义模糊和透明度
  if (props.blur !== 10 || props.opacity !== 0.8) {
    styles.backdropFilter = `blur(${props.blur}px)`
    styles.webkitBackdropFilter = `blur(${props.blur}px)`
    styles.backgroundColor = `rgba(255, 255, 255, ${props.opacity * 0.1})`
  }
  
  return styles
})
</script>

<style scoped>
/* 玻璃面板基础样式 */
.glass-panel {
  position: relative;
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  transition: all var(--duration-300) var(--ease-out);
  overflow: hidden;
}

/* 变体样式 */
.glass-panel--default {
  background: var(--glass-background);
}

.glass-panel--strong {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter-strong);
  -webkit-backdrop-filter: var(--glass-backdrop-filter-strong);
}

.glass-panel--subtle {
  background: var(--glass-background-subtle);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.glass-panel--primary {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary-alpha-20);
}

.glass-panel--success {
  background: var(--color-success-alpha-10);
  border-color: var(--color-success-alpha-20);
}

.glass-panel--warning {
  background: var(--color-warning-alpha-10);
  border-color: var(--color-warning-alpha-20);
}

.glass-panel--error {
  background: var(--color-error-alpha-10);
  border-color: var(--color-error-alpha-20);
}

/* 强度变体 */
.glass-panel--light {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.glass-panel--medium {
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
}

.glass-panel--heavy {
  background: var(--glass-background-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 圆角样式 */
.glass-panel--rounded {
  border-radius: var(--radius-2xl);
}

/* 边框样式 */
.glass-panel--bordered {
  border: 1px solid var(--glass-border);
}

/* 装饰性样式 */
.glass-panel--decorative .glass-panel-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-element {
  position: absolute;
  border-radius: var(--radius-full);
  background: var(--bg-gradient-primary);
  opacity: 0.1;
  animation: float var(--duration-1000) ease-in-out infinite;
}

.decoration-1 {
  width: 60px;
  height: 60px;
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.decoration-2 {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.decoration-3 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 5%;
  animation-delay: 4s;
}

/* 发光效果 */
.glass-panel--glowing {
  box-shadow: var(--shadow-glass), 0 0 20px var(--color-primary-alpha-20);
}

.glass-panel-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--bg-gradient-primary);
  border-radius: inherit;
  opacity: 0.3;
  z-index: -1;
  filter: blur(4px);
}

/* 浮动效果 */
.glass-panel--floating {
  box-shadow: var(--shadow-glass), var(--shadow-xl);
  transform: translateY(-2px);
}

.glass-panel--floating:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glass), var(--shadow-2xl);
}

/* 内容区域 */
.glass-panel-content {
  position: relative;
  z-index: 1;
  padding: var(--spacing-6);
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .glass-panel--default {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .glass-panel--strong {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .glass-panel--subtle {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .decoration-element {
  background: var(--bg-gradient-secondary);
  opacity: 0.05;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-panel-content {
    padding: var(--spacing-4);
  }
  
  .decoration-element {
    opacity: 0.05;
  }
  
  .glass-panel--floating {
    transform: none;
  }
  
  .glass-panel--floating:hover {
    transform: translateY(-2px);
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .decoration-element {
    animation: none;
  }
  
  .glass-panel {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .glass-panel {
    background: var(--color-background-primary);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 2px solid var(--color-border);
  }
  
  .decoration-element {
    display: none;
  }
}
</style>
