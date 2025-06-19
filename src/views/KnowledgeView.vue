<template>
  <div class="knowledge-view">
    <div class="knowledge-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <NH1>许可证知识库</NH1>
        <NP>了解各种开源许可证的特点和使用场景，进行详细对比分析</NP>
      </div>

      <!-- 搜索和筛选区域 -->
      <NCard class="search-section">
        <NSpace vertical :size="16">
          <!-- 搜索框 -->
          <NInput
            v-model:value="searchQuery"
            placeholder="搜索许可证名称或描述..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <NIcon><SearchOutline /></NIcon>
            </template>
          </NInput>

          <!-- 筛选器 -->
          <NSpace wrap>
            <!-- 类别筛选 -->
            <div class="filter-group">
              <NText strong>类别：</NText>
              <NSpace :size="8">
                <NTag
                  v-for="category in categories"
                  :key="category.value"
                  :type="selectedCategories.includes(category.value) ? 'primary' : 'default'"
                  checkable
                  :checked="selectedCategories.includes(category.value)"
                  @update:checked="(checked) => toggleCategory(category.value, checked)"
                >
                  {{ category.label }}
                </NTag>
              </NSpace>
            </div>

            <!-- 复杂度筛选 -->
            <div class="filter-group">
              <NText strong>复杂度：</NText>
              <NSlider
                v-model:value="complexityRange"
                range
                :min="1"
                :max="10"
                :step="1"
                :marks="complexityMarks"
                style="width: 200px;"
              />
            </div>

            <!-- 流行度筛选 -->
            <div class="filter-group">
              <NText strong>流行度：</NText>
              <NSlider
                v-model:value="popularityRange"
                range
                :min="1"
                :max="10"
                :step="1"
                :marks="popularityMarks"
                style="width: 200px;"
              />
            </div>
          </NSpace>

          <!-- 快速筛选 -->
          <NSpace>
            <NButton
              v-for="quickFilter in quickFilters"
              :key="quickFilter.key"
              :type="activeQuickFilter === quickFilter.key ? 'primary' : 'default'"
              size="small"
              @click="applyQuickFilter(quickFilter.key)"
            >
              {{ quickFilter.label }}
            </NButton>
            <NButton size="small" @click="clearFilters">
              <template #icon>
                <NIcon><RefreshOutline /></NIcon>
              </template>
              清除筛选
            </NButton>
          </NSpace>
        </NSpace>
      </NCard>

      <!-- 视图切换 -->
      <div class="view-controls">
        <NSpace align="center" justify="space-between">
          <NSpace align="center">
            <NText strong>视图模式：</NText>
            <NButtonGroup>
              <NButton
                :type="viewMode === 'cards' ? 'primary' : 'default'"
                @click="viewMode = 'cards'"
              >
                <template #icon>
                  <NIcon><GridOutline /></NIcon>
                </template>
                卡片
              </NButton>
              <NButton
                :type="viewMode === 'matrix' ? 'primary' : 'default'"
                @click="viewMode = 'matrix'"
              >
                <template #icon>
                  <NIcon><AnalyticsOutline /></NIcon>
                </template>
                矩阵
              </NButton>
              <NButton
                :type="viewMode === 'comparison' ? 'primary' : 'default'"
                @click="viewMode = 'comparison'"
              >
                <template #icon>
                  <NIcon><GitCompareOutline /></NIcon>
                </template>
                对比
              </NButton>
            </NButtonGroup>
          </NSpace>

          <NSpace align="center">
            <NText depth="3">找到 {{ filteredLicenses.length }} 个许可证</NText>
            <NButton @click="handleExportData">
              <template #icon>
                <NIcon><DownloadOutline /></NIcon>
              </template>
              导出数据
            </NButton>
          </NSpace>
        </NSpace>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'cards'" class="cards-view">
        <div v-if="filteredLicenses.length === 0" class="empty-state">
          <NEmpty description="没有找到匹配的许可证">
            <template #icon>
              <NIcon size="48" :color="'var(--color-text-tertiary)'">
                <DocumentTextOutline />
              </NIcon>
            </template>
            <template #extra>
              <NButton @click="clearFilters">清除筛选条件</NButton>
            </template>
          </NEmpty>
        </div>

        <div v-else class="license-grid">
          <LicenseCard
            v-for="license in filteredLicenses"
            :key="license.id"
            :license="license"
            :selected="selectedLicenses.includes(license.id)"
            @select="handleSelectLicense"
            @view-details="handleViewDetails"
            @compare="handleAddToComparison"
          />
        </div>
      </div>

      <!-- 矩阵视图 -->
      <div v-if="viewMode === 'matrix'" class="matrix-view">
        <FeatureMatrix
          :licenses="filteredLicenses"
          @select-license="handleSelectLicense"
          @cell-click="handleMatrixCellClick"
        />
      </div>

      <!-- 对比视图 -->
      <div v-if="viewMode === 'comparison'" class="comparison-view">
        <ComparisonTable
          :licenses="comparisonLicenses"
          @clear-all="clearComparison"
          @export-comparison="handleExportComparison"
          @add-license="handleAddLicenseToComparison"
          @remove-license="handleRemoveFromComparison"
        />
      </div>
    </div>

    <!-- 许可证详情模态框 -->
    <NModal
      v-model:show="showDetailsModal"
      preset="card"
      style="width: 90%; max-width: 800px;"
      title="许可证详情"
      size="huge"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
    >
      <LicenseDetails
        v-if="selectedLicenseForDetails"
        :license="selectedLicenseForDetails"
        @close="showDetailsModal = false"
        @add-to-comparison="handleAddToComparison"
      />
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import {
  NSpace, NH1, NP, NCard, NInput, NIcon, NText, NTag, NSlider,
  NButton, NButtonGroup, NEmpty, NModal
} from 'naive-ui'
import {
  SearchOutline, RefreshOutline, GridOutline, AnalyticsOutline,
  GitCompareOutline, DownloadOutline, DocumentTextOutline
} from '@vicons/ionicons5'
import type { License } from '@/types/license.types'
import { licenses } from '@/data/licenses.data'
import LicenseCard from '@/components/knowledge/LicenseCard.vue'
import FeatureMatrix from '@/components/knowledge/FeatureMatrix.vue'
import ComparisonTable from '@/components/knowledge/ComparisonTable.vue'
import LicenseDetails from '@/components/knowledge/LicenseDetails.vue'

