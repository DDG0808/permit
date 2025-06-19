<template>
  <div class="wizard-view">
    <div class="wizard-container">
      <!-- 欢迎页面 -->
      <div v-if="!isStarted && !state.isCompleted" class="welcome-section">
        <NSpace vertical size="large" align="center">
          <div class="welcome-header">
            <NIcon size="64" :color="'var(--color-primary)'">
              <HelpCircleOutline />
            </NIcon>
            <NH1 style="margin: 16px 0 8px 0;">许可证选择向导</NH1>
            <NP style="font-size: 16px; text-align: center; max-width: 600px;">
              通过回答几个简单问题，我们将为您推荐最适合的开源许可证。
              这个向导将帮助您了解不同许可证的特点，并根据您的需求提供个性化建议。
            </NP>
          </div>

          <NCard style="max-width: 500px; width: 100%;">
            <NSpace vertical size="medium">
              <NText strong>向导包含以下内容：</NText>
              <NList>
                <NListItem>
                  <NIcon :color="'var(--color-success)'" style="margin-right: 8px;">
                    <CheckmarkOutline />
                  </NIcon>
                  {{ totalQuestions }} 个核心问题
                </NListItem>
                <NListItem>
                  <NIcon :color="'var(--color-success)'" style="margin-right: 8px;">
                    <CheckmarkOutline />
                  </NIcon>
                  个性化许可证推荐
                </NListItem>
                <NListItem>
                  <NIcon :color="'var(--color-success)'" style="margin-right: 8px;">
                    <CheckmarkOutline />
                  </NIcon>
                  详细的分析和建议
                </NListItem>
                <NListItem>
                  <NIcon :color="'var(--color-success)'" style="margin-right: 8px;">
                    <CheckmarkOutline />
                  </NIcon>
                  许可证文件下载
                </NListItem>
              </NList>

              <NButton type="primary" size="large" block @click="startWizard">
                <template #icon>
                  <NIcon><PlayOutline /></NIcon>
                </template>
                开始向导
              </NButton>
            </NSpace>
          </NCard>
        </NSpace>
      </div>

      <!-- 问答阶段 -->
      <div v-else-if="isStarted && !state.isCompleted" class="question-section">
        <!-- 进度条 -->
        <ProgressBar
          :progress="progress"
          :questions="questions"
          :show-steps="false"
          @goto="goToQuestion"
        />

        <!-- 问题卡片 -->
        <div style="margin-top: 24px;">
          <QuestionCard
            v-if="currentQuestion"
            :question="currentQuestion"
            :question-number="progress.current"
            :selected-values="currentAnswer?.selectedValues || []"
            :can-go-back="progress.canGoBack"
            :is-last-question="progress.current === totalQuestions"
            @answer="answerQuestion"
            @next="handleNext"
            @previous="previousQuestion"
          />
        </div>
      </div>

      <!-- 结果页面 -->
      <div v-else-if="state.isCompleted && state.result" class="result-section">
        <!-- 完成进度 -->
        <ProgressBar
          :progress="progress"
          :questions="questions"
          :show-steps="false"
          :allow-navigation="false"
        />

        <!-- 结果展示 -->
        <div style="margin-top: 24px;">
          <ResultCard
            :result="state.result"
            @download-license="handleDownloadLicense"
            @restart="resetWizard"
            @compare="handleCompareLicenses"
            @confirm="handleConfirmSelection"
            @select-alternative="handleSelectAlternative"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NSpace, NH1, NP, NCard, NIcon, NText, NList, NListItem, NButton
} from 'naive-ui'
import {
  HelpCircleOutline, CheckmarkOutline, PlayOutline
} from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import type { LicenseScore } from '@/types/wizard.types'
import { useWizard } from '@/composables/useWizard'
import ProgressBar from '@/components/wizard/ProgressBar.vue'
import QuestionCard from '@/components/wizard/QuestionCard.vue'
import ResultCard from '@/components/wizard/ResultCard.vue'

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
  goToQuestion,
  completeWizard,
  resetWizard
} = useWizard()

