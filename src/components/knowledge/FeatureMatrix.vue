<template>
  <div class="feature-matrix">
    <!-- 矩阵头部 -->
    <div class="matrix-header">
      <NH3 style="margin: 0 0 8px 0;">许可证特性矩阵</NH3>
      <NText depth="3">快速了解各许可证的权限、条件和限制</NText>
    </div>

    <!-- 图例 -->
    <div class="matrix-legend">
      <NSpace :size="24">
        <NSpace align="center" :size="8">
          <div class="legend-item legend-permission"></div>
          <NText>权限</NText>
        </NSpace>
        <NSpace align="center" :size="8">
          <div class="legend-item legend-condition"></div>
          <NText>条件</NText>
        </NSpace>
        <NSpace align="center" :size="8">
          <div class="legend-item legend-limitation"></div>
          <NText>限制</NText>
        </NSpace>
        <NSpace align="center" :size="8">
          <div class="legend-item legend-none"></div>
          <NText>不适用</NText>
        </NSpace>
      </NSpace>
    </div>

    <!-- 特性矩阵表格 -->
    <div class="matrix-container">
      <div class="matrix-table">
        <!-- 表头 -->
        <div class="matrix-row matrix-header-row">
          <div class="matrix-cell matrix-feature-header">特性</div>
          <div
            v-for="license in licenses"
            :key="license.id"
            class="matrix-cell matrix-license-header"
            @click="$emit('select-license', license)"
          >
            <div class="license-name">{{ license.name }}</div>
            <div class="license-category">
              <NTag :type="getCategoryTagType(license.category)" size="tiny">
                {{ getCategoryLabel(license.category) }}
              </NTag>
            </div>
          </div>
        </div>

        <!-- 特性行 -->
        <div
          v-for="feature in features"
          :key="feature.key"
          class="matrix-row"
          @mouseenter="highlightFeature(feature.key)"
          @mouseleave="clearHighlight"
        >
          <div class="matrix-cell matrix-feature-cell">
            <div class="feature-info">
              <NText strong>{{ feature.label }}</NText>
              <NText depth="3" style="font-size: 12px;">{{ feature.description }}</NText>
            </div>
          </div>
          
          <div
            v-for="license in licenses"
            :key="`${feature.key}-${license.id}`"
            class="matrix-cell matrix-value-cell"
            :class="getCellClass(feature.key, license)"
            @click="$emit('cell-click', { feature: feature.key, license })"
          >
            <div class="cell-content">
              <NIcon
                v-if="hasFeature(feature.key, license)"
                size="16"
                :color="getCellIconColor(feature.key, license)"
              >
                <CheckmarkOutline />
              </NIcon>
              <NIcon v-else size="16" color="#ccc">
                <RemoveOutline />
              </NIcon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="matrix-stats">
      <NGrid :cols="4" :x-gap="16" responsive="screen">
        <NGi>
          <div class="stat-card">
            <NText strong style="color: #18a058;">{{ totalPermissions }}</NText>
            <NText depth="3">总权限数</NText>
          </div>
        </NGi>
        <NGi>
          <div class="stat-card">
            <NText strong style="color: #f0a020;">{{ totalConditions }}</NText>
            <NText depth="3">总条件数</NText>
          </div>
        </NGi>
        <NGi>
          <div class="stat-card">
            <NText strong style="color: #d03050;">{{ totalLimitations }}</NText>
            <NText depth="3">总限制数</NText>
          </div>
        </NGi>
        <NGi>
          <div class="stat-card">
            <NText strong style="color: #2080f0;">{{ averageComplexity }}</NText>
            <NText depth="3">平均复杂度</NText>
          </div>
        </NGi>
      </NGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NH3, NText, NSpace, NTag, NIcon, NGrid, NGi } from 'naive-ui'
import { CheckmarkOutline, RemoveOutline } from '@vicons/ionicons5'
import type { License } from '@/types/license.types'

// Props
interface Props {
  licenses: License[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'select-license', license: License): void
  (e: 'cell-click', data: { feature: string; license: License }): void
}

defineEmits<Emits>()

// 响应式状态
const highlightedFeature = ref<string | null>(null)

// 特性定义
const features = [
  {
    key: 'commercial-use',
    label: '商业使用',
    description: '允许在商业项目中使用',
    type: 'permission'
  },
  {
    key: 'modifications',
    label: '修改',
    description: '允许修改源代码',
    type: 'permission'
  },
  {
    key: 'distribution',
    label: '分发',
    description: '允许分发软件',
    type: 'permission'
  },
  {
    key: 'private-use',
    label: '私人使用',
    description: '允许私人使用',
    type: 'permission'
  },
  {
    key: 'patent-use',
    label: '专利使用',
    description: '提供专利使用权',
    type: 'permission'
  },
  {
    key: 'include-copyright',
    label: '包含版权',
    description: '必须包含版权声明',
    type: 'condition'
  },
  {
    key: 'include-license',
    label: '包含许可证',
    description: '必须包含许可证文本',
    type: 'condition'
  },
  {
    key: 'document-changes',
    label: '记录修改',
    description: '必须记录代码修改',
    type: 'condition'
  },
  {
    key: 'disclose-source',
    label: '公开源码',
    description: '必须公开源代码',
    type: 'condition'
  },
  {
    key: 'same-license',
    label: '相同许可证',
    description: '衍生作品必须使用相同许可证',
    type: 'condition'
  },
  {
    key: 'liability',
    label: '责任限制',
    description: '限制作者责任',
    type: 'limitation'
  },
  {
    key: 'warranty',
    label: '保证限制',
    description: '不提供保证',
    type: 'limitation'
  },
  {
    key: 'trademark-use',
    label: '商标限制',
    description: '限制商标使用',
    type: 'limitation'
  }
]

