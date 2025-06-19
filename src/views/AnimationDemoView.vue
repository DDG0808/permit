<template>
  <div class="animation-demo-view">
    <!-- 页面头部 -->
    <div class="demo-header scroll-reveal">
      <h1 class="demo-title animate-typewriter">交互动画演示</h1>
      <p class="demo-subtitle scroll-reveal">
        展示现代化的交互动画和微交互效果
      </p>
    </div>

    <!-- 基础动画演示 -->
    <section class="demo-section scroll-reveal">
      <h2 class="section-title">基础动画效果</h2>
      <div class="animation-grid">
        <div class="animation-item">
          <div class="demo-card animate-floating">
            <h3>浮动动画</h3>
            <p>持续的上下浮动效果</p>
          </div>
        </div>
        
        <div class="animation-item">
          <div class="demo-card animate-pulse">
            <h3>脉冲动画</h3>
            <p>呼吸般的透明度变化</p>
          </div>
        </div>
        
        <div class="animation-item">
          <div class="demo-card animate-heartbeat">
            <h3>心跳动画</h3>
            <p>心跳般的缩放效果</p>
          </div>
        </div>
        
        <div class="animation-item">
          <div class="demo-card" @click="triggerWiggle">
            <h3>摇摆动画</h3>
            <p>点击触发摇摆效果</p>
          </div>
        </div>
        
        <div class="animation-item">
          <div class="demo-card" @click="triggerBounce">
            <h3>弹跳动画</h3>
            <p>点击触发弹跳效果</p>
          </div>
        </div>
        
        <div class="animation-item">
          <div class="demo-card" @click="triggerRubberBand">
            <h3>橡皮筋动画</h3>
            <p>点击触发橡皮筋效果</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 悬浮效果演示 -->
    <section class="demo-section scroll-reveal-left">
      <h2 class="section-title">悬浮交互效果</h2>
      <div class="hover-effects-grid">
        <div class="hover-item">
          <div ref="magneticCard" class="demo-card">
            <h3>磁性悬浮</h3>
            <p>鼠标跟随的磁性效果</p>
          </div>
        </div>
        
        <div class="hover-item">
          <div ref="tiltCard" class="demo-card">
            <h3>倾斜悬浮</h3>
            <p>3D倾斜跟随效果</p>
          </div>
        </div>
        
        <div class="hover-item">
          <div class="demo-card glow-border">
            <h3>发光边框</h3>
            <p>悬浮时的发光效果</p>
          </div>
        </div>
        
        <div class="hover-item">
          <div class="demo-card liquid-button">
            <h3>液体按钮</h3>
            <p>液体扩散悬浮效果</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 涟漪效果演示 -->
    <section class="demo-section scroll-reveal-right">
      <h2 class="section-title">涟漪点击效果</h2>
      <div class="ripple-demo">
        <div ref="rippleButton1" class="ripple-button primary">
          主要按钮
        </div>
        <div ref="rippleButton2" class="ripple-button secondary">
          次要按钮
        </div>
        <div ref="rippleButton3" class="ripple-button success">
          成功按钮
        </div>
        <div ref="rippleButton4" class="ripple-button warning">
          警告按钮
        </div>
      </div>
    </section>

    <!-- 滚动触发动画演示 -->
    <section class="demo-section">
      <h2 class="section-title scroll-reveal">滚动触发动画</h2>
      <div class="scroll-animations">
        <div class="scroll-item scroll-reveal">
          <div class="demo-card">
            <h3>从下方淡入</h3>
            <p>滚动到视口时从下方淡入</p>
          </div>
        </div>
        
        <div class="scroll-item scroll-reveal-left">
          <div class="demo-card">
            <h3>从左侧滑入</h3>
            <p>滚动到视口时从左侧滑入</p>
          </div>
        </div>
        
        <div class="scroll-item scroll-reveal-right">
          <div class="demo-card">
            <h3>从右侧滑入</h3>
            <p>滚动到视口时从右侧滑入</p>
          </div>
        </div>
        
        <div class="scroll-item scroll-reveal-scale">
          <div class="demo-card">
            <h3>缩放淡入</h3>
            <p>滚动到视口时缩放淡入</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数字计数动画演示 -->
    <section class="demo-section scroll-reveal">
      <h2 class="section-title">数字计数动画</h2>
      <div class="counter-demo">
        <div class="counter-item">
          <div ref="counter1" class="counter-number">0</div>
          <div class="counter-label">用户数量</div>
        </div>
        <div class="counter-item">
          <div ref="counter2" class="counter-number">0</div>
          <div class="counter-label">项目数量</div>
        </div>
        <div class="counter-item">
          <div ref="counter3" class="counter-number">0%</div>
          <div class="counter-label">满意度</div>
        </div>
        <div class="counter-item">
          <div ref="counter4" class="counter-number">$0</div>
          <div class="counter-label">节省成本</div>
        </div>
      </div>
    </section>

    <!-- 骨架屏演示 -->
    <section class="demo-section scroll-reveal">
      <h2 class="section-title">骨架屏加载动画</h2>
      <div class="skeleton-demo">
        <div class="skeleton-controls">
          <NButton @click="showSkeleton" type="primary">显示骨架屏</NButton>
          <NButton @click="hideSkeleton" type="default">隐藏骨架屏</NButton>
        </div>
        <div ref="skeletonContainer" class="skeleton-container-demo">
          <div class="demo-content">
            <div class="content-avatar"></div>
            <div class="content-text">
              <h3>用户名称</h3>
              <p>这是一段示例文本内容，用于演示骨架屏的加载效果。</p>
              <p>骨架屏可以提供更好的用户体验。</p>
            </div>
            <div class="content-button">
              <NButton type="primary">操作按钮</NButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 粒子效果演示 -->
    <section class="demo-section scroll-reveal particle-effect">
      <h2 class="section-title">粒子背景效果</h2>
      <div class="particle-demo">
        <div class="demo-card">
          <h3>粒子背景</h3>
          <p>动态的粒子背景效果，营造科技感氛围</p>
        </div>
      </div>
    </section>

    <!-- 动画控制面板 -->
    <div class="animation-controls">
      <div class="control-panel">
        <h3>动画控制</h3>
        <div class="control-item">
          <label>
            <input 
              type="checkbox" 
              v-model="animationsEnabled" 
              @change="toggleAnimations"
            />
            启用动画效果
          </label>
        </div>
        <div class="control-item">
          <label>动画速度:</label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            v-model="animationSpeed"
            @input="updateAnimationSpeed"
          />
          <span>{{ animationSpeed }}x</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { NButton } from 'naive-ui'