// 使用消息提示
const message = useMessage()

// 处理下一步
const handleNext = () => {
  if (progress.value.current === totalQuestions.value) {
    // 最后一题，完成向导
    try {
      completeWizard()
      message.success('向导完成！已为您生成个性化推荐')
    } catch (error) {
      message.error('完成向导时发生错误，请检查是否已回答所有问题')
    }
  } else {
    // 继续下一题
    nextQuestion()
  }
}

// 处理下载许可证
const handleDownloadLicense = () => {
  if (state.value.result) {
    const licenseId = state.value.result.recommendations.primary.licenseId
    // 这里可以实现许可证文件下载逻辑
    message.info(`正在准备 ${licenseId} 许可证文件下载...`)
  }
}

// 处理许可证对比
const handleCompareLicenses = () => {
  // 跳转到知识库页面进行对比
  message.info('即将跳转到许可证对比页面...')
}

// 处理确认选择
const handleConfirmSelection = () => {
  if (state.value.result) {
    const licenseName = state.value.result.recommendations.primary.licenseId
    message.success(`您已选择 ${licenseName} 许可证`)
  }
}

// 处理选择备选方案
const handleSelectAlternative = (alternative: LicenseScore) => {
  message.info(`您选择了 ${alternative.licenseId} 作为替代方案`)
}
</script>

<style scoped>
/* 现代化向导页面样式 - 使用新设计系统 */
.wizard-view {
  min-height: 100vh;
  background: var(--color-background-primary);
  padding: var(--spacing-6);
  position: relative;
}

.wizard-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary-alpha-10) 0%, var(--color-info-alpha-10) 100%);
  z-index: 0;
}

.wizard-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  animation: fadeInUp var(--duration-700) var(--ease-out);
}

.welcome-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.question-section,
.result-section {
  padding-top: var(--spacing-6);
  animation: fadeInUp var(--duration-500) var(--ease-out);
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .wizard-view {
    padding: var(--spacing-4);
  }

  .wizard-container {
    max-width: 100%;
  }

  .welcome-section {
    min-height: 60vh;
  }

  .welcome-header :deep(h1) {
    font-size: var(--font-size-4xl);
  }

  .welcome-header :deep(p) {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 480px) {
  .wizard-view {
    padding: var(--spacing-3);
  }

  .welcome-section {
    min-height: 50vh;
  }

  .welcome-header {
    margin-bottom: var(--spacing-6);
  }

  .welcome-header :deep(h1) {
    font-size: var(--font-size-3xl);
  }

  .welcome-header :deep(p) {
    font-size: var(--font-size-sm);
  }

  .question-section,
  .result-section {
    padding-top: var(--spacing-4);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .wizard-view::before {
  background: linear-gradient(135deg, var(--color-primary-alpha-10) 0%, var(--color-info-alpha-10) 100%);
}

/* 现代化卡片样式增强 */
.wizard-view :deep(.n-card) {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-300) var(--ease-out);
}

.wizard-view :deep(.n-card:hover) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), var(--shadow-glass);
}

/* 现代化按钮样式增强 */
.wizard-view :deep(.n-button) {
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--duration-200) var(--ease-out);
  min-height: 48px;
}

.wizard-view :deep(.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 现代化列表样式 */
.wizard-view :deep(.n-list-item) {
  padding: var(--spacing-3) 0;
  border-radius: var(--radius-md);
  transition: all var(--duration-200) var(--ease-out);
}

.wizard-view :deep(.n-list-item:hover) {
  background: var(--color-primary-alpha-10);
  transform: translateX(var(--spacing-2));
}

/* 图标样式增强 */
.wizard-view :deep(.n-icon) {
  transition: all var(--duration-200) var(--ease-out);
}

.wizard-view :deep(.n-icon:hover) {
  transform: scale(1.1);
}

/* 注意：动画已在新设计系统中定义 */
</style>
