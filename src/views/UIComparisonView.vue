<template>
  <div class="ui-comparison">
    <!-- 页面头部 -->
    <div class="comparison-header">
      <div class="header-content">
        <h1 class="header-title">UI设计对比展示</h1>
        <p class="header-subtitle">
          基于Apple Design Award标准的界面优化对比
        </p>
        <div class="header-badges">
          <span class="badge original">原版设计</span>
          <span class="badge optimized">Apple风格优化</span>
        </div>
      </div>
    </div>

    <!-- 对比控制面板 -->
    <div class="comparison-controls">
      <div class="controls-container">
        <div class="control-group">
          <label class="control-label">查看模式:</label>
          <div class="view-toggle">
            <button 
              :class="['toggle-btn', { active: viewMode === 'split' }]"
              @click="viewMode = 'split'"
            >
              分屏对比
            </button>
            <button 
              :class="['toggle-btn', { active: viewMode === 'original' }]"
              @click="viewMode = 'original'"
            >
              原版设计
            </button>
            <button 
              :class="['toggle-btn', { active: viewMode === 'optimized' }]"
              @click="viewMode = 'optimized'"
            >
              优化版本
            </button>
          </div>
        </div>
        
        <div class="control-group">
          <label class="control-label">设备预览:</label>
          <div class="device-toggle">
            <button 
              :class="['device-btn', { active: deviceMode === 'desktop' }]"
              @click="deviceMode = 'desktop'"
            >
              🖥️ 桌面
            </button>
            <button 
              :class="['device-btn', { active: deviceMode === 'tablet' }]"
              @click="deviceMode = 'tablet'"
            >
              📱 平板
            </button>
            <button 
              :class="['device-btn', { active: deviceMode === 'mobile' }]"
              @click="deviceMode = 'mobile'"
            >
              📱 手机
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比展示区域 -->
    <div class="comparison-showcase" :class="[viewMode, deviceMode]">
      <!-- 分屏模式 -->
      <div v-if="viewMode === 'split'" class="split-view">
        <div class="split-panel original-panel">
          <div class="panel-header">
            <h3 class="panel-title">原版设计</h3>
            <div class="panel-tags">
              <span class="tag">当前版本</span>
              <span class="tag">Naive UI</span>
            </div>
          </div>
          <div class="panel-content">
            <iframe 
              src="/home" 
              :class="['preview-frame', deviceMode]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
        
        <div class="split-divider">
          <div class="divider-line"></div>
          <div class="divider-handle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        <div class="split-panel optimized-panel">
          <div class="panel-header">
            <h3 class="panel-title">Apple风格优化</h3>
            <div class="panel-tags">
              <span class="tag premium">优化版本</span>
              <span class="tag premium">Apple Design</span>
            </div>
          </div>
          <div class="panel-content">
            <iframe 
              src="/home-optimized" 
              :class="['preview-frame', deviceMode]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
      
      <!-- 单一视图模式 -->
      <div v-else class="single-view">
        <div class="single-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              {{ viewMode === 'original' ? '原版设计' : 'Apple风格优化' }}
            </h3>
            <div class="panel-actions">
              <button class="action-btn" @click="openInNewTab">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
                新窗口打开
              </button>
            </div>
          </div>
          <div class="panel-content">
            <iframe 
              :src="viewMode === 'original' ? '/home' : '/home-optimized'" 
              :class="['preview-frame', deviceMode]"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- 设计对比分析 -->
    <div class="design-analysis">
      <div class="analysis-container">
        <h2 class="analysis-title">设计优化要点分析</h2>
        
        <div class="analysis-grid">
          <!-- 视觉层次 -->
          <div class="analysis-card">
            <div class="card-icon">🎨</div>
            <h3 class="card-title">视觉层次</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">传统卡片布局，层次感一般</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">Apple风格渐变背景，立体层次感</span>
              </div>
            </div>
          </div>

          <!-- 色彩系统 -->
          <div class="analysis-card">
            <div class="card-icon">🌈</div>
            <h3 class="card-title">色彩系统</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">标准蓝色主题，对比度适中</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">深色背景+蓝色渐变，高端质感</span>
              </div>
            </div>
          </div>

          <!-- 交互体验 -->
          <div class="analysis-card">
            <div class="card-icon">✨</div>
            <h3 class="card-title">交互体验</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">基础悬浮效果，功能导向</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">流畅动画+视差效果，沉浸体验</span>
              </div>
            </div>
          </div>

          <!-- 信息架构 -->
          <div class="analysis-card">
            <div class="card-icon">📐</div>
            <h3 class="card-title">信息架构</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">功能平铺展示，信息密度高</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">故事化展示，引导式信息流</span>
              </div>
            </div>
          </div>

          <!-- 品牌感知 -->
          <div class="analysis-card">
            <div class="card-icon">🏆</div>
            <h3 class="card-title">品牌感知</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">实用工具感，专业但缺乏情感</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">高端产品感，Apple级别的精致</span>
              </div>
            </div>
          </div>

          <!-- 技术实现 -->
          <div class="analysis-card">
            <div class="card-icon">⚡</div>
            <h3 class="card-title">技术实现</h3>
            <div class="comparison-points">
              <div class="point-item">
                <span class="point-label">原版:</span>
                <span class="point-desc">Naive UI组件，开发效率高</span>
              </div>
              <div class="point-item optimized">
                <span class="point-label">优化:</span>
                <span class="point-desc">自定义CSS+动画，视觉效果佳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速导航 -->
    <div class="quick-navigation">
      <div class="nav-container">
        <h3 class="nav-title">快速体验</h3>
        <div class="nav-buttons">
          <button class="nav-btn original" @click="$router.push('/')">
            <div class="btn-icon">🏠</div>
            <div class="btn-content">
              <span class="btn-title">原版首页</span>
              <span class="btn-desc">当前版本</span>
            </div>
          </button>
          
          <button class="nav-btn optimized" @click="$router.push('/home-optimized')">
            <div class="btn-icon">✨</div>
            <div class="btn-content">
              <span class="btn-title">优化版本</span>
              <span class="btn-desc">Apple风格</span>
            </div>
          </button>
          
          <button class="nav-btn demo" @click="$router.push('/animation-demo')">
            <div class="btn-icon">🎭</div>
            <div class="btn-content">
              <span class="btn-title">动画演示</span>
              <span class="btn-desc">交互效果</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式状态
