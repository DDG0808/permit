<template>
  <div class="progress-container">
    <!-- 进度信息 -->
    <NSpace justify="space-between" align="center" style="margin-bottom: 16px;">
      <NText strong>许可证选择向导</NText>
      <NText depth="3">
        {{ progress.current }} / {{ progress.total }}
      </NText>
    </NSpace>

    <!-- 进度条 -->
    <NProgress 
      type="line" 
      :percentage="progress.percentage"
      :show-indicator="false"
      :height="8"
      border-radius="4px"
      fill-border-radius="4px"
    />

    <!-- 步骤指示器 -->
    <div class="steps-container" v-if="showSteps">
      <div class="steps">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="step"
          :class="{
            'step-completed': index < progress.current - 1,
            'step-current': index === progress.current - 1,
            'step-pending': index >= progress.current
          }"
          @click="handleStepClick(index)"
        >
          <div class="step-circle">
            <NIcon v-if="index < progress.current - 1" size="14">
              <CheckmarkOutline />
            </NIcon>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-label">
            {{ getStepLabel(question, index) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 简化版进度点 -->
    <div class="dots-container" v-else>
      <div class="dots">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="dot"
          :class="{
            'dot-completed': index < progress.current - 1,
            'dot-current': index === progress.current - 1,
            'dot-pending': index >= progress.current
          }"
          @click="handleStepClick(index)"
        />
      </div>
    </div>

    <!-- 完成状态 -->
    <div v-if="progress.isCompleted" class="completion-badge">
      <NSpace align="center">
        <NIcon size="20" color="#18a058">
          <CheckmarkCircleOutline />
        </NIcon>
        <NText strong style="color: #18a058;">
          向导已完成
        </NText>
      </NSpace>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpace, NText, NProgress, NIcon } from 'naive-ui'
import { CheckmarkOutline, CheckmarkCircleOutline } from '@vicons/ionicons5'
import type { WizardProgress, WizardQuestion } from '@/types/wizard.types'

// Props
interface Props {
  progress: WizardProgress
  questions: WizardQuestion[]
  showSteps?: boolean
  allowNavigation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSteps: false,
  allowNavigation: true
})

// Emits
interface Emits {
  (e: 'goto', index: number): void
}

const emit = defineEmits<Emits>()

// 计算属性
const canNavigate = computed(() => {
  return props.allowNavigation && !props.progress.isCompleted
})

// 方法
const getStepLabel = (question: WizardQuestion, index: number): string => {
  // 简化问题标题作为步骤标签
  const title = question.title
  if (title.length > 20) {
    return title.substring(0, 17) + '...'
  }
  return title
}

const handleStepClick = (index: number) => {
  if (canNavigate.value && index < props.progress.current) {
    emit('goto', index)
  }
}
</script>

<style scoped>
.progress-container {
  width: 100%;
}

.steps-container {
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.steps {
  display: flex;
  min-width: max-content;
  gap: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step:hover {
  transform: translateY(-2px);
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-completed .step-circle {
  background-color: #18a058;
  color: white;
}

.step-current .step-circle {
  background-color: #2080f0;
  color: white;
}

.step-pending .step-circle {
  background-color: #f0f0f0;
  color: #666;
  border: 2px solid #e0e0e0;
}

.step-label {
  font-size: 12px;
  text-align: center;
  color: #666;
  line-height: 1.2;
}

.step-completed .step-label {
  color: #18a058;
}

.step-current .step-label {
  color: #2080f0;
  font-weight: 600;
}

.dots-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  transform: scale(1.2);
}

.dot-completed {
  background-color: #18a058;
}

.dot-current {
  background-color: #2080f0;
}

.dot-pending {
  background-color: #e0e0e0;
}

.completion-badge {
  margin-top: 16px;
  padding: 12px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .steps {
    gap: 12px;
  }
  
  .step {
    min-width: 60px;
  }
  
  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .step-label {
    font-size: 11px;
  }
}
</style>
