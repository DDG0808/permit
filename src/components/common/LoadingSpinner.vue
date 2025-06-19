<template>
  <div class="loading-spinner" :class="{ 'loading-overlay': overlay }">
    <div class="spinner-container" :class="sizeClass">
      <!-- 自定义加载动画 -->
      <div v-if="type === 'custom'" class="custom-spinner">
        <div class="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div v-if="text" class="spinner-text">{{ text }}</div>
      </div>

      <!-- Naive UI 加载组件 -->
      <NSpin v-else :size="size" :show="true">
        <template #description>
          <div v-if="text" class="spinner-description">{{ text }}</div>
        </template>
        <template #icon>
          <NIcon v-if="icon" :size="iconSize">
            <component :is="icon" />
          </NIcon>
        </template>
      </NSpin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpin, NIcon } from 'naive-ui'

// Props
interface Props {
  size?: 'small' | 'medium' | 'large'
  type?: 'default' | 'custom'
  text?: string
  overlay?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'default',
  overlay: false
})

// 计算属性
const sizeClass = computed(() => {
  return `spinner-${props.size}`
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'small': return 16
    case 'large': return 32
    default: return 24
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner-small {
  gap: 8px;
}

.spinner-large {
  gap: 16px;
}

/* 自定义加载动画 */
.custom-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-small .spinner-ring {
  width: 32px;
  height: 32px;
}

.spinner-large .spinner-ring {
  width: 80px;
  height: 80px;
}

.spinner-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #18a058;
  border-radius: 50%;
  animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #18a058 transparent transparent transparent;
}

.spinner-small .spinner-ring div {
  width: 26px;
  height: 26px;
  margin: 3px;
  border-width: 3px;
}

.spinner-large .spinner-ring div {
  width: 64px;
  height: 64px;
  margin: 8px;
  border-width: 8px;
}

.spinner-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes spinner-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 文本样式 */
.spinner-text {
  font-size: 14px;
  color: #666;
  text-align: center;
  font-weight: 500;
}

.spinner-small .spinner-text {
  font-size: 12px;
}

.spinner-large .spinner-text {
  font-size: 16px;
}

.spinner-description {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 8px;
}

.spinner-small .spinner-description {
  font-size: 12px;
  margin-top: 6px;
}

.spinner-large .spinner-description {
  font-size: 16px;
  margin-top: 12px;
}

/* 深色模式 */
[data-theme="dark"] .loading-overlay {
  background: rgba(16, 16, 20, 0.8);
}

[data-theme="dark"] .spinner-text,
[data-theme="dark"] .spinner-description {
  color: #a0a0a0;
}

[data-theme="dark"] .spinner-ring div {
  border-color: #36ad6a transparent transparent transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-spinner {
    padding: 16px;
  }
  
  .spinner-container {
    gap: 10px;
  }
  
  .spinner-text,
  .spinner-description {
    font-size: 13px;
  }
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
  .spinner-ring div {
    animation-duration: 2s;
  }
}

/* 可访问性 */
.loading-spinner[aria-hidden="true"] {
  display: none;
}

.spinner-container {
  role: "status";
  aria-live: "polite";
}

/* 渐入动画 */
.loading-spinner {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 脉冲效果 */
.spinner-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(24, 160, 88, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
  z-index: -1;
}

.spinner-small .spinner-container::before {
  width: 60px;
  height: 60px;
}

.spinner-large .spinner-container::before {
  width: 120px;
  height: 120px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