// 消息提示
const message = useMessage()

// 响应式状态
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const complexityRange = ref<[number, number]>([1, 10])
const popularityRange = ref<[number, number]>([1, 10])
const activeQuickFilter = ref<string | null>(null)
const viewMode = ref<'cards' | 'matrix' | 'comparison'>('cards')
const selectedLicenses = ref<string[]>([])
const comparisonLicenses = ref<License[]>([])
const showDetailsModal = ref(false)
const selectedLicenseForDetails = ref<License | null>(null)

// 筛选选项
const categories = [
  { value: 'permissive', label: '宽松许可证' },
  { value: 'copyleft', label: '强著佐权' },
  { value: 'weak-copyleft', label: '弱著佐权' }
]

const complexityMarks = {
  1: '简单',
  5: '中等',
  10: '复杂'
}

const popularityMarks = {
  1: '低',
  5: '中',
  10: '高'
}

const quickFilters = [
  { key: 'popular', label: '热门许可证' },
  { key: 'simple', label: '简单易懂' },
  { key: 'commercial', label: '商业友好' },
  { key: 'copyleft', label: '开源传染' }
]

// 计算属性
const filteredLicenses = computed(() => {
  let filtered = [...licenses]

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(license =>
      license.name.toLowerCase().includes(query) ||
      license.fullName.toLowerCase().includes(query) ||
      license.description.toLowerCase().includes(query)
    )
  }

  // 类别过滤
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(license =>
      selectedCategories.value.includes(license.category)
    )
  }

  // 复杂度过滤
  filtered = filtered.filter(license =>
    license.complexity >= complexityRange.value[0] &&
    license.complexity <= complexityRange.value[1]
  )

  // 流行度过滤
  filtered = filtered.filter(license =>
    license.popularity >= popularityRange.value[0] &&
    license.popularity <= popularityRange.value[1]
  )

  // 快速筛选
  if (activeQuickFilter.value) {
    switch (activeQuickFilter.value) {
      case 'popular':
        filtered = filtered.filter(license => license.popularity >= 7)
        break
      case 'simple':
        filtered = filtered.filter(license => license.complexity <= 3)
        break
      case 'commercial':
        filtered = filtered.filter(license =>
          license.permissions.includes('commercial-use')
        )
        break
      case 'copyleft':
        filtered = filtered.filter(license =>
          license.category === 'copyleft' || license.category === 'weak-copyleft'
        )
        break
    }
  }

  return filtered
})

// 事件处理
const handleSearch = (value: string) => {
  searchQuery.value = value
}

const toggleCategory = (category: string, checked: boolean) => {
  if (checked) {
    selectedCategories.value.push(category)
  } else {
    const index = selectedCategories.value.indexOf(category)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    }
  }
}

