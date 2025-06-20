<template>
  <div class="comparison-table">
    <!-- 表格头部 -->
    <div class="table-header">
      <NSpace align="center" justify="space-between">
        <div>
          <NH3 style="margin: 0;">许可证对比</NH3>
          <NText depth="3">对比 {{ licenses.length }} 个许可证的特性差异</NText>
        </div>
        <NSpace>
          <NButton @click="$emit('clear-all')" v-if="licenses.length > 0">
            <template #icon>
              <NIcon><TrashOutline /></NIcon>
            </template>
            清空
          </NButton>
          <NButton @click="$emit('export-comparison')" type="primary" v-if="licenses.length > 1">
            <template #icon>
              <NIcon><DownloadOutline /></NIcon>
            </template>
            导出对比
          </NButton>
        </NSpace>
      </NSpace>
    </div>

    <!-- 空状态 -->
    <div v-if="licenses.length === 0" class="empty-state">
      <NEmpty description="请选择许可证进行对比">
        <template #icon>
          <NIcon size="48" color="#ccc">
            <GitCompareOutline />
          </NIcon>
        </template>
        <template #extra>
          <NButton @click="$emit('add-license')" type="primary">
            <template #icon>
              <NIcon><AddOutline /></NIcon>
            </template>
            添加许可证
          </NButton>
        </template>
      </NEmpty>
    </div>

    <!-- 对比表格 -->
    <div v-else class="table-container">
      <NDataTable
        :columns="tableColumns"
        :data="tableData"
        :scroll-x="scrollWidth"
        :max-height="600"
        striped
        size="small"
      />
    </div>

    <!-- 对比摘要 -->
    <div v-if="licenses.length > 1" class="comparison-summary">
      <NCard title="对比摘要">
        <NSpace vertical :size="16">
          <!-- 相同特性 -->
          <div v-if="commonFeatures.length > 0">
            <NText strong style="color: #18a058;">
              <NIcon style="margin-right: 6px;"><CheckmarkCircleOutline /></NIcon>
              共同特性
            </NText>
            <div style="margin-top: 8px;">
              <NSpace :size="8" wrap>
                <NTag
                  v-for="feature in commonFeatures"
                  :key="feature"
                  type="success"
                  size="small"
                >
                  {{ feature }}
                </NTag>
              </NSpace>
            </div>
          </div>

          <!-- 主要差异 -->
          <div v-if="majorDifferences.length > 0">
            <NText strong style="color: #f0a020;">
              <NIcon style="margin-right: 6px;"><WarningOutline /></NIcon>
              主要差异
            </NText>
            <NList style="margin-top: 8px;">
              <NListItem v-for="(diff, index) in majorDifferences" :key="index">
                <NText>{{ diff }}</NText>
              </NListItem>
            </NList>
          </div>

          <!-- 推荐建议 -->
          <div v-if="recommendations.length > 0">
            <NText strong style="color: #2080f0;">
              <NIcon style="margin-right: 6px;"><BulbOutline /></NIcon>
              选择建议
            </NText>
            <NList style="margin-top: 8px;">
              <NListItem v-for="(rec, index) in recommendations" :key="index">
                <NText>{{ rec }}</NText>
              </NListItem>
            </NList>
          </div>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import {
  NSpace, NH3, NText, NButton, NIcon, NEmpty, NDataTable, NCard,
  NTag, NList, NListItem
} from 'naive-ui'
import {
  TrashOutline, DownloadOutline, GitCompareOutline, AddOutline,
  CheckmarkCircleOutline, WarningOutline, BulbOutline,
  CheckmarkOutline, CloseOutline, RemoveOutline
} from '@vicons/ionicons5'
import type { License } from '@/types/license.types'

// Props
interface Props {
  licenses: License[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'clear-all'): void
  (e: 'export-comparison'): void
  (e: 'add-license'): void
  (e: 'remove-license', license: License): void
}

const emit = defineEmits<Emits>()

// 计算属性
const scrollWidth = computed(() => {
  return Math.max(800, 200 + props.licenses.length * 200)
})

const tableColumns = computed(() => {
  const columns: any[] = [
    {
      title: '特性',
      key: 'feature',
      width: 200,
      fixed: 'left' as const,
      render: (row: any) => h('strong', row.feature)
    }
  ]

  props.licenses.forEach((license, index) => {
    columns.push({
      title: license.name,
      key: `license_${index}`,
      width: 200,
      render: (row: any) => {
        const value = row[`license_${index}`]
        if (typeof value === 'boolean') {
          return h(NIcon, {
            size: 16,
            color: value ? 'var(--color-success)' : 'var(--color-error)'
          }, () => h(value ? CheckmarkOutline : CloseOutline))
        }
        if (Array.isArray(value)) {
          return h('div', value.map(item => 
            h(NTag, { size: 'tiny', style: 'margin: 2px;' }, () => item)
          ))
        }
        return value || h(NIcon, { size: 16, color: 'var(--color-text-quaternary)' }, () => h(RemoveOutline))
      }
    })
  })

  return columns
})

