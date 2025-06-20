<template>
  <Transition
    :name="transitionName"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimations } from '@/composables/useAnimations'

interface Props {
  name?: string
  mode?: 'out-in' | 'in-out' | 'default'
  duration?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'auto',
  mode: 'out-in',
  duration: 300,
  disabled: false
})

const emit = defineEmits<{
  beforeEnter: [el: Element]
  enter: [el: Element, done: () => void]
  afterEnter: [el: Element]
  beforeLeave: [el: Element]
  leave: [el: Element, done: () => void]
  afterLeave: [el: Element]
}>()

const route = useRoute()
const { isAnimationEnabled } = useAnimations()

// 计算转换名称
const transitionName = computed(() => {
  if (props.disabled || !isAnimationEnabled.value) {
    return ''
  }
  
  if (props.name === 'auto') {
    // 根据路由自动决定转换类型
    const routeName = route.name as string
    
    if (routeName === 'home') {
      return 'fade-scale'
    } else if (routeName === 'wizard') {
      return 'slide-left'
    } else if (routeName === 'analyzer') {
      return 'slide-up'
    } else if (routeName === 'knowledge') {
      return 'slide-right'
    } else {
      return 'fade'
    }
  }
  
  return props.name
})

// 转换事件处理
const onBeforeEnter = (el: Element) => {
  emit('beforeEnter', el)
}

const onEnter = (el: Element, done: () => void) => {
  emit('enter', el, done)

  // 使用默认行为
  setTimeout(done, props.duration)
}

const onAfterEnter = (el: Element) => {
  emit('afterEnter', el)
}

const onBeforeLeave = (el: Element) => {
  emit('beforeLeave', el)
}

const onLeave = (el: Element, done: () => void) => {
  emit('leave', el, done)

  // 使用默认行为
  setTimeout(done, props.duration)
}

const onAfterLeave = (el: Element) => {
  emit('afterLeave', el)
}
</script>

<style scoped>
/* 淡入淡出转换 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-300) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 淡入淡出 + 缩放转换 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 左滑转换 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 右滑转换 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 上滑转换 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 下滑转换 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 旋转转换 */
.rotate-enter-active,
.rotate-leave-active {
  transition: all var(--duration-500) var(--ease-out);
}

.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(10deg) scale(0.9);
}

/* 翻转转换 */
.flip-enter-active,
.flip-leave-active {
  transition: all var(--duration-500) var(--ease-out);
}

.flip-enter-from {
  opacity: 0;
  transform: perspective(400px) rotateY(90deg);
}

.flip-leave-to {
  opacity: 0;
  transform: perspective(400px) rotateY(-90deg);
}

/* 弹性转换 */
.bounce-enter-active {
  animation: bounceIn var(--duration-700) var(--ease-bounce);
}

.bounce-leave-active {
  animation: bounceOut var(--duration-300) var(--ease-out);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 0;
    transform: scale(0.7);
  }
}

/* 缩放转换 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 模糊转换 */
.blur-enter-active,
.blur-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.blur-enter-from,
.blur-leave-to {
  opacity: 0;
  filter: blur(10px);
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .fade-scale-enter-active,
  .fade-scale-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active,
  .rotate-enter-active,
  .rotate-leave-active,
  .flip-enter-active,
  .flip-leave-active,
  .zoom-enter-active,
  .zoom-leave-active,
  .blur-enter-active,
  .blur-leave-active {
    transition: opacity 0.1s ease !important;
    animation: none !important;
  }
  
  .fade-scale-enter-from,
  .fade-scale-leave-to,
  .slide-left-enter-from,
  .slide-left-leave-to,
  .slide-right-enter-from,
  .slide-right-leave-to,
  .slide-up-enter-from,
  .slide-up-leave-to,
  .slide-down-enter-from,
  .slide-down-leave-to,
  .rotate-enter-from,
  .rotate-leave-to,
  .flip-enter-from,
  .flip-leave-to,
  .zoom-enter-from,
  .zoom-leave-to,
  .blur-enter-from,
  .blur-leave-to {
    transform: none !important;
    filter: none !important;
  }
}
</style>
