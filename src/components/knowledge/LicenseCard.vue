<template>
  <NCard 
    class="license-card" 
    :class="{ 'license-card--selected': selected }"
    hoverable
    @click="$emit('select', license)"
  >
    <template #header>
      <NSpace align="center" justify="space-between">
        <div class="license-header">
          <NH3 style="margin: 0; color: #2c3e50;">{{ license.name }}</NH3>
          <NText depth="3" style="font-size: 14px;">{{ license.fullName }}</NText>
        </div>
        <div class="license-badges">
          <NTag :type="getCategoryTagType(license.category)" size="small">
            {{ getCategoryLabel(license.category) }}
          </NTag>
        </div>
      </NSpace>
    </template>

    <NSpace vertical size="medium">
      <!-- 许可证描述 -->
      <NP style="margin: 0; line-height: 1.6;">{{ license.description }}</NP>

      <!-- 评级指标 -->
      <div class="license-metrics">
        <NGrid :cols="2" :x-gap="12">
          <NGi>
            <div class="metric-item">
              <NSpace align="center" :size="8">
                <NIcon size="16" color="#f0a020">
                  <StarOutline />
                </NIcon>
                <NText depth="3">流行度</NText>
              </NSpace>
              <NProgress
                type="line"
                :percentage="(license.popularity / 10) * 100"
                :height="6"
                :show-indicator="false"
                color="#f0a020"
                style="margin-top: 4px;"
              />
              <NText style="font-size: 12px;">{{ license.popularity }}/10</NText>
            </div>
          </NGi>
          <NGi>
            <div class="metric-item">
              <NSpace align="center" :size="8">
                <NIcon size="16" :color="getComplexityColor(license.complexity)">
                  <AnalyticsOutline />
                </NIcon>
                <NText depth="3">复杂度</NText>
              </NSpace>
              <NProgress
                type="line"
                :percentage="(license.complexity / 10) * 100"
                :height="6"
                :show-indicator="false"
                :color="getComplexityColor(license.complexity)"
                style="margin-top: 4px;"
              />
              <NText style="font-size: 12px;">{{ license.complexity }}/10</NText>
            </div>
          </NGi>
        </NGrid>
      </div>

      <!-- 许可证特性预览 -->
      <div class="license-features">
        <NSpace vertical :size="12">
          <!-- 权限 -->
          <div>
            <NText strong style="color: #18a058; font-size: 14px;">
              <NIcon style="margin-right: 4px;"><CheckmarkCircleOutline /></NIcon>
              权限 ({{ license.permissions.length }})
            </NText>
            <div style="margin-top: 6px;">
              <NSpace :size="4" wrap>
                <NTag
                  v-for="permission in license.permissions.slice(0, 3)"
                  :key="permission"
                  type="success"
                  size="tiny"
                >
                  {{ getPermissionLabel(permission) }}
                </NTag>
                <NTag v-if="license.permissions.length > 3" size="tiny" quaternary>
                  +{{ license.permissions.length - 3 }}
                </NTag>
              </NSpace>
            </div>
          </div>

          <!-- 条件 -->
          <div>
            <NText strong style="color: #f0a020; font-size: 14px;">
              <NIcon style="margin-right: 4px;"><InformationCircleOutline /></NIcon>
              条件 ({{ license.conditions.length }})
            </NText>
            <div style="margin-top: 6px;">
              <NSpace :size="4" wrap>
                <NTag
                  v-for="condition in license.conditions.slice(0, 3)"
                  :key="condition"
                  type="warning"
                  size="tiny"
                >
                  {{ getConditionLabel(condition) }}
                </NTag>
                <NTag v-if="license.conditions.length > 3" size="tiny" quaternary>
                  +{{ license.conditions.length - 3 }}
                </NTag>
              </NSpace>
            </div>
          </div>

          <!-- 限制 -->
          <div>
            <NText strong style="color: #d03050; font-size: 14px;">
              <NIcon style="margin-right: 4px;"><CloseCircleOutline /></NIcon>
              限制 ({{ license.limitations.length }})
            </NText>
            <div style="margin-top: 6px;">
              <NSpace :size="4" wrap>
                <NTag
                  v-for="limitation in license.limitations.slice(0, 3)"
                  :key="limitation"
                  type="error"
                  size="tiny"
                >
                  {{ getLimitationLabel(limitation) }}
                </NTag>
                <NTag v-if="license.limitations.length > 3" size="tiny" quaternary>
                  +{{ license.limitations.length - 3 }}
                </NTag>
              </NSpace>
            </div>
          </div>
        </NSpace>
      </div>
    </NSpace>

    <template #action>
      <NSpace justify="space-between">
        <NSpace :size="8">
          <NButton size="small" quaternary @click.stop="$emit('view-details', license)">
            <template #icon>
              <NIcon><EyeOutline /></NIcon>
            </template>
            详情
          </NButton>
          <NButton size="small" quaternary @click.stop="$emit('compare', license)">
            <template #icon>
              <NIcon><GitCompareOutline /></NIcon>
            </template>
            对比
          </NButton>
        </NSpace>
        
        <NButton
          size="small"
          type="primary"
          tag="a"
          :href="license.url"
          target="_blank"
          @click.stop
        >
          <template #icon>
            <NIcon><OpenOutline /></NIcon>
          </template>
          官方
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import {
  NCard, NSpace, NH3, NText, NTag, NP, NGrid, NGi, NProgress,
  NIcon, NButton
} from 'naive-ui'
import {
  StarOutline, AnalyticsOutline, CheckmarkCircleOutline,
  InformationCircleOutline, CloseCircleOutline, EyeOutline,
  GitCompareOutline, OpenOutline
} from '@vicons/ionicons5'
import type { License } from '@/types/license.types'