const tableData = computed(() => {
  if (props.licenses.length === 0) return []

  const features = [
    { key: 'category', label: '许可证类别' },
    { key: 'popularity', label: '流行度' },
    { key: 'complexity', label: '复杂度' },
    { key: 'commercial-use', label: '商业使用' },
    { key: 'modifications', label: '允许修改' },
    { key: 'distribution', label: '允许分发' },
    { key: 'private-use', label: '私人使用' },
    { key: 'patent-use', label: '专利使用' },
    { key: 'include-copyright', label: '包含版权' },
    { key: 'include-license', label: '包含许可证' },
    { key: 'document-changes', label: '记录修改' },
    { key: 'disclose-source', label: '公开源码' },
    { key: 'same-license', label: '相同许可证' },
    { key: 'liability', label: '责任限制' },
    { key: 'warranty', label: '保证限制' },
    { key: 'trademark-use', label: '商标限制' }
  ]

  return features.map(feature => {
    const row: any = { feature: feature.label }
    
    props.licenses.forEach((license, index) => {
      let value: any
      
      switch (feature.key) {
        case 'category':
          value = getCategoryLabel(license.category)
          break
        case 'popularity':
          value = `${license.popularity}/10`
          break
        case 'complexity':
          value = `${license.complexity}/10`
          break
        default:
          if (license.permissions.includes(feature.key as any)) {
            value = true
          } else if (license.conditions.includes(feature.key as any)) {
            value = true
          } else if (license.limitations.includes(feature.key as any)) {
            value = true
          } else {
            value = false
          }
      }
      
      row[`license_${index}`] = value
    })
    
    return row
  })
})

const commonFeatures = computed(() => {
  if (props.licenses.length < 2) return []
  
  const features: string[] = []
  const allPermissions = props.licenses.map(l => l.permissions).flat()
  const allConditions = props.licenses.map(l => l.conditions).flat()
  
  // 找出所有许可证都有的权限
  const uniquePermissions = [...new Set(allPermissions)]
  uniquePermissions.forEach(permission => {
    if (props.licenses.every(license => license.permissions.includes(permission))) {
      features.push(getPermissionLabel(permission))
    }
  })
  
  // 找出所有许可证都有的条件
  const uniqueConditions = [...new Set(allConditions)]
  uniqueConditions.forEach(condition => {
    if (props.licenses.every(license => license.conditions.includes(condition))) {
      features.push(getConditionLabel(condition))
    }
  })
  
  return features
})

const majorDifferences = computed(() => {
  if (props.licenses.length < 2) return []
  
  const differences: string[] = []
  
  // 检查类别差异
  const categories = [...new Set(props.licenses.map(l => l.category))]
  if (categories.length > 1) {
    differences.push(`许可证类别不同：${categories.map(getCategoryLabel).join('、')}`)
  }
  
  // 检查copyleft差异
  const hasPermissive = props.licenses.some(l => l.category === 'permissive')
  const hasCopyleft = props.licenses.some(l => l.category === 'copyleft')
  if (hasPermissive && hasCopyleft) {
    differences.push('包含宽松许可证和强著佐权许可证，兼容性可能存在问题')
  }
  
  return differences
})

const recommendations = computed(() => {
  if (props.licenses.length < 2) return []
  
  const recs: string[] = []
  
  // 基于复杂度推荐
  const complexities = props.licenses.map(l => l.complexity)
  const minComplexity = Math.min(...complexities)
  const simplestLicense = props.licenses.find(l => l.complexity === minComplexity)
  if (simplestLicense) {
    recs.push(`${simplestLicense.name} 最简单易懂，适合初学者`)
  }
  
  // 基于流行度推荐
  const popularities = props.licenses.map(l => l.popularity)
  const maxPopularity = Math.max(...popularities)
  const mostPopularLicense = props.licenses.find(l => l.popularity === maxPopularity)
  if (mostPopularLicense) {
    recs.push(`${mostPopularLicense.name} 最受欢迎，社区支持最好`)
  }
  
  return recs
})

// 工具函数
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'permissive': '宽松许可证',
    'copyleft': '强著佐权',
    'weak-copyleft': '弱著佐权'
  }
  return labels[category] || category
}

const getPermissionLabel = (permission: string): string => {
  const labels: Record<string, string> = {
    'commercial-use': '商业使用',
    'modifications': '修改',
    'distribution': '分发',
    'private-use': '私人使用',
    'patent-use': '专利使用'
  }
  return labels[permission] || permission
}

const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    'include-copyright': '包含版权',
    'include-license': '包含许可证',
    'document-changes': '记录修改',
    'disclose-source': '公开源码',
    'same-license': '相同许可证'
  }
  return labels[condition] || condition
}
</script>

<style scoped>
.comparison-table {
  width: 100%;
}

.table-header {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.table-container {
  margin-bottom: 20px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.comparison-summary {
  margin-top: 20px;
}

/* 表格样式增强 */
:deep(.n-data-table) {
  border-radius: var(--radius-md);
}

:deep(.n-data-table-th) {
  background-color: var(--color-background-secondary) !important;
  font-weight: 600;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid var(--color-border);
}

:deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: var(--color-background-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-header {
    padding: 12px;
  }
  
  .table-header .n-space {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .empty-state {
    padding: 20px;
  }
}
</style>
