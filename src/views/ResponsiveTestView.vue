<template>
  <div class="responsive-test-view">
    <!-- 页面头部 -->
    <div class="test-header">
      <h1 class="test-title">响应式设计测试页面</h1>
      <p class="test-subtitle">验证各种屏幕尺寸下的显示效果</p>
    </div>

    <!-- 设备信息显示 -->
    <div class="device-info">
      <div class="info-card">
        <h3>当前设备信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">屏幕宽度:</span>
            <span class="info-value">{{ screenWidth }}px</span>
          </div>
          <div class="info-item">
            <span class="info-label">屏幕高度:</span>
            <span class="info-value">{{ screenHeight }}px</span>
          </div>
          <div class="info-item">
            <span class="info-label">设备像素比:</span>
            <span class="info-value">{{ devicePixelRatio }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">当前断点:</span>
            <span class="info-value">{{ currentBreakpoint }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">方向:</span>
            <span class="info-value">{{ orientation }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">触摸支持:</span>
            <span class="info-value">{{ touchSupport ? '是' : '否' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 响应式网格测试 -->
    <div class="test-section">
      <h2 class="section-title">响应式网格测试</h2>
      <div class="grid-test">
        <div class="grid grid-auto-fit-md gap-4">
          <div class="grid-item" v-for="i in 6" :key="i">
            <div class="test-card">
              <h4>卡片 {{ i }}</h4>
              <p>这是一个测试卡片，用于验证网格布局在不同屏幕尺寸下的表现。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 响应式文字测试 -->
    <div class="test-section">
      <h2 class="section-title">响应式文字测试</h2>
      <div class="text-test">
        <h1 class="text-6xl lg:text-7xl md:text-5xl sm:text-4xl mobile-text-2xl">
          超大标题文字
        </h1>
        <h2 class="text-4xl lg:text-5xl md:text-3xl sm:text-2xl mobile-text-xl">
          大标题文字
        </h2>
        <h3 class="text-2xl lg:text-3xl md:text-xl sm:text-lg mobile-text-lg">
          中等标题文字
        </h3>
        <p class="text-base lg:text-lg md:text-base sm:text-sm mobile-text-base">
          这是正文内容，用于测试在不同屏幕尺寸下的文字显示效果。
          文字应该在各种设备上都保持良好的可读性。
        </p>
      </div>
    </div>

    <!-- 响应式按钮测试 -->
    <div class="test-section">
      <h2 class="section-title">响应式按钮测试</h2>
      <div class="button-test">
        <div class="flex flex-wrap gap-4 mobile-flex-col mobile-gap-3">
          <NButton type="primary" size="large" class="mobile-button">
            主要按钮
          </NButton>
          <NButton type="default" size="large" class="mobile-button">
            默认按钮
          </NButton>
          <NButton type="success" size="large" class="mobile-button">
            成功按钮
          </NButton>
          <NButton type="warning" size="large" class="mobile-button">
            警告按钮
          </NButton>
        </div>
        <div class="mt-4">
          <NButton type="primary" block class="mobile-button-full">
            全宽按钮
          </NButton>
        </div>
      </div>
    </div>

    <!-- 响应式表单测试 -->
    <div class="test-section">
      <h2 class="section-title">响应式表单测试</h2>
      <div class="form-test">
        <NForm class="mobile-form">
          <NFormItem label="用户名" class="mobile-form-group">
            <NInput 
              v-model:value="formData.username" 
              placeholder="请输入用户名"
              class="mobile-form-input"
            />
          </NFormItem>
          <NFormItem label="邮箱" class="mobile-form-group">
            <NInput
              v-model:value="formData.email"
              type="text"
              placeholder="请输入邮箱"
              class="mobile-form-input"
            />
          </NFormItem>
          <NFormItem label="描述" class="mobile-form-group">
            <NInput 
              v-model:value="formData.description" 
              type="textarea"
              placeholder="请输入描述"
              class="mobile-form-textarea"
              :rows="4"
            />
          </NFormItem>
          <NFormItem>
            <NButton type="primary" block class="mobile-button-full">
              提交表单
            </NButton>
          </NFormItem>
        </NForm>
      </div>
    </div>

    <!-- 响应式卡片测试 -->
    <div class="test-section">
      <h2 class="section-title">响应式卡片测试</h2>
      <div class="card-test">
        <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mobile-gap-3">
          <NCard 
            v-for="i in 6" 
            :key="i"
            :title="`测试卡片 ${i}`"
            class="mobile-card"
            hoverable
          >
            <template #header-extra>
              <NTag type="info">标签</NTag>
            </template>
            <p>这是卡片内容，用于测试卡片在不同屏幕尺寸下的显示效果。</p>
            <template #footer>
              <div class="flex justify-between mobile-flex-col mobile-gap-2">
                <NButton size="small">操作1</NButton>
                <NButton size="small" type="primary">操作2</NButton>
              </div>
            </template>
          </NCard>
        </div>
      </div>
    </div>

    <!-- 移动端导航测试 -->
    <div class="test-section mobile-block desktop-hidden">
      <h2 class="section-title">移动端导航测试</h2>
      <div class="mobile-nav-test">
        <div class="mobile-nav">
          <div class="flex justify-around">
            <div class="mobile-nav-item">
              <NIcon size="20"><HomeOutline /></NIcon>
              <span class="text-xs">首页</span>
            </div>
            <div class="mobile-nav-item">
              <NIcon size="20"><SearchOutline /></NIcon>
              <span class="text-xs">搜索</span>
            </div>
            <div class="mobile-nav-item">
              <NIcon size="20"><PersonOutline /></NIcon>
              <span class="text-xs">个人</span>
            </div>
            <div class="mobile-nav-item">
              <NIcon size="20"><SettingsOutline /></NIcon>
              <span class="text-xs">设置</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput, NTag, NIcon } from 'naive-ui'
import { 
  HomeOutline, 
  SearchOutline, 
  PersonOutline, 
  SettingsOutline 
} from '@vicons/ionicons5'

// 响应式数据
const screenWidth = ref(0)
const screenHeight = ref(0)
const devicePixelRatio = ref(0)
const currentBreakpoint = ref('')
const orientation = ref('')
const touchSupport = ref(false)

// 表单数据
const formData = ref({
  username: '',
  email: '',
  description: ''
})

// 获取当前断点
const getCurrentBreakpoint = () => {
  const width = window.innerWidth
  if (width >= 1536) return '2xl'
  if (width >= 1280) return 'xl'
  if (width >= 1024) return 'lg'
  if (width >= 768) return 'md'
  if (width >= 640) return 'sm'
  return 'xs'
}

// 更新设备信息
const updateDeviceInfo = () => {
  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
  devicePixelRatio.value = window.devicePixelRatio
  currentBreakpoint.value = getCurrentBreakpoint()
  orientation.value = window.innerHeight > window.innerWidth ? '竖屏' : '横屏'
  touchSupport.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 窗口大小变化处理
const handleResize = () => {
  updateDeviceInfo()
}

onMounted(() => {
  updateDeviceInfo()
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleResize)
})
</script>

<style scoped>
.responsive-test-view {
  min-height: 100vh;
  background: var(--color-background-primary);
  padding: var(--spacing-6);
}

.test-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.test-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.test-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.device-info {
  margin-bottom: var(--spacing-8);
}

.info-card {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-glass);
}

.info-card h3 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2);
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
}

.info-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.info-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.test-section {
  margin-bottom: var(--spacing-12);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-6) 0;
}

.test-card {
  background: var(--color-background-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-200) var(--ease-out);
}

.test-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.test-card h4 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.test-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.text-test {
  background: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  margin-bottom: var(--spacing-6);
}

.text-test h1,
.text-test h2,
.text-test h3 {
  margin: 0 0 var(--spacing-4) 0;
  color: var(--color-text-primary);
}

.text-test p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.button-test,
.form-test,
.card-test {
  background: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
}

.mobile-nav-test {
  position: relative;
  height: 200px;
  background: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .responsive-test-view {
    padding: var(--spacing-4);
  }
  
  .test-header {
    margin-bottom: var(--spacing-6);
  }
  
  .test-title {
    font-size: var(--font-size-2xl);
  }
  
  .test-subtitle {
    font-size: var(--font-size-base);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
  }
  
  .test-section {
    margin-bottom: var(--spacing-8);
  }
  
  .section-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-4);
  }
  
  .text-test,
  .button-test,
  .form-test,
  .card-test {
    padding: var(--spacing-4);
  }
}
</style>