// 计算属性
const totalPermissions = computed(() => {
  return features.filter(f => f.type === 'permission').length
})

const totalConditions = computed(() => {
  return features.filter(f => f.type === 'condition').length
})

const totalLimitations = computed(() => {
  return features.filter(f => f.type === 'limitation').length
})

const averageComplexity = computed(() => {
  if (props.licenses.length === 0) return '0'
  const total = props.licenses.reduce((sum, license) => sum + license.complexity, 0)
  return (total / props.licenses.length).toFixed(1)
})

// 方法
const hasFeature = (featureKey: string, license: License): boolean => {
  return license.permissions.includes(featureKey as any) ||
         license.conditions.includes(featureKey as any) ||
         license.limitations.includes(featureKey as any)
}

const getFeatureType = (featureKey: string, license: License): string => {
  if (license.permissions.includes(featureKey as any)) return 'permission'
  if (license.conditions.includes(featureKey as any)) return 'condition'
  if (license.limitations.includes(featureKey as any)) return 'limitation'
  return 'none'
}

const getCellClass = (featureKey: string, license: License): string => {
  const type = getFeatureType(featureKey, license)
  const isHighlighted = highlightedFeature.value === featureKey
  return `cell-${type} ${isHighlighted ? 'cell-highlighted' : ''}`
}

const getCellIconColor = (featureKey: string, license: License): string => {
  const type = getFeatureType(featureKey, license)
  switch (type) {
    case 'permission': return '#18a058'
    case 'condition': return '#f0a020'
    case 'limitation': return '#d03050'
    default: return '#ccc'
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
    'permissive': '宽松',
    'copyleft': '强著佐权',
    'weak-copyleft': '弱著佐权'
  }
  return labels[category] || category
}

const highlightFeature = (featureKey: string) => {
  highlightedFeature.value = featureKey
}

const clearHighlight = () => {
  highlightedFeature.value = null
}
</script>

<style scoped>
.feature-matrix {
  width: 100%;
}

.matrix-header {
  margin-bottom: 20px;
  text-align: center;
}

.matrix-legend {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
  display: flex;
  justify-content: center;
}

.legend-item {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-xs);
}

.legend-permission { background-color: var(--color-success); }
.legend-condition { background-color: var(--color-warning); }
.legend-limitation { background-color: var(--color-error); }
.legend-none { background-color: var(--color-text-quaternary); }

.matrix-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.matrix-table {
  min-width: 800px;
  background: var(--color-background-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.matrix-row {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.matrix-row:last-child {
  border-bottom: none;
}

.matrix-header-row {
  background-color: var(--color-background-secondary);
  font-weight: 600;
}

.matrix-cell {
  padding: 12px;
  border-right: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.matrix-cell:last-child {
  border-right: none;
}

.matrix-feature-header,
.matrix-feature-cell {
  width: 200px;
  min-width: 200px;
  justify-content: flex-start;
  background-color: var(--color-background-secondary);
}

.matrix-license-header {
  width: 120px;
  min-width: 120px;
  flex-direction: column;
  cursor: pointer;
  transition: background-color var(--duration-200) var(--ease-out);
}

.matrix-license-header:hover {
  background-color: var(--color-primary-alpha-10);
}

.matrix-value-cell {
  width: 120px;
  min-width: 120px;
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-out);
}

.license-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.license-category {
  font-size: 12px;
}

.feature-info {
  text-align: left;
}

.cell-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 单元格状态样式 */
.cell-permission {
  background-color: var(--color-success-alpha-10);
}

.cell-condition {
  background-color: var(--color-warning-alpha-10);
}

.cell-limitation {
  background-color: var(--color-error-alpha-10);
}

.cell-none {
  background-color: var(--color-text-quaternary-alpha-10);
}

.cell-highlighted {
  box-shadow: inset 0 0 0 2px var(--color-primary);
}

.matrix-value-cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: var(--shadow-lg);
}

.matrix-stats {
  padding: 20px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: var(--color-background-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.stat-card strong {
  display: block;
  font-size: 24px;
  margin-bottom: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .matrix-legend {
    padding: 12px;
  }
  
  .matrix-legend .n-space {
    flex-direction: column;
    gap: 8px !important;
  }
  
  .matrix-cell {
    padding: 8px;
  }
  
  .matrix-feature-header,
  .matrix-feature-cell {
    width: 150px;
    min-width: 150px;
  }
  
  .matrix-license-header,
  .matrix-value-cell {
    width: 100px;
    min-width: 100px;
  }
  
  .license-name {
    font-size: 12px;
  }
}
</style>
