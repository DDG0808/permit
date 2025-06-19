<template>
  <NCard title="GitHub 仓库分析">
    <template #header-extra>
      <NIcon size="20" color="#18a058">
        <LogoGithub />
      </NIcon>
    </template>

    <NSpace vertical size="large">
      <!-- 输入说明 -->
      <div>
        <NP>输入 GitHub 仓库地址，我们将为您分析其开源许可证信息</NP>
        <NText depth="3" style="font-size: 14px;">
          支持多种URL格式：https://github.com/owner/repo、git@github.com:owner/repo.git 等
        </NText>
      </div>

      <!-- URL输入框 -->
      <NSpace vertical size="medium">
        <NInput
          v-model:value="inputUrl"
          size="large"
          placeholder="例如: https://github.com/microsoft/vscode"
          :status="inputStatus"
          clearable
          @input="handleInput"
          @keyup.enter="handleAnalyze"
          @clear="handleClear"
        >
          <template #prefix>
            <NIcon color="#666">
              <LinkOutline />
            </NIcon>
          </template>
          <template #suffix>
            <NButton
              v-if="showAnalyzeButton"
              type="primary"
              size="small"
              :loading="isLoading"
              :disabled="!canAnalyze"
              @click="handleAnalyze"
            >
              分析
            </NButton>
          </template>
        </NInput>

        <!-- 验证提示 -->
        <div v-if="validationMessage" class="validation-message" :class="validationClass">
          <NIcon :color="validationColor" style="margin-right: 6px;">
            <CheckmarkCircleOutline v-if="isValid" />
            <CloseCircleOutline v-else />
          </NIcon>
          {{ validationMessage }}
        </div>
      </NSpace>

      <!-- 快速示例 -->
      <div v-if="showExamples">
        <NText strong style="margin-bottom: 12px; display: block;">
          快速试用示例：
        </NText>
        <NSpace size="small" wrap>
          <NButton
            v-for="example in examples"
            :key="example.url"
            size="small"
            quaternary
            @click="selectExample(example.url)"
          >
            <template #icon>
              <NIcon><StarOutline /></NIcon>
            </template>
            {{ example.name }}
          </NButton>
        </NSpace>
      </div>

      <!-- 功能说明 -->
      <NCollapse v-if="showHelp">
        <NCollapseItem title="功能说明" name="help">
          <NSpace vertical size="small">
            <div>
              <NIcon color="#18a058" style="margin-right: 6px;">
                <CheckmarkOutline />
              </NIcon>
              <NText>获取仓库基本信息（名称、描述、语言、Stars等）</NText>
            </div>
            <div>
              <NIcon color="#18a058" style="margin-right: 6px;">
                <CheckmarkOutline />
              </NIcon>
              <NText>分析开源许可证类型和条款</NText>
            </div>
            <div>
              <NIcon color="#18a058" style="margin-right: 6px;">
                <CheckmarkOutline />
              </NIcon>
              <NText>提供许可证使用建议和注意事项</NText>
            </div>
            <div>
              <NIcon color="#18a058" style="margin-right: 6px;">
                <CheckmarkOutline />
              </NIcon>
              <NText>支持许可证兼容性分析</NText>
            </div>
          </NSpace>
        </NCollapseItem>
      </NCollapse>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NCard, NSpace, NP, NText, NInput, NButton, NIcon, NCollapse, 
  NCollapseItem
} from 'naive-ui'
import {
  LogoGithub, LinkOutline, CheckmarkCircleOutline, CloseCircleOutline,
  StarOutline, CheckmarkOutline
} from '@vicons/ionicons5'
import { useGitHubUrlValidator } from '@/composables/useGitHub'

// Props
interface Props {
  loading?: boolean
  showExamples?: boolean
  showHelp?: boolean
  showAnalyzeButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showExamples: true,
  showHelp: true,
  showAnalyzeButton: true
})

// Emits
interface Emits {
  (e: 'analyze', url: string): void
  (e: 'clear'): void
  (e: 'input', url: string): void
}

const emit = defineEmits<Emits>()

// 使用URL验证器
const { url, isValid, errorMessage, validate } = useGitHubUrlValidator()

// 本地状态
const inputUrl = ref('')

// 示例数据
const examples = [
  { name: 'VS Code', url: 'https://github.com/microsoft/vscode' },
  { name: 'React', url: 'https://github.com/facebook/react' },
  { name: 'Vue.js', url: 'https://github.com/vuejs/vue' },
  { name: 'Node.js', url: 'https://github.com/nodejs/node' }
]

// 计算属性
const isLoading = computed(() => props.loading)

const canAnalyze = computed(() => {
  return inputUrl.value.trim() && isValid.value && !isLoading.value
})

const inputStatus = computed(() => {
  if (!inputUrl.value.trim()) return undefined
  return isValid.value ? 'success' : 'error'
})

const validationMessage = computed(() => {
  if (!inputUrl.value.trim()) return ''
  return isValid.value ? '有效的GitHub仓库URL' : errorMessage.value
})

const validationClass = computed(() => {
  return isValid.value ? 'validation-success' : 'validation-error'
})

const validationColor = computed(() => {
  return isValid.value ? '#18a058' : '#d03050'
})

// 事件处理
const handleInput = (value: string) => {
  inputUrl.value = value
  validate(value)
  emit('input', value)
}

const handleAnalyze = () => {
  if (canAnalyze.value) {
    emit('analyze', inputUrl.value.trim())
  }
}

const handleClear = () => {
  inputUrl.value = ''
  url.value = ''
  emit('clear')
}

const selectExample = (exampleUrl: string) => {
  inputUrl.value = exampleUrl
  validate(exampleUrl)
  emit('input', exampleUrl)
  // 自动分析示例
  if (canAnalyze.value) {
    emit('analyze', exampleUrl)
  }
}
</script>

<style scoped>
.validation-message {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.validation-success {
  color: #18a058;
}

.validation-error {
  color: #d03050;
}

/* 输入框聚焦效果 */
:deep(.n-input.n-input--focus) {
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}

/* 示例按钮样式 */
:deep(.n-button--quaternary) {
  border: 1px solid #e0e0e0;
}

:deep(.n-button--quaternary:hover) {
  border-color: #18a058;
  color: #18a058;
}
</style>
