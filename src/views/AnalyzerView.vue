<template>
  <div class="analyzer-view">
    <div class="analyzer-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <NH1>GitHub 仓库分析</NH1>
        <NP>输入 GitHub 仓库地址，获取其开源许可证信息和详细分析</NP>
      </div>

      <!-- URL输入组件 -->
      <UrlInput
        :loading="isLoading"
        @analyze="handleAnalyze"
        @clear="handleClear"
        @input="handleUrlInput"
      />

      <!-- 加载状态 -->
      <NCard v-if="isLoading" class="loading-card">
        <NSpin size="large">
          <template #description>
            <NSpace vertical align="center" size="small">
              <NText>正在分析仓库信息...</NText>
              <NText depth="3" style="font-size: 14px;">
                {{ loadingMessage }}
              </NText>
            </NSpace>
          </template>
        </NSpin>
      </NCard>

      <!-- 错误状态 -->
      <NCard v-if="hasError && !isLoading" class="error-card">
        <NResult
          status="error"
          :title="result.error?.message || '分析失败'"
          :description="getErrorDescription()"
        >
          <template #footer>
            <NSpace>
              <NButton @click="clearError" type="primary">
                重试
              </NButton>
              <NButton @click="handleClear">
                重置
              </NButton>
            </NSpace>
          </template>
        </NResult>
      </NCard>

      <!-- 成功结果 -->
      <div v-if="hasData && result.data" class="results-section">
        <!-- 仓库信息 -->
        <RepoInfo :repo="result.data.repo" />

        <!-- 许可证信息 -->
        <LicenseDisplay
          :license="result.data.license"
          @compare-license="handleCompareLicense"
          @analyze-compatibility="handleAnalyzeCompatibility"
          @suggest-license="handleSuggestLicense"
          @learn-about-licenses="handleLearnAboutLicenses"
        />

        <!-- 分析建议 -->
        <NCard v-if="hasAnalysisData" title="智能分析">
          <template #header-extra>
            <NIcon size="18" :color="'var(--color-info)'">
              <AnalyticsOutline />
            </NIcon>
          </template>

          <NSpace vertical size="large">
            <!-- 推荐建议 -->
            <div v-if="result.data.analysis.recommendations.length > 0">
              <NText strong style="color: var(--color-success); margin-bottom: 12px; display: block;">
                <NIcon style="margin-right: 6px;"><CheckmarkCircleOutline /></NIcon>
                推荐建议
              </NText>
              <NList>
                <NListItem v-for="(rec, index) in result.data.analysis.recommendations" :key="index">
                  <template #prefix>
                    <NIcon :color="'var(--color-success)'"><BulbOutline /></NIcon>
                  </template>
                  {{ rec }}
                </NListItem>
              </NList>
            </div>

            <!-- 注意事项 -->
            <div v-if="result.data.analysis.warnings.length > 0">
              <NText strong style="color: var(--color-warning); margin-bottom: 12px; display: block;">
                <NIcon style="margin-right: 6px;"><WarningOutline /></NIcon>
                注意事项
              </NText>
              <NList>
                <NListItem v-for="(warning, index) in result.data.analysis.warnings" :key="index">
                  <template #prefix>
                    <NIcon :color="'var(--color-warning)'"><AlertCircleOutline /></NIcon>
                  </template>
                  {{ warning }}
                </NListItem>
              </NList>
            </div>

            <!-- 兼容性分析 -->
            <div v-if="compatibilityAnalysis">
              <NText strong style="color: var(--color-info); margin-bottom: 12px; display: block;">
                <NIcon style="margin-right: 6px;"><GitCompareOutline /></NIcon>
                兼容性分析
              </NText>
              <div class="compatibility-section">
                <NSpace vertical size="medium">
                  <div v-if="compatibilityAnalysis.compatibleLicenses.length > 0">
                    <NText>兼容的许可证：</NText>
                    <NSpace size="small" style="margin-top: 8px;" wrap>
                      <NTag
                        v-for="license in compatibilityAnalysis.compatibleLicenses"
                        :key="license"
                        type="success"
                        size="small"
                      >
                        {{ license }}
                      </NTag>
                    </NSpace>
                  </div>

                  <div>
                    <NText>许可证类别：</NText>
                    <NTag
                      :type="getCategoryTagType(compatibilityAnalysis.category)"
                      style="margin-left: 8px;"
                    >
                      {{ getCategoryLabel(compatibilityAnalysis.category) }}
                    </NTag>
                  </div>
                </NSpace>
              </div>
            </div>
          </NSpace>
        </NCard>

        <!-- 操作区域 -->
        <NCard title="相关操作">
          <NSpace wrap>
            <NButton @click="handleNewAnalysis" type="primary">
              <template #icon>
                <NIcon><RefreshOutline /></NIcon>
              </template>
              分析新仓库
            </NButton>

            <NButton @click="handleGoToWizard">
              <template #icon>
                <NIcon><HelpCircleOutline /></NIcon>
              </template>
              许可证选择向导
            </NButton>

            <NButton @click="handleGoToKnowledge">
              <template #icon>
                <NIcon><LibraryOutline /></NIcon>
              </template>
              许可证知识库
            </NButton>

            <NButton
              v-if="result.data.license"
              @click="handleDownloadLicense"
            >
              <template #icon>
                <NIcon><DownloadOutline /></NIcon>
              </template>
              下载许可证
            </NButton>
          </NSpace>
        </NCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  NSpace, NH1, NP, NCard, NResult, NButton, NIcon, NSpin,
  NText, NTag, NList, NListItem
} from 'naive-ui'
import {
  AnalyticsOutline, CheckmarkCircleOutline, WarningOutline, BulbOutline,
  AlertCircleOutline, GitCompareOutline, RefreshOutline, HelpCircleOutline,
  LibraryOutline, DownloadOutline
} from '@vicons/ionicons5'
import { useGitHubAnalyzer } from '@/composables/useGitHub'
import { getLicenseById } from '@/data/licenses.data'
import UrlInput from '@/components/github/UrlInput.vue'
import RepoInfo from '@/components/github/RepoInfo.vue'
import LicenseDisplay from '@/components/github/LicenseDisplay.vue'

