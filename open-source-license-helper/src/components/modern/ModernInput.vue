<template>
  <div :class="wrapperClasses">
    <!-- 标签 -->
    <label v-if="label" :for="inputId" class="modern-input-label">
      {{ label }}
      <span v-if="required" class="modern-input-required">*</span>
    </label>
    
    <!-- 输入框容器 -->
    <div class="modern-input-container">
      <!-- 前缀图标 -->
      <div v-if="prefixIcon || $slots.prefix" class="modern-input-prefix">
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" />
        </slot>
      </div>
      
      <!-- 输入框 -->
      <input
        :id="inputId"
        ref="inputRef"
        :class="inputClasses"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- 后缀图标 -->
      <div v-if="suffixIcon || $slots.suffix || clearable || showPasswordToggle" class="modern-input-suffix">
        <!-- 清除按钮 -->
        <button
          v-if="clearable && modelValue && !disabled && !readonly"
          type="button"
          class="modern-input-clear"
          @click="handleClear"
        >
          <CloseIcon />
        </button>
        
        <!-- 密码显示切换 -->
        <button
          v-if="showPasswordToggle"
          type="button"
          class="modern-input-password-toggle"
          @click="togglePasswordVisibility"
        >
          <EyeIcon v-if="passwordVisible" />
          <EyeOffIcon v-else />
        </button>
        
        <!-- 自定义后缀 -->
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" />
        </slot>
      </div>
      
      <!-- 焦点指示器 -->
      <div class="modern-input-focus-indicator"></div>
    </div>
    
    <!-- 帮助文本或错误信息 -->
    <div v-if="helpText || errorMessage" class="modern-input-help">
      <span v-if="errorMessage" class="modern-input-error">{{ errorMessage }}</span>
      <span v-else-if="helpText" class="modern-input-help-text">{{ helpText }}</span>
    </div>
    
    <!-- 字符计数 -->
    <div v-if="showCount && maxlength" class="modern-input-count">
      {{ modelValue?.length || 0 }} / {{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { ModernInputSize, ModernInputVariant } from '@/types/modern.types'

// 图标组件（简化版，实际项目中应该使用图标库）
const CloseIcon = () => '✕'
const EyeIcon = () => '👁'
const EyeOffIcon = () => '🙈'

// Props定义
interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  size?: ModernInputSize
  variant?: ModernInputVariant
  label?: string
  placeholder?: string
  helpText?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  showCount?: boolean
  maxlength?: number
  autocomplete?: string
  prefixIcon?: any
  suffixIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'medium',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  showCount: false
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  keydown: [event: KeyboardEvent]
}>()

// 响应式引用
const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const passwordVisible = ref(false)

// 计算属性
const inputId = computed(() => `modern-input-${Math.random().toString(36).substr(2, 9)}`)

const inputType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const showPasswordToggle = computed(() => {
  return props.type === 'password' && !props.disabled && !props.readonly
})

const wrapperClasses = computed(() => [
  'modern-input-wrapper',
  `modern-input-wrapper--${props.size}`,
  `modern-input-wrapper--${props.variant}`,
  {
    'modern-input-wrapper--focused': focused.value,
    'modern-input-wrapper--disabled': props.disabled,
    'modern-input-wrapper--readonly': props.readonly,
    'modern-input-wrapper--error': props.errorMessage,
    'modern-input-wrapper--has-prefix': props.prefixIcon || props.$slots?.prefix,
    'modern-input-wrapper--has-suffix': props.suffixIcon || props.$slots?.suffix || props.clearable || showPasswordToggle.value
  }
])

const inputClasses = computed(() => [
  'modern-input',
  `modern-input--${props.size}`,
  `modern-input--${props.variant}`
])

// 事件处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style scoped>
/* 现代化输入框基础样式 */
.modern-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.modern-input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-family: var(--font-family-system);
}

.modern-input-required {
  color: var(--color-error);
  margin-left: var(--spacing-1);
}

.modern-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--duration-200) var(--ease-out);
  overflow: hidden;
}

.modern-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-system);
  color: var(--color-text-primary);
  transition: all var(--duration-200) var(--ease-out);
}

.modern-input::placeholder {
  color: var(--color-text-placeholder);
}

/* 尺寸变体 */
.modern-input--small {
  height: 32px;
  padding: 0 var(--spacing-3);
  font-size: var(--font-size-sm);
}

.modern-input--medium {
  height: 40px;
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-base);
}

.modern-input--large {
  height: 48px;
  padding: 0 var(--spacing-5);
  font-size: var(--font-size-lg);
}

/* 前缀和后缀 */
.modern-input-prefix,
.modern-input-suffix {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--color-text-secondary);
  font-size: 1.1em;
}

.modern-input-prefix {
  padding-left: var(--spacing-3);
}

.modern-input-suffix {
  padding-right: var(--spacing-3);
}

.modern-input-clear,
.modern-input-password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-200) var(--ease-out);
}

.modern-input-clear:hover,
.modern-input-password-toggle:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}

/* 焦点指示器 */
.modern-input-focus-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform var(--duration-200) var(--ease-out);
}

.modern-input-wrapper--focused .modern-input-focus-indicator {
  transform: scaleX(1);
}

.modern-input-wrapper--focused .modern-input-container {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha-20);
}

/* 状态样式 */
.modern-input-wrapper--disabled .modern-input-container {
  background: var(--color-background-disabled);
  border-color: var(--color-border-disabled);
  cursor: not-allowed;
}

.modern-input-wrapper--disabled .modern-input {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.modern-input-wrapper--readonly .modern-input-container {
  background: var(--color-background-secondary);
}

.modern-input-wrapper--error .modern-input-container {
  border-color: var(--color-error);
}

.modern-input-wrapper--error .modern-input-focus-indicator {
  background: var(--color-error);
}

.modern-input-wrapper--error.modern-input-wrapper--focused .modern-input-container {
  box-shadow: 0 0 0 3px var(--color-error-alpha-20);
}

/* 帮助文本 */
.modern-input-help {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-tight);
}

.modern-input-error {
  color: var(--color-error);
}

.modern-input-help-text {
  color: var(--color-text-secondary);
}

/* 字符计数 */
.modern-input-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: right;
}

/* 变体样式 */
.modern-input-wrapper--primary .modern-input-container {
  border-color: var(--color-primary-alpha-30);
}

.modern-input-wrapper--success .modern-input-container {
  border-color: var(--color-success-alpha-30);
}

.modern-input-wrapper--warning .modern-input-container {
  border-color: var(--color-warning-alpha-30);
}

/* 深色模式优化 */
[data-theme="dark"] .modern-input-container {
  background: var(--color-background-elevated);
  border-color: var(--color-border-secondary);
}

[data-theme="dark"] .modern-input-wrapper--readonly .modern-input-container {
  background: var(--color-background-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-input--large {
    height: 44px;
    font-size: var(--font-size-base);
  }
}
</style>