const applyQuickFilter = (filterKey: string) => {
  if (activeQuickFilter.value === filterKey) {
    activeQuickFilter.value = null
  } else {
    activeQuickFilter.value = filterKey
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  complexityRange.value = [1, 10]
  popularityRange.value = [1, 10]
  activeQuickFilter.value = null
}

const handleSelectLicense = (license: License) => {
  const index = selectedLicenses.value.indexOf(license.id)
  if (index > -1) {
    selectedLicenses.value.splice(index, 1)
  } else {
    selectedLicenses.value.push(license.id)
  }
}

const handleViewDetails = (license: License) => {
  selectedLicenseForDetails.value = license
  showDetailsModal.value = true
}

const handleAddToComparison = (license: License) => {
  if (comparisonLicenses.value.length >= 5) {
    message.warning('最多只能对比5个许可证')
    return
  }

  if (!comparisonLicenses.value.find(l => l.id === license.id)) {
    comparisonLicenses.value.push(license)
    message.success(`已添加 ${license.name} 到对比列表`)
  } else {
    message.info(`${license.name} 已在对比列表中`)
  }
}

const handleMatrixCellClick = (data: { feature: string; license: License }) => {
  message.info(`${data.license.name} - ${data.feature}`)
}

const clearComparison = () => {
  comparisonLicenses.value = []
  message.success('已清空对比列表')
}

const handleExportComparison = () => {
  message.info('导出对比数据功能开发中...')
}

const handleAddLicenseToComparison = () => {
  // 可以打开一个选择器让用户添加许可证
  message.info('请从卡片视图或矩阵视图中选择许可证添加到对比')
}

const handleRemoveFromComparison = (license: License) => {
  const index = comparisonLicenses.value.findIndex(l => l.id === license.id)
  if (index > -1) {
    comparisonLicenses.value.splice(index, 1)
    message.success(`已从对比列表中移除 ${license.name}`)
  }
}

const handleExportData = () => {
  const data = {
    licenses: filteredLicenses.value,
    exportTime: new Date().toISOString(),
    filters: {
      search: searchQuery.value,
      categories: selectedCategories.value,
      complexity: complexityRange.value,
      popularity: popularityRange.value,
      quickFilter: activeQuickFilter.value
    }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'licenses-data.json'
  a.click()
  URL.revokeObjectURL(url)

  message.success('数据导出成功')
}
</script>

<style scoped>
/* 现代化知识库页面样式 - 使用新设计系统 */
.knowledge-view {
  min-height: 100vh;
  background: var(--color-background-primary);
  padding: var(--spacing-6);
  position: relative;
}

.knowledge-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-warning-alpha-10) 0%, var(--color-primary-alpha-10) 100%);
  z-index: 0;
}

.knowledge-container {
  max-width: 1400px;
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

.search-section {
  margin-bottom: var(--spacing-6);
  animation: fadeInUp var(--duration-500) var(--ease-out) var(--duration-200);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.view-controls {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--glass-background);
  border-radius: var(--radius-xl);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  animation: fadeInUp var(--duration-500) var(--ease-out) var(--duration-300);
}

.cards-view {
  margin-bottom: var(--spacing-6);
  animation: fadeInUp var(--duration-500) var(--ease-out) var(--duration-500);
}

.empty-state {
  padding: var(--spacing-16) var(--spacing-6);
  text-align: center;
}

.license-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-6);
}

.matrix-view,
.comparison-view {
  background: var(--glass-background-strong);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-glass);
  animation: fadeInUp var(--duration-500) var(--ease-out) var(--duration-700);
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

/* 现代化滑块样式 */
:deep(.n-slider) {
  margin: var(--spacing-2) 0;
}

:deep(.n-slider .n-slider-rail) {
  border-radius: var(--radius-full);
}

:deep(.n-slider .n-slider-handle) {
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
}

/* 现代化按钮组样式 */
:deep(.n-button-group .n-button) {
  border-radius: 0;
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-button-group .n-button:first-child) {
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

:deep(.n-button-group .n-button:last-child) {
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

:deep(.n-button-group .n-button:hover) {
  transform: translateY(-1px);
}

/* 现代化按钮样式 */
:deep(.n-button) {
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 现代化标签样式 */
:deep(.n-tag) {
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-tag:hover) {
  transform: scale(1.05);
}

/* 现代化输入框样式 */
:deep(.n-input) {
  border-radius: var(--radius-lg);
  transition: all var(--duration-200) var(--ease-out);
}

:deep(.n-input:focus-within) {
  box-shadow: 0 0 0 2px var(--color-primary-alpha-20);
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .knowledge-view {
    padding: var(--spacing-4);
  }

  .knowledge-container {
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

  .license-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .view-controls :deep(.n-space) {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .matrix-view,
  .comparison-view {
    padding: var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .knowledge-view {
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
.license-grid > * {
  animation: fadeInUp var(--duration-500) var(--ease-out);
}

.license-grid > *:nth-child(1) { animation-delay: var(--duration-100); }
.license-grid > *:nth-child(2) { animation-delay: var(--duration-200); }
.license-grid > *:nth-child(3) { animation-delay: var(--duration-300); }
.license-grid > *:nth-child(4) { animation-delay: var(--duration-500); }
.license-grid > *:nth-child(5) { animation-delay: var(--duration-700); }
.license-grid > *:nth-child(6) { animation-delay: var(--duration-1000); }

/* 深色模式优化 */
[data-theme="dark"] .knowledge-view::before {
  background: linear-gradient(135deg, var(--color-warning-alpha-10) 0%, var(--color-primary-alpha-10) 100%);
}

/* 注意：fadeInUp动画已在新设计系统中定义 */
</style>