const viewMode = ref<'split' | 'original' | 'optimized'>('split')
const deviceMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

// 在新窗口打开
const openInNewTab = () => {
  const url = viewMode.value === 'original' ? '/home' : '/home-optimized'
  window.open(url, '_blank')
}
</script>

<style scoped>
.ui-comparison {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.comparison-header {
  padding: 3rem 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.header-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.original {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.badge.optimized {
  background: linear-gradient(135deg, #007AFF, #5AC8FA);
  border: none;
}

.comparison-controls {
  padding: 2rem 0;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.controls-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.8;
}

.view-toggle,
.device-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.25rem;
}

.toggle-btn,
.device-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: white;
  font-size: 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active,
.device-btn.active {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.comparison-showcase {
  min-height: 80vh;
  padding: 2rem;
}

.split-view {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.split-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.panel-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag.premium {
  background: linear-gradient(135deg, #007AFF, #5AC8FA);
}

.panel-content {
  height: calc(80vh - 80px);
  position: relative;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.preview-frame.tablet {
  width: 768px;
  height: 1024px;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  display: block;
  border-radius: 12px;
}

.preview-frame.mobile {
  width: 375px;
  height: 667px;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  display: block;
  border-radius: 20px;
}

.split-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.divider-line {
  width: 1px;
  height: 60%;
  background: rgba(255, 255, 255, 0.2);
}

.divider-handle {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.single-view {
  max-width: 1200px;
  margin: 0 auto;
}

.single-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.design-analysis {
  padding: 4rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.analysis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.analysis-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 3rem 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.analysis-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.comparison-points {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.point-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
}

.point-item.optimized {
  border-left-color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
}

.point-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.point-desc {
  display: block;
  margin-top: 0.25rem;
  opacity: 0.8;
  font-size: 0.875rem;
}

.quick-navigation {
  padding: 3rem 0;
  background: rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.nav-btn.optimized:hover {
  border-color: #007AFF;
  box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.btn-title {
  font-size: 1rem;
  font-weight: 600;
}

.btn-desc {
  font-size: 0.875rem;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .split-view {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .split-divider {
    display: none;
  }
  
  .controls-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }
  
  .comparison-showcase {
    padding: 1rem;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
