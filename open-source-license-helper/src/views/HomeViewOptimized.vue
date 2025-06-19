<template>
  <div class="home-optimized">
    <!-- Apple Design Award 风格的英雄区域 -->
    <section class="hero-section">
      <!-- 动态背景系统 -->
      <div class="hero-background">
        <div class="gradient-mesh">
          <div class="mesh-gradient mesh-1"></div>
          <div class="mesh-gradient mesh-2"></div>
          <div class="mesh-gradient mesh-3"></div>
        </div>
        <div class="floating-particles">
          <div class="particle" v-for="i in 12" :key="i" :style="getParticleStyle(i)"></div>
        </div>
        <div class="grid-overlay"></div>
      </div>

      <div class="hero-container">
        <!-- 左侧内容区域 -->
        <div class="hero-content">
          <!-- 产品标识 -->
          <div class="product-badge">
            <div class="badge-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span class="badge-text">开源许可证智能助手</span>
            <div class="badge-glow"></div>
          </div>

          <!-- 主标题 -->
          <h1 class="hero-title">
            <span class="title-primary">选择完美的</span>
            <span class="title-accent">开源许可证</span>
            <span class="title-secondary">从未如此简单</span>
          </h1>

          <!-- 副标题 -->
          <p class="hero-subtitle">
            基于Apple设计理念的智能工具，通过直观的问答流程和深度分析，
            <br class="desktop-break">
            帮助开发者在3分钟内找到最适合项目的许可证方案
          </p>

          <!-- 核心价值点 -->
          <div class="value-propositions">
            <div class="value-item">
              <div class="value-icon">⚡</div>
              <span class="value-text">3分钟智能推荐</span>
            </div>
            <div class="value-item">
              <div class="value-icon">🎯</div>
              <span class="value-text">精准匹配需求</span>
            </div>
            <div class="value-item">
              <div class="value-icon">🔒</div>
              <span class="value-text">法律风险评估</span>
            </div>
          </div>

          <!-- 主要行动按钮 -->
          <div class="hero-actions">
            <button class="primary-action" @click="$router.push('/wizard')">
              <div class="button-content">
                <div class="button-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <span class="button-text">开始智能选择</span>
              </div>
              <div class="button-glow"></div>
            </button>

            <button class="secondary-action" @click="$router.push('/analyzer')">
              <div class="button-content">
                <div class="button-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 12h2v5H7v-5zm4-3h2v8h-2V9zm4-3h2v11h-2V6z"/>
                  </svg>
                </div>
                <span class="button-text">分析GitHub仓库</span>
              </div>
            </button>
          </div>

          <!-- 社会证明 -->
          <div class="social-proof">
            <div class="proof-stats">
              <div class="stat-item">
                <span class="stat-number">10K+</span>
                <span class="stat-label">开发者信赖</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">50+</span>
                <span class="stat-label">许可证覆盖</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">99.9%</span>
                <span class="stat-label">推荐准确率</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧可视化展示 -->
        <div class="hero-visual">
          <div class="visual-container">
            <!-- 主展示卡片 -->
            <div class="showcase-card main-card">
              <div class="card-header">
                <div class="card-controls">
                  <div class="control-dot red"></div>
                  <div class="control-dot yellow"></div>
                  <div class="control-dot green"></div>
                </div>
                <div class="card-title">许可证推荐结果</div>
              </div>
              
              <div class="card-content">
                <div class="recommendation-result">
                  <div class="result-header">
                    <div class="license-logo">
                      <div class="logo-bg mit"></div>
                      <span class="logo-text">MIT</span>
                    </div>
                    <div class="confidence-score">
                      <span class="score-label">匹配度</span>
                      <span class="score-value">95%</span>
                    </div>
                  </div>
                  
                  <div class="license-summary">
                    <h4 class="license-name">MIT License</h4>
                    <p class="license-description">简单宽松的许可证，允许商业使用</p>
                  </div>
                  
                  <div class="permissions-overview">
                    <div class="permission-group allowed">
                      <div class="group-header">
                        <span class="group-icon">✓</span>
                        <span class="group-title">允许</span>
                      </div>
                      <div class="permission-tags">
                        <span class="permission-tag">商业使用</span>
                        <span class="permission-tag">修改</span>
                        <span class="permission-tag">分发</span>
                      </div>
                    </div>
                    
                    <div class="permission-group required">
                      <div class="group-header">
                        <span class="group-icon">!</span>
                        <span class="group-title">要求</span>
                      </div>
                      <div class="permission-tags">
                        <span class="permission-tag">包含许可证</span>
                        <span class="permission-tag">版权声明</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="popularity-indicator">
                    <div class="popularity-bar">
                      <div class="popularity-fill" style="width: 85%"></div>
                    </div>
                    <span class="popularity-text">85% 的开源项目选择</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 辅助卡片 -->
            <div class="showcase-card analysis-card">
              <div class="mini-card-header">
                <div class="mini-icon">🔍</div>
                <span class="mini-title">仓库分析</span>
              </div>
              <div class="mini-content">
                <div class="repo-preview">
                  <span class="repo-name">microsoft/vscode</span>
                  <div class="analysis-status success">
                    <span class="status-dot"></span>
                    <span class="status-text">MIT 兼容</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="showcase-card knowledge-card">
              <div class="mini-card-header">
                <div class="mini-icon">📚</div>
                <span class="mini-title">知识库</span>
              </div>
              <div class="mini-content">
                <div class="license-comparison">
                  <div class="comparison-item">
                    <span class="license-badge mit">MIT</span>
                    <span class="vs-text">vs</span>
                    <span class="license-badge apache">Apache 2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 装饰性元素 -->
          <div class="visual-decorations">
            <div class="decoration-ring ring-1"></div>
            <div class="decoration-ring ring-2"></div>
            <div class="decoration-dots">
              <div class="deco-dot" v-for="i in 8" :key="i"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div class="scroll-indicator" @click="scrollToFeatures">
        <div class="scroll-text">探索更多功能</div>
        <div class="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-6-6h12l-6 6z"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- 功能特性区域 -->
    <section id="features" class="features-section">
      <div class="section-container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge-dot"></span>
            <span class="badge-text">核心功能</span>
          </div>
          <h2 class="section-title">三大智能工具</h2>
          <p class="section-subtitle">
            专为现代开发者设计的完整许可证解决方案
          </p>
        </div>

        <div class="features-grid">
          <!-- 智能向导 -->
          <div class="feature-card" @click="$router.push('/wizard')">
            <div class="feature-visual">
              <div class="feature-icon wizard">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="feature-glow"></div>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">智能向导</h3>
              <p class="feature-description">
                通过6个精心设计的问题，AI算法为您推荐最适合的许可证方案
              </p>
              <div class="feature-highlights">
                <span class="highlight-item">个性化推荐</span>
                <span class="highlight-item">3分钟完成</span>
                <span class="highlight-item">专业解释</span>
              </div>
            </div>
            <div class="feature-action">
              <span class="action-text">开始向导</span>
              <div class="action-arrow">→</div>
            </div>
          </div>

          <!-- 仓库分析 -->
          <div class="feature-card" @click="$router.push('/analyzer')">
            <div class="feature-visual">
              <div class="feature-icon analyzer">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 12h2v5H7v-5zm4-3h2v8h-2V9zm4-3h2v11h-2V6z"/>
                </svg>
              </div>
              <div class="feature-glow"></div>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">仓库分析</h3>
              <p class="feature-description">
                输入GitHub仓库地址，快速获取许可证信息和兼容性分析报告
              </p>
              <div class="feature-highlights">
                <span class="highlight-item">实时分析</span>
                <span class="highlight-item">依赖检查</span>
                <span class="highlight-item">风险评估</span>
              </div>
            </div>
            <div class="feature-action">
              <span class="action-text">分析仓库</span>
              <div class="action-arrow">→</div>
            </div>
          </div>

          <!-- 知识库 -->
          <div class="feature-card" @click="$router.push('/knowledge')">
            <div class="feature-visual">
              <div class="feature-icon knowledge">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div class="feature-glow"></div>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">知识库</h3>
              <p class="feature-description">
                全面的许可证知识库，支持对比分析和深度学习指导
              </p>
              <div class="feature-highlights">
                <span class="highlight-item">全面覆盖</span>
                <span class="highlight-item">对比分析</span>
                <span class="highlight-item">学习资源</span>
              </div>
            </div>
            <div class="feature-action">
              <span class="action-text">浏览知识库</span>
              <div class="action-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 粒子动画样式生成
const getParticleStyle = (index: number) => {
  const delay = index * 0.5
  const duration = 8 + Math.random() * 4
  const size = 2 + Math.random() * 4
  
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }
}

// 滚动到功能区域
const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  // 添加滚动视差效果
  const handleScroll = () => {
    const scrolled = window.pageYOffset
    const parallax = document.querySelector('.hero-background') as HTMLElement
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
@import '@/styles/home-optimized.css';
</style>
