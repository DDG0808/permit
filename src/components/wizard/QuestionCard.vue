<template>
  <NCard>
    <template #header>
      <NSpace align="center" justify="space-between">
        <NSpace align="center">
          <NIcon size="24" color="#18a058">
            <HelpCircleOutline />
          </NIcon>
          <NText strong style="font-size: 18px;">
            问题 {{ questionNumber }}
          </NText>
        </NSpace>
        <NTag v-if="question.required" type="warning" size="small">
          必答
        </NTag>
      </NSpace>
    </template>

    <NSpace vertical size="large">
      <!-- 问题标题 -->
      <div>
        <NH3 style="margin: 0 0 8px 0;">{{ question.title }}</NH3>
        <NP depth="3" style="margin: 0;">{{ question.description }}</NP>
      </div>

      <!-- 选项列表 -->
      <div>
        <NRadioGroup 
          v-if="question.type === 'single'"
          :value="selectedValue"
          @update:value="handleSingleSelect"
        >
          <NSpace vertical size="medium">
            <NRadio
              v-for="option in question.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
              <div style="margin-left: 8px;">
                <div style="font-weight: 500;">{{ option.label }}</div>
                <div v-if="option.description" style="font-size: 14px; color: #666; margin-top: 4px;">
                  {{ option.description }}
                </div>
              </div>
            </NRadio>
          </NSpace>
        </NRadioGroup>

        <NCheckboxGroup
          v-else-if="question.type === 'multiple'"
          :value="selectedValues"
          @update:value="handleMultipleSelect"
        >
          <NSpace vertical size="medium">
            <NCheckbox
              v-for="option in question.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
              <div style="margin-left: 8px;">
                <div style="font-weight: 500;">{{ option.label }}</div>
                <div v-if="option.description" style="font-size: 14px; color: #666; margin-top: 4px;">
                  {{ option.description }}
                </div>
              </div>
            </NCheckbox>
          </NSpace>
        </NCheckboxGroup>
      </div>

      <!-- 帮助文本 -->
      <NAlert v-if="question.helpText" type="info" :show-icon="false">
        <template #icon>
          <NIcon><InformationCircleOutline /></NIcon>
        </template>
        {{ question.helpText }}
      </NAlert>

      <!-- 操作按钮 -->
      <NSpace justify="space-between">
        <NButton 
          v-if="showBackButton"
          @click="$emit('previous')"
          :disabled="!canGoBack"
        >
          <template #icon>
            <NIcon><ChevronBackOutline /></NIcon>
          </template>
          上一题
        </NButton>
        <div v-else></div>

        <NSpace>
          <NButton 
            v-if="showSkipButton && !question.required"
            @click="handleSkip"
            quaternary
          >
            跳过
          </NButton>
          
          <NButton 
            type="primary"
            @click="handleNext"
            :disabled="!hasAnswer"
          >
            {{ isLastQuestion ? '完成' : '下一题' }}
            <template #icon>
              <NIcon>
                <CheckmarkOutline v-if="isLastQuestion" />
                <ChevronForwardOutline v-else />
              </NIcon>
            </template>
          </NButton>
        </NSpace>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard, NSpace, NIcon, NText, NTag, NH3, NP, NRadioGroup, NRadio,
  NCheckboxGroup, NCheckbox, NAlert, NButton
} from 'naive-ui'
import {
  HelpCircleOutline, InformationCircleOutline, ChevronBackOutline,
  ChevronForwardOutline, CheckmarkOutline
} from '@vicons/ionicons5'
import type { WizardQuestion } from '@/types/wizard.types'

// Props
interface Props {
  question: WizardQuestion
  questionNumber: number
  selectedValues?: string[]
  canGoBack?: boolean
  isLastQuestion?: boolean
  showBackButton?: boolean
  showSkipButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedValues: () => [],
  canGoBack: false,
  isLastQuestion: false,
  showBackButton: true,
  showSkipButton: false
})

// Emits
interface Emits {
  (e: 'answer', values: string[]): void
  (e: 'next'): void
  (e: 'previous'): void
  (e: 'skip'): void
}

const emit = defineEmits<Emits>()

// 计算属性
const selectedValue = computed(() => {
  return props.selectedValues.length > 0 ? props.selectedValues[0] : undefined
})

const hasAnswer = computed(() => {
  return props.selectedValues.length > 0
})

// 事件处理
const handleSingleSelect = (value: string) => {
  emit('answer', [value])
}

const handleMultipleSelect = (values: (string | number)[]) => {
  emit('answer', values.map(v => String(v)))
}

const handleNext = () => {
  if (hasAnswer.value) {
    emit('next')
  }
}

const handleSkip = () => {
  emit('skip')
}
</script>

<style scoped>
.n-radio,
.n-checkbox {
  align-items: flex-start !important;
}

.n-radio__label,
.n-checkbox__label {
  padding-top: 2px;
}
</style>
