<template>
  <div class="version-switcher" :class="{ expanded: isExpanded }">
    <!-- 切换按钮 -->
    <button 
      class="switcher-toggle"
      @click="toggleExpanded"
      :title="isExpanded ? '收起版本切换器' : '展开版本切换器'"
    >
      <div class="toggle-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        </svg>
      </div>
      <span class="toggle-text">版本切换</span>
      <div class="toggle-arrow" :class="{ rotated: isExpanded }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>
    </button>

    <!-- 版本选项面板 -->
    <Transition name="panel">
      <div v-if="isExpanded" class="switcher-panel">
        <div class="panel-header">
          <h3 class="panel-title">选择查看版本</h3>
          <p class="panel-subtitle">体验不同的设计风格</p>
        </div>

        <div class="version-options">
          <!-- 原版设计 -->
          <div class="version-option" :class="{ active: currentVersion === 'original' }">
            <div class="option-preview">
              <div class="preview-thumbnail original">
                <div class="thumbnail-content">
                  <div class="mock-header"></div>
                  <div class="mock-content">
                    <div class="mock-title"></div>
                    <div class="mock-text"></div>
                    <div class="mock-buttons">
                      <div class="mock-btn primary"></div>
                      <div class="mock-btn secondary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="option-info">
              <h4 class="option-title">原版设计</h4>
              <p class="option-description">基于Naive UI的实用设计</p>
              <div class="option-features">
                <span class="feature-tag">Naive UI</span>
                <span class="feature-tag">实用导向</span>
                <span class="feature-tag">快速开发</span>
              </div>
            </div>
            <div class="option-actions">
              <button 
                class="action-btn view-btn"
                @click="navigateTo('/')"
                :disabled="currentVersion === 'original'"
              >
                {{ currentVersion === 'original' ? '当前版本' : '查看' }}
              </button>
            </div>
          </div>

          <!-- Apple风格优化 -->
          <div class="version-option premium" :class="{ active: currentVersion === 'optimized' }">
            <div class="option-preview">
              <div class="preview-thumbnail optimized">
                <div class="thumbnail-content">
                  <div class="mock-gradient"></div>
                  <div class="mock-content">
                    <div class="mock-badge"></div>
                    <div class="mock-title gradient"></div>
                    <div class="mock-text"></div>
                    <div class="mock-buttons">
                      <div class="mock-btn gradient"></div>
                      <div class="mock-btn glass"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="option-info">
              <h4 class="option-title">
                Apple风格优化
                <span class="premium-badge">✨ Premium</span>
              </h4>
              <p class="option-description">基于Apple Design Award标准的精致设计</p>
              <div class="option-features">
                <span class="feature-tag premium">Apple Design</span>
                <span class="feature-tag premium">高端质感</span>
                <span class="feature-tag premium">沉浸体验</span>
              </div>
            </div>
            <div class="option-actions">
              <button 
                class="action-btn view-btn premium"
                @click="navigateTo('/home-optimized')"
                :disabled="currentVersion === 'optimized'"
              >
                {{ currentVersion === 'optimized' ? '当前版本' : '体验' }}
              </button>
            </div>
          </div>

          <!-- 对比模式 -->
          <div class="version-option comparison">
            <div class="option-preview">
              <div class="preview-thumbnail comparison">
                <div class="thumbnail-content">
                  <div class="split-preview">
                    <div class="split-left">
                      <div class="mini-header"></div>
                      <div class="mini-content"></div>
                    </div>
                    <div class="split-divider"></div>
                    <div class="split-right">
                      <div class="mini-gradient"></div>
                      <div class="mini-content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="option-info">
              <h4 class="option-title">对比模式</h4>
              <p class="option-description">并排对比两种设计风格</p>
              <div class="option-features">
                <span class="feature-tag">分屏对比</span>
                <span class="feature-tag">设计分析</span>
                <span class="feature-tag">多设备预览</span>
              </div>
            </div>
            <div class="option-actions">
              <button 
                class="action-btn view-btn comparison"
                @click="navigateTo('/ui-comparison')"
                :disabled="currentVersion === 'comparison'"
              >
                {{ currentVersion === 'comparison' ? '当前页面' : '对比' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="quick-links">
          <h4 class="links-title">快速链接</h4>
          <div class="links-grid">
            <button class="quick-link" @click="navigateTo('/animation-demo')">
              <span class="link-icon">🎭</span>
              <span class="link-text">动画演示</span>
            </button>
            <button class="quick-link" @click="navigateTo('/responsive-test')">
              <span class="link-icon">📱</span>
              <span class="link-text">响应式测试</span>
            </button>
            <button class="quick-link" @click="openGitHub">
              <span class="link-icon">🔗</span>
              <span class="link-text">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 背景遮罩 -->
    <Transition name="overlay">
      <div 
        v-if="isExpanded" 
        class="switcher-overlay"
        @click="toggleExpanded"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isExpanded = ref(false)

// 计算当前版本
const currentVersion = computed(() => {
  const path = route.path
  if (path === '/home-optimized') return 'optimized'
  if (path === '/ui-comparison') return 'comparison'
  return 'original'
})

// 切换展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path)
  isExpanded.value = false
}

// 打开GitHub
const openGitHub = () => {
  window.open('https://github.com/your-repo/open-source-license-helper', '_blank')
  isExpanded.value = false
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isExpanded.value) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.version-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.switcher-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.switcher-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.toggle-icon {
  color: #007AFF;
}

.toggle-arrow {
  transition: transform 0.3s ease;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

.switcher-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 400px;
  max-width: 90vw;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.panel-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
}

.panel-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.version-options {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.version-option {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.version-option:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.version-option.active {
  background: rgba(0, 122, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.3);
}

.version-option.premium {
  border-color: rgba(0, 122, 255, 0.2);
}

.version-option.premium:hover {
  border-color: rgba(0, 122, 255, 0.4);
}

.option-preview {
  flex-shrink: 0;
}

.preview-thumbnail {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.preview-thumbnail.original {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.preview-thumbnail.optimized {
  background: linear-gradient(135deg, #000000, #1a1a1a);
}

.preview-thumbnail.comparison {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.thumbnail-content {
  width: 100%;
  height: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mock-header {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

.mock-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mock-title {
  height: 4px;
  width: 70%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1px;
}

.mock-title.gradient {
  background: linear-gradient(90deg, #007AFF, #5AC8FA);
}

.mock-text {
  height: 2px;
  width: 90%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

.mock-buttons {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.mock-btn {
  height: 4px;
  width: 16px;
  border-radius: 2px;
}

.mock-btn.primary {
  background: #007AFF;
}

.mock-btn.secondary {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.mock-btn.gradient {
  background: linear-gradient(90deg, #007AFF, #5AC8FA);
}

.mock-btn.glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mock-gradient {
  height: 8px;
  background: linear-gradient(135deg, #007AFF, #5AC8FA);
  border-radius: 1px;
  margin-bottom: 2px;
}

.mock-badge {
  height: 3px;
  width: 20px;
  background: rgba(0, 122, 255, 0.3);
  border-radius: 2px;
  margin-bottom: 2px;
}

.split-preview {
  display: flex;
  height: 100%;
}

.split-left,
.split-right {
  flex: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.split-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.mini-header {
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

.mini-content {
  flex: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 1px;
}

.mini-gradient {
  height: 4px;
  background: linear-gradient(90deg, #007AFF, #5AC8FA);
  border-radius: 1px;
  margin-bottom: 1px;
}

.option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.premium-badge {
  font-size: 0.75rem;
  color: #007AFF;
}

.option-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}

.option-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.feature-tag {
  padding: 0.125rem 0.375rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.feature-tag.premium {
  background: rgba(0, 122, 255, 0.2);
  color: #5AC8FA;
}

.option-actions {
  display: flex;
  align-items: flex-end;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.premium {
  background: rgba(0, 122, 255, 0.2);
  border-color: rgba(0, 122, 255, 0.4);
  color: #5AC8FA;
}

.action-btn.premium:hover:not(:disabled) {
  background: rgba(0, 122, 255, 0.3);
}

.action-btn.comparison {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
  color: #a78bfa;
}

.quick-links {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.links-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.75rem 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 1rem;
}

.link-text {
  font-weight: 500;
}

.switcher-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: -1;
}

/* 动画 */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .version-switcher {
    top: 10px;
    right: 10px;
  }
  
  .switcher-panel {
    width: calc(100vw - 20px);
    right: -10px;
  }
  
  .version-option {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .option-actions {
    align-items: flex-start;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