// 路由和消息
const router = useRouter()
const message = useMessage()

// 使用GitHub分析器
const {
  result,
  isLoading,
  hasData,
  hasError,
  analyzeRepo,
  reset,
  clearError
} = useGitHubAnalyzer()

// 本地状态
const loadingMessage = ref('获取仓库信息...')

// 计算属性
const hasAnalysisData = computed(() => {
  return hasData.value && result.value.data?.analysis
})

const compatibilityAnalysis = computed(() => {
  if (!hasData.value || !result.value.data?.license) return null

  const licenseKey = result.value.data.license.license.key
  const licenseDetails = getLicenseById(licenseKey)

  if (!licenseDetails) return null

  return {
    category: licenseDetails.category,
    compatibleLicenses: licenseDetails.compatibility,
    complexity: licenseDetails.complexity,
    popularity: licenseDetails.popularity
  }
})

// 事件处理
const handleUrlInput = (url: string) => {
  // URL输入处理已在UrlInput组件中完成
}

const handleAnalyze = async (url: string) => {
  loadingMessage.value = '解析GitHub URL...'

  setTimeout(() => {
    if (isLoading.value) {
      loadingMessage.value = '获取仓库信息...'
    }
  }, 1000)

  setTimeout(() => {
    if (isLoading.value) {
      loadingMessage.value = '分析许可证信息...'
    }
  }, 2000)

  try {
    await analyzeRepo(url)
    if (hasData.value) {
      message.success('仓库分析完成！')
    }
  } catch (error) {
    // 错误已在组合式函数中处理
  }
}

const handleClear = () => {
  reset()
  loadingMessage.value = '获取仓库信息...'
}

const handleCompareLicense = (licenseKey: string) => {
  message.info(`准备对比 ${licenseKey} 许可证...`)
  router.push('/knowledge')
}

const handleAnalyzeCompatibility = (licenseKey: string) => {
  message.info(`分析 ${licenseKey} 许可证兼容性...`)
  // 这里可以实现更详细的兼容性分析
}

const handleSuggestLicense = () => {
  message.info('跳转到许可证选择向导...')
  router.push('/wizard')
}

const handleLearnAboutLicenses = () => {
  message.info('跳转到许可证知识库...')
  router.push('/knowledge')
}

const handleNewAnalysis = () => {
  reset()
  message.info('已重置，可以分析新的仓库')
}

const handleGoToWizard = () => {
  router.push('/wizard')
}

const handleGoToKnowledge = () => {
  router.push('/knowledge')
}

const handleDownloadLicense = () => {
  if (hasData.value && result.value.data?.license) {
    const downloadUrl = result.value.data.license.downloadUrl
    window.open(downloadUrl, '_blank')
    message.success('许可证文件下载已开始')
  }
}

