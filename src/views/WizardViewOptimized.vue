<template>
  <div class="wizard-optimized">
    <!-- 动态背景 -->
    <div class="wizard-background">
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="grid-pattern"></div>
    </div>

    <div class="wizard-container">
      <!-- 欢迎阶段 -->
      <div v-if="!isStarted && !state.isCompleted" class="welcome-stage">
        <div class="welcome-content">
          <!-- 产品标识 -->
          <div class="wizard-badge">
            <div class="badge-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span class="badge-text">智能许可证向导</span>
          </div>

          <!-- 主标题 -->
          <h1 class="wizard-title">
            <span class="title-line">找到完美的</span>
            <span class="title-accent">开源许可证</span>
          </h1>

          <!-- 副标题 -->
          <p class="wizard-subtitle">
            通过6个精心设计的问题，我们的AI算法将为您推荐
            <br>
            最适合项目需求的许可证方案
          </p>

          <!-- 特性展示 -->
          <div class="features-preview">
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <div class="feature-content">
                <h3 class="feature-title">3分钟完成</h3>
                <p class="feature-desc">快速问答，即时推荐</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-content">
                <h3 class="feature-title">个性化推荐</h3>
                <p class="feature-desc">基于项目特点定制</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📋</div>
              <div class="feature-content">
                <h3 class="feature-title">详细分析</h3>
                <p class="feature-desc">权限要求全面解读</p>
              </div>
            </div>
          </div>

          <!-- 开始按钮 -->
          <div class="start-action">
            <button class="start-button" @click="startWizard">
              <div class="button-content">
                <div class="button-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span class="button-text">开始智能向导</span>
              </div>
              <div class="button-glow"></div>
            </button>
            
            <p class="start-note">
              <span class="note-icon">🔒</span>
              您的回答仅用于推荐，不会被存储
            </p>
          </div>
        </div>

        <!-- 预览卡片 -->
        <div class="preview-card">
          <div class="card-header">
            <div class="card-controls">
              <div class="control-dot red"></div>
              <div class="control-dot yellow"></div>
              <div class="control-dot green"></div>
            </div>
            <div class="card-title">向导预览</div>
          </div>
          
          <div class="card-content">
            <div class="question-preview">
              <div class="question-number">问题 1/6</div>
              <h4 class="question-title">您的项目是否用于商业用途？</h4>
              
              <div class="options-preview">
                <div class="option-item">
                  <div class="option-radio"></div>
                  <span class="option-text">是，用于商业产品</span>
                </div>
                <div class="option-item">
                  <div class="option-radio"></div>
                  <span class="option-text">否，仅个人或学术使用</span>
                </div>
                <div class="option-item">
                  <div class="option-radio"></div>
                  <span class="option-text">不确定</span>
                </div>
              </div>
              
              <div class="progress-preview">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 16.67%"></div>
                </div>
                <span class="progress-text">1 / 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 问答阶段 -->
      <div v-else-if="isStarted && !state.isCompleted" class="question-stage">
        <!-- 进度指示器 -->
        <div class="progress-header">
          <div class="progress-info">
            <h2 class="progress-title">问题 {{ progress.current }} / {{ totalQuestions }}</h2>
            <p class="progress-subtitle">{{ currentQuestion?.title }}</p>
          </div>
          
          <div class="progress-visual">
            <div class="progress-circle">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  stroke-width="4"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  fill="none"
                  stroke="#007AFF"
                  stroke-width="4"
                  stroke-linecap="round"
                  :stroke-dasharray="157"
                  :stroke-dashoffset="157 - (157 * progress.current / totalQuestions)"
                  transform="rotate(-90 30 30)"
                />
              </svg>
              <span class="progress-number">{{ Math.round((progress.current / totalQuestions) * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- 问题卡片 -->
        <div class="question-card">
          <div class="question-content">
            <h3 class="question-title">{{ currentQuestion?.title }}</h3>
            <p class="question-description">{{ currentQuestion?.description }}</p>
            
            <div class="question-options">
              <div
                v-for="option in currentQuestion?.options"
                :key="option.value"
                class="option-card"
                :class="{ active: isOptionSelected(option.value) }"
                @click="selectOption(option.value)"
              >
                <div class="option-check">
                  <svg v-if="isOptionSelected(option.value)" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div class="option-content">
                  <h4 class="option-title">{{ option.label }}</h4>
                  <p class="option-description">{{ option.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 导航按钮 -->
          <div class="question-actions">
            <button
              v-if="progress.canGoBack"
              class="nav-button secondary"
              @click="previousQuestion"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
              <span>上一题</span>
            </button>
            
            <div class="spacer"></div>
            
            <button
              class="nav-button primary"
              :disabled="!hasAnswer"
              @click="handleNext"
            >
              <span>{{ isLastQuestion ? '完成向导' : '下一题' }}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 结果阶段 -->
      <div v-else-if="state.isCompleted && state.result" class="result-stage">
        <!-- 完成标识 -->
        <div class="completion-header">
          <div class="completion-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h2 class="completion-title">推荐完成！</h2>
          <p class="completion-subtitle">
            基于您的回答，我们为您推荐了最适合的许可证
          </p>
        </div>

        <!-- 推荐结果 -->
        <div class="recommendation-card">
          <div class="recommendation-header">
            <div class="license-badge">
              <span class="badge-text">{{ state.result.recommendations.primary.licenseId }}</span>
            </div>
            <div class="confidence-score">
              <span class="score-label">匹配度</span>
              <span class="score-value">{{ calculateScorePercentage(state.result.recommendations.primary.score, state.result.scores) }}%</span>
            </div>
          </div>
          
          <div class="recommendation-content">
            <h3 class="license-name">{{ state.result.recommendations.primary.licenseId }} License</h3>
            <p class="license-summary">{{ state.result.recommendations.primary.explanation }}</p>
            
            <!-- 权限概览 -->
            <div class="permissions-grid">
              <div class="permission-group allowed">
                <h4 class="group-title">
                  <span class="group-icon">✓</span>
                  允许
                </h4>
                <div class="permission-list">
                  <span class="permission-item">商业使用</span>
                  <span class="permission-item">修改代码</span>
                  <span class="permission-item">私人使用</span>
                  <span class="permission-item">分发</span>
                </div>
              </div>
              
              <div class="permission-group required">
                <h4 class="group-title">
                  <span class="group-icon">!</span>
                  要求
                </h4>
                <div class="permission-list">
                  <span class="permission-item">包含许可证</span>
                  <span class="permission-item">版权声明</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="recommendation-actions">
            <button class="action-button primary" @click="handleDownload">
              <span>下载许可证文件</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </button>
            
            <button class="action-button secondary" @click="resetWizard">
              <span>重新开始</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 备选方案 -->
        <div v-if="state.result.recommendations.alternatives.length > 0" class="alternatives-section">
          <h3 class="alternatives-title">其他推荐方案</h3>
          <div class="alternatives-grid">
            <div
              v-for="alt in state.result.recommendations.alternatives.slice(0, 2)"
              :key="alt.licenseId"
              class="alternative-card"
            >
              <div class="alt-header">
                <span class="alt-name">{{ alt.licenseId }}</span>
                <span class="alt-score">{{ calculateScorePercentage(alt.score, state.result.scores) }}%</span>
              </div>
              <p class="alt-reason">{{ alt.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWizard } from '@/composables/useWizard'

// 使用向导逻辑
const {
  state,
  questions,
  currentQuestion,
  totalQuestions,
  progress,
  currentAnswer,
  isStarted,
  startWizard,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  completeWizard,
  resetWizard
} = useWizard()

// 计算属性
const isLastQuestion = computed(() => progress.value.current === totalQuestions.value)
const hasAnswer = computed(() => (currentAnswer.value?.selectedValues?.length || 0) > 0)

// 选项相关方法
const isOptionSelected = (value: string) => {
  return currentAnswer.value?.selectedValues.includes(value) || false
}

const selectOption = (value: string) => {
  answerQuestion([value])
}

// 计算正确的百分比
const calculateScorePercentage = (score: number, allScores: any[]) => {
  // 动态计算最高分，基于所有推荐结果中的最高分
  const scores = allScores.map(s => s.score)
  const maxScore = Math.max(...scores, 60) // 使用实际最高分，最低为60

  // 确保百分比不超过100%
  const percentage = (score / maxScore) * 100
  return Math.min(Math.round(percentage), 100)
}

// 处理下载
const handleDownload = () => {
  if (state.value.result) {
    const licenseId = state.value.result.recommendations.primary.licenseId
    console.log('🔽 下载许可证:', licenseId)

    // 创建一个简单的许可证文件内容
    const licenseContent = `${licenseId.toUpperCase()} License

Copyright (c) ${new Date().getFullYear()} [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

    // 创建下载
    const blob = new Blob([licenseContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'LICENSE.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('✅ 下载完成！')
  }
}

// 处理下一步
const handleNext = () => {
  if (isLastQuestion.value) {
    completeWizard()
  } else {
    nextQuestion()
  }
}
</script>

<style scoped>
@import '@/styles/wizard-optimized.css';
</style>
