<template>
  <div class="theme-toggle">
    <button
      class="theme-toggle-btn"
      @click="toggleTheme"
      :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
    >
      <div class="toggle-icon">
        <Transition name="icon-fade" mode="out-in">
          <svg
            v-if="isDark"
            key="sun"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          </svg>
          <svg
            v-else
            key="moon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
          </svg>
        </Transition>
      </div>
      <span v-if="showText" class="toggle-text">
        {{ isDark ? '浅色模式' : '深色模式' }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

// Props
interface Props {
  showText?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  showText: false,
  size: 'medium'
})

// 使用主题
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: inline-block;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: inherit;
  font-size: inherit;
  outline: none;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  transform: translateY(-2px);
}

.theme-toggle-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.theme-toggle-btn:active {
  transform: translateY(0);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  position: relative;
}

.toggle-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* 图标过渡动画 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

/* 浅色主题适配 */
[data-theme="light"] .theme-toggle-btn {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
}

[data-theme="light"] .theme-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.3);
  color: var(--color-text-primary);
}

/* 尺寸变体 */
.theme-toggle-btn.small {
  padding: 6px 10px;
  border-radius: 10px;
}

.theme-toggle-btn.small .toggle-icon {
  width: 16px;
  height: 16px;
}

.theme-toggle-btn.small .toggle-text {
  font-size: 12px;
}

.theme-toggle-btn.large {
  padding: 12px 16px;
  border-radius: 16px;
}

.theme-toggle-btn.large .toggle-icon {
  width: 24px;
  height: 24px;
}

.theme-toggle-btn.large .toggle-text {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toggle-text {
    display: none;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle-btn,
  .icon-fade-enter-active,
  .icon-fade-leave-active {
    transition: none !important;
  }
  
  .icon-fade-enter-from,
  .icon-fade-leave-to {
    transform: none !important;
  }
}
</style>