// Props
interface Props {
  license: License
  selected?: boolean
}

defineProps<Props>()

// Emits
interface Emits {
  (e: 'select', license: License): void
  (e: 'view-details', license: License): void
  (e: 'compare', license: License): void
}

defineEmits<Emits>()

// 工具函数
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

const getComplexityColor = (complexity: number): string => {
  if (complexity <= 3) return '#18a058'
  if (complexity <= 6) return '#f0a020'
  return '#d03050'
}

const getPermissionLabel = (permission: string): string => {
  const labels: Record<string, string> = {
    'commercial-use': '商用',
    'modifications': '修改',
    'distribution': '分发',
    'private-use': '私用',
    'patent-use': '专利'
  }
  return labels[permission] || permission
}

const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    'include-copyright': '版权',
    'include-license': '许可证',
    'document-changes': '记录',
    'disclose-source': '开源',
    'same-license': '同许可证'
  }
  return labels[condition] || condition
}

const getLimitationLabel = (limitation: string): string => {
  const labels: Record<string, string> = {
    'liability': '责任',
    'warranty': '保证',
    'trademark-use': '商标'
  }
  return labels[limitation] || limitation
}
</script>

<style scoped>
.license-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.license-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.license-card--selected {
  border-color: #18a058;
  box-shadow: 0 4px 16px rgba(24, 160, 88, 0.2);
}

.license-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.license-metrics {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.metric-item {
  text-align: center;
}

.license-features {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
  border-left: 4px solid #18a058;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-card {
    margin-bottom: var(--space-large);
  }

  .license-header h3 {
    font-size: var(--font-size-large);
  }

  .license-metrics {
    padding: var(--space-small);
  }

  .license-features {
    padding: var(--space-small);
  }
}

@media (max-width: 480px) {
  .license-card {
    margin-bottom: var(--space-medium);
  }

  .license-header h3 {
    font-size: var(--font-size-medium);
  }

  .license-metrics {
    padding: var(--space-tiny);
  }

  .license-features {
    padding: var(--space-tiny);
  }

  .feature-item {
    font-size: var(--font-size-small);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .license-card {
  background-color: var(--card-color);
  border-color: var(--border-color);
}

[data-theme="dark"] .license-metrics {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .license-features {
  background-color: rgba(255, 255, 255, 0.03);
  border-left-color: var(--primary-color);
}
</style>