import { 
  useAnimations, 
  useHoverEffects, 
  useRippleEffect, 
  useScrollReveal,
  useCountAnimation,
  useLoadingAnimations,
  useMicroInteractions
} from '@/composables/useAnimations'

// 响应式引用
const magneticCard = ref<HTMLElement>()
const tiltCard = ref<HTMLElement>()
const rippleButton1 = ref<HTMLElement>()
const rippleButton2 = ref<HTMLElement>()
const rippleButton3 = ref<HTMLElement>()
const rippleButton4 = ref<HTMLElement>()
const counter1 = ref<HTMLElement>()
const counter2 = ref<HTMLElement>()
const counter3 = ref<HTMLElement>()
const counter4 = ref<HTMLElement>()
const skeletonContainer = ref<HTMLElement>()

const animationsEnabled = ref(true)
const animationSpeed = ref(1)

// 组合式函数
const { isAnimationEnabled, applyAnimation } = useAnimations()
const { addMagneticHover, addTiltHover } = useHoverEffects()
const { addRippleEffect } = useRippleEffect()
const { addRevealElements } = useScrollReveal()
const { animateCount } = useCountAnimation()
const { createSkeleton, removeSkeleton } = useLoadingAnimations()
const { addClickFeedback } = useMicroInteractions()

// 触发动画的方法
const triggerWiggle = (event: Event) => {
  const element = event.currentTarget as HTMLElement
  element.classList.add('animate-wiggle')
  setTimeout(() => {
    element.classList.remove('animate-wiggle')
  }, 1000)
}

const triggerBounce = (event: Event) => {
  const element = event.currentTarget as HTMLElement
  element.classList.add('animate-bounce')
  setTimeout(() => {
    element.classList.remove('animate-bounce')
  }, 1000)
}

const triggerRubberBand = (event: Event) => {
  const element = event.currentTarget as HTMLElement
  element.classList.add('animate-rubber-band')
  setTimeout(() => {
    element.classList.remove('animate-rubber-band')
  }, 1000)
}

// 骨架屏控制
const showSkeleton = () => {
  if (skeletonContainer.value) {
    createSkeleton(skeletonContainer.value, {
      lines: 3,
      avatar: true,
      button: true
    })
  }
}

const hideSkeleton = () => {
  if (skeletonContainer.value) {
    removeSkeleton(skeletonContainer.value)
  }
}