// 工具函数
const getErrorDescription = (): string => {
  if (!result.value.error) return ''

  const status = result.value.error.status
  switch (status) {
    case 404:
      return '请检查仓库地址是否正确，或者该仓库可能不存在'
    case 403:
      return '可能是私有仓库或API访问受限，请稍后重试'
    case 500:
    case 502:
    case 503:
      return 'GitHub服务暂时不可用，请稍后重试'
    default:
      return '请检查网络连接或稍后重试'
  }
}

const getCategoryTagType = (category: string) => {
  switch (category) {
    case 'permissive': return 'success'
    case 'copyleft': return 'warning'
    case 'weak-copyleft': return 'info'
    default: return 'default'
  }
}

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'permissive': '宽松许可证',
    'copyleft': '强著佐权',
    'weak-copyleft': '弱著佐权'
  }
  return labels[category] || category
}
</script>

<style scoped>
/* 现代化分析器页面样式 - 使用新设计系统 */
.analyzer-view {
  min-height: 100vh;
  background: var(--color-background-primary);
  padding: var(--spacing-6);
  position: relative;
}

.analyzer-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-info-alpha-10) 0%, var(--color-primary-alpha-10) 100%);
  z-index: 0;
}

.analyzer-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
  padding: var(--spacing-8);
  background: var(--glass-background-strong);
  border-radius: var(--radius-2xl);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  animation: fadeInUp var(--duration-700) var(--ease-out);
}

.page-header :deep(h1) {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-system);
}

.page-header :deep(p) {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
}

.loading-card,
.error-card {
  margin-top: var(--spacing-6);
  text-align: center;
  animation: fadeInUp var(--duration-500) var(--ease-out);
}

.results-section {
  margin-top: var(--spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.compatibility-section {
  padding: var(--spacing-4);
  background: var(--color-info-alpha-10);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-info);
  border: 1px solid var(--color-info-alpha-20);
}

/* 现代化卡片样式增强 */
:deep(.n-card) {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-300) var(--ease-out);
}

:deep(.n-card:hover) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), var(--shadow-glass);
  border-color: var(--color-primary-alpha-20);
}

/* 现代化加载动画 */
:deep(.n-spin) {
  padding: var(--spacing-10);
}

/* 现代化结果状态样式 */
:deep(.n-result) {
  padding: var(--spacing-10) var(--spacing-6);
}

/* 现代化列表样式 */
:deep(.n-list-item) {
  padding: var(--spacing-3) 0;
  border-bottom: 1px solid var(--color-separator-non-opaque);
  border-radius: var(--radius-md);
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-list-item:hover) {
  background: var(--color-primary-alpha-10);
  transform: translateX(var(--spacing-2));
}

:deep(.n-list-item:last-child) {
  border-bottom: none;
}

/* 现代化标签样式 */
:deep(.n-tag) {
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-tag:hover) {
  transform: scale(1.05);
}

/* 现代化按钮样式 */
:deep(.n-button) {
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--duration-200) var(--ease-out);
  min-height: 40px;
}

:deep(.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 现代化图标样式 */
:deep(.n-icon) {
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-icon:hover) {
  transform: scale(1.1);
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .analyzer-view {
    padding: var(--spacing-4);
  }

  .analyzer-container {
    max-width: 100%;
  }

  .page-header {
    margin-bottom: var(--spacing-6);
    padding: var(--spacing-6);
  }

  .page-header :deep(h1) {
    font-size: var(--font-size-3xl);
  }

  .page-header :deep(p) {
    font-size: var(--font-size-base);
  }

  .results-section {
    gap: var(--spacing-4);
  }

  .compatibility-section {
    padding: var(--spacing-3);
  }
}

@media (max-width: 480px) {
  .analyzer-view {
    padding: var(--spacing-3);
  }

  .page-header {
    padding: var(--spacing-4);
  }

  .page-header :deep(h1) {
    font-size: var(--font-size-2xl);
  }

  .page-header :deep(p) {
    font-size: var(--font-size-sm);
  }
}

/* 现代化动画效果 */
.results-section > * {
  animation: fadeInUp var(--duration-500) var(--ease-out);
}

.results-section > *:nth-child(1) { animation-delay: var(--duration-100); }
.results-section > *:nth-child(2) { animation-delay: var(--duration-200); }
.results-section > *:nth-child(3) { animation-delay: var(--duration-300); }
.results-section > *:nth-child(4) { animation-delay: var(--duration-500); }

/* 深色模式优化 */
[data-theme="dark"] .analyzer-view::before {
  background: linear-gradient(135deg, var(--color-info-alpha-10) 0%, var(--color-primary-alpha-10) 100%);
}

[data-theme="dark"] .compatibility-section {
  background: var(--color-info-alpha-10);
  border-color: var(--color-info);
}
</style>