// 动画控制
const toggleAnimations = () => {
  document.documentElement.style.setProperty(
    '--animation-play-state', 
    animationsEnabled.value ? 'running' : 'paused'
  )
}

const updateAnimationSpeed = () => {
  document.documentElement.style.setProperty(
    '--animation-duration-multiplier', 
    (1 / animationSpeed.value).toString()
  )
}

// 初始化计数动画
const initCounters = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        
        if (target === counter1.value) {
          animateCount(target, 0, 1234, 2000)
        } else if (target === counter2.value) {
          animateCount(target, 0, 567, 2000)
        } else if (target === counter3.value) {
          animateCount(target, 0, 98, 2000, (value) => `${value}%`)
        } else if (target === counter4.value) {
          animateCount(target, 0, 50000, 2000, (value) => `$${value.toLocaleString()}`)
        }
        
        observer.unobserve(target)
      }
    })
  }, { threshold: 0.5 })
  
  if (counter1.value) observer.observe(counter1.value)
  if (counter2.value) observer.observe(counter2.value)
  if (counter3.value) observer.observe(counter3.value)
  if (counter4.value) observer.observe(counter4.value)
}

onMounted(async () => {
  await nextTick()
  
  // 初始化悬浮效果
  if (magneticCard.value) {
    addMagneticHover(magneticCard.value)
  }
  
  if (tiltCard.value) {
    addTiltHover(tiltCard.value)
  }
  
  // 初始化涟漪效果
  if (rippleButton1.value) addRippleEffect(rippleButton1.value)
  if (rippleButton2.value) addRippleEffect(rippleButton2.value)
  if (rippleButton3.value) addRippleEffect(rippleButton3.value)
  if (rippleButton4.value) addRippleEffect(rippleButton4.value)
  
  // 初始化滚动触发动画
  const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
  addRevealElements(Array.from(scrollElements) as HTMLElement[], 'up', 100)
  
  // 初始化计数动画
  initCounters()
})
</script>

<style scoped>
.animation-demo-view {
  min-height: 100vh;
  background: var(--color-background-primary);
  padding: var(--spacing-6);
}

.demo-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
  padding: var(--spacing-8);
}

.demo-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-4) 0;
  font-family: var(--font-family-system);
}

.demo-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

.demo-section {
  margin-bottom: var(--spacing-16);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-8) 0;
  text-align: center;
}

.animation-grid,
.hover-effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.demo-card {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6);
  text-align: center;
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-300) var(--ease-out);
  cursor: pointer;
}

.demo-card h3 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.demo-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.ripple-demo {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.ripple-button {
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.ripple-button.primary {
  background: var(--color-primary);
  color: white;
}

.ripple-button.secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.ripple-button.success {
  background: var(--color-success);
  color: white;
}

.ripple-button.warning {
  background: var(--color-warning);
  color: white;
}

.scroll-animations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.counter-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
  text-align: center;
}

.counter-item {
  background: var(--glass-background);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
}

.counter-number {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-2);
}

.counter-label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.skeleton-demo {
  max-width: 600px;
  margin: 0 auto;
}

.skeleton-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.skeleton-container-demo {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
}

.demo-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.content-avatar {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.content-text {
  flex: 1;
}

.content-text h3 {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--color-text-primary);
}

.content-text p {
  margin: 0 0 var(--spacing-1) 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.particle-demo {
  text-align: center;
  padding: var(--spacing-8);
}

.animation-controls {
  position: fixed;
  bottom: var(--spacing-6);
  right: var(--spacing-6);
  z-index: var(--z-index-sticky);
}

.control-panel {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-glass);
}

.control-panel h3 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.control-item {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.control-item:last-child {
  margin-bottom: 0;
}

.control-item label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.control-item input[type="range"] {
  flex: 1;
  margin: 0 var(--spacing-2);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .animation-demo-view {
    padding: var(--spacing-4);
  }
  
  .demo-header {
    padding: var(--spacing-4);
    margin-bottom: var(--spacing-8);
  }
  
  .demo-title {
    font-size: var(--font-size-3xl);
  }
  
  .demo-subtitle {
    font-size: var(--font-size-base);
  }
  
  .animation-grid,
  .hover-effects-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .ripple-demo {
    flex-direction: column;
    align-items: center;
  }
  
  .counter-demo {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }
  
  .demo-content {
    flex-direction: column;
    text-align: center;
  }
  
  .animation-controls {
    position: static;
    margin-top: var(--spacing-8);
  }
}
</style>
