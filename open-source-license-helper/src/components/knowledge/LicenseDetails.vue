<template>
  <div class="license-details">
    <NSpace vertical :size="24">
      <!-- 许可证头部 -->
      <div class="license-header">
        <NSpace align="center" justify="space-between">
          <div>
            <NH2 style="margin: 0; color: #18a058;">{{ license.name }}</NH2>
            <NText depth="3" style="font-size: 16px;">{{ license.fullName }}</NText>
            <div style="margin-top: 8px;">
              <NSpace :size="8">
                <NTag :type="getCategoryTagType(license.category)">
                  {{ getCategoryLabel(license.category) }}
                </NTag>
                <NTag type="info">SPDX: {{ license.spdxId }}</NTag>
              </NSpace>
            </div>
          </div>
          <div class="license-metrics">
            <div class="metric">
              <NText strong>{{ license.popularity }}/10</NText>
              <NText depth="3">流行度</NText>
            </div>
            <div class="metric">
              <NText strong>{{ license.complexity }}/10</NText>
              <NText depth="3">复杂度</NText>
            </div>
          </div>
        </NSpace>
      </div>

      <!-- 许可证描述 -->
      <div class="license-description">
        <NH4>描述</NH4>
        <NP>{{ license.description }}</NP>
      </div>

      <!-- 许可证特性 -->
      <div class="license-features">
        <NGrid :cols="1" :y-gap="20">
          <!-- 权限 -->
          <NGi>
            <div class="feature-section permissions">
              <NH4 style="color: #18a058; margin-bottom: 12px;">
                <NIcon style="margin-right: 8px;"><CheckmarkCircleOutline /></NIcon>
                允许的权限
              </NH4>
              <NSpace :size="16" wrap>
                <div
                  v-for="permission in license.permissions"
                  :key="permission"
                  class="feature-item feature-permission"
                >
                  <NIcon><CheckmarkOutline /></NIcon>
                  <div>
                    <NText strong>{{ getPermissionLabel(permission) }}</NText>
                    <NText depth="3" style="display: block; font-size: 12px;">
                      {{ getPermissionDescription(permission) }}
                    </NText>
                  </div>
                </div>
              </NSpace>
            </div>
          </NGi>

          <!-- 条件 -->
          <NGi>
            <div class="feature-section conditions">
              <NH4 style="color: #f0a020; margin-bottom: 12px;">
                <NIcon style="margin-right: 8px;"><InformationCircleOutline /></NIcon>
                使用条件
              </NH4>
              <NSpace :size="16" wrap>
                <div
                  v-for="condition in license.conditions"
                  :key="condition"
                  class="feature-item feature-condition"
                >
                  <NIcon><WarningOutline /></NIcon>
                  <div>
                    <NText strong>{{ getConditionLabel(condition) }}</NText>
                    <NText depth="3" style="display: block; font-size: 12px;">
                      {{ getConditionDescription(condition) }}
                    </NText>
                  </div>
                </div>
              </NSpace>
            </div>
          </NGi>

          <!-- 限制 -->
          <NGi>
            <div class="feature-section limitations">
              <NH4 style="color: #d03050; margin-bottom: 12px;">
                <NIcon style="margin-right: 8px;"><CloseCircleOutline /></NIcon>
                限制条款
              </NH4>
              <NSpace :size="16" wrap>
                <div
                  v-for="limitation in license.limitations"
                  :key="limitation"
                  class="feature-item feature-limitation"
                >
                  <NIcon><CloseOutline /></NIcon>
                  <div>
                    <NText strong>{{ getLimitationLabel(limitation) }}</NText>
                    <NText depth="3" style="display: block; font-size: 12px;">
                      {{ getLimitationDescription(limitation) }}
                    </NText>
                  </div>
                </div>
              </NSpace>
            </div>
          </NGi>
        </NGrid>
      </div>

      <!-- 兼容性信息 -->
      <div v-if="license.compatibility.length > 0" class="compatibility-section">
        <NH4>兼容的许可证</NH4>
        <NSpace :size="8" wrap>
          <NTag
            v-for="compatibleId in license.compatibility"
            :key="compatibleId"
            type="success"
            size="small"
          >
            {{ getCompatibleLicenseName(compatibleId) }}
          </NTag>
        </NSpace>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <NSpace>
          <NButton type="primary" tag="a" :href="license.url" target="_blank">
            <template #icon>
              <NIcon><OpenOutline /></NIcon>
            </template>
            查看官方文档
          </NButton>
          
          <NButton @click="$emit('add-to-comparison', license)">
            <template #icon>
              <NIcon><GitCompareOutline /></NIcon>
            </template>
            添加到对比
          </NButton>
          
          <NButton @click="handleCopyInfo">
            <template #icon>
              <NIcon><CopyOutline /></NIcon>
            </template>
            复制信息
          </NButton>
          
          <NButton @click="$emit('close')">
            关闭
          </NButton>
        </NSpace>
      </div>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import {
  NSpace, NH2, NH4, NText, NTag, NP, NGrid, NGi, NIcon, NButton
} from 'naive-ui'
import {
  CheckmarkCircleOutline, InformationCircleOutline, CloseCircleOutline,
  CheckmarkOutline, WarningOutline, CloseOutline, OpenOutline,
  GitCompareOutline, CopyOutline
} from '@vicons/ionicons5'
import type { License } from '@/types/license.types'
import { getLicenseById } from '@/data/licenses.data'

// Props
interface Props {
  license: License
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'add-to-comparison', license: License): void
}

const emit = defineEmits<Emits>()

// 消息提示
const message = useMessage()

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

const getPermissionDescription = (permission: string): string => {
  const descriptions: Record<string, string> = {
    'commercial-use': '可以在商业项目中使用此软件',
    'modifications': '可以修改源代码',
    'distribution': '可以分发软件的副本',
    'private-use': '可以私人使用此软件',
    'patent-use': '提供明确的专利使用权'
  }
  return descriptions[permission] || ''
}

const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    'include-copyright': '包含版权声明',
    'include-license': '包含许可证文本',
    'document-changes': '记录修改',
    'disclose-source': '公开源代码',
    'same-license': '使用相同许可证'
  }
  return labels[condition] || condition
}

const getConditionDescription = (condition: string): string => {
  const descriptions: Record<string, string> = {
    'include-copyright': '必须在软件副本中包含原始版权声明',
    'include-license': '必须在软件副本中包含许可证文本',
    'document-changes': '必须记录对源代码的修改',
    'disclose-source': '必须公开源代码',
    'same-license': '衍生作品必须使用相同的许可证'
  }
  return descriptions[condition] || ''
}

const getLimitationLabel = (limitation: string): string => {
  const labels: Record<string, string> = {
    'liability': '责任限制',
    'warranty': '保证限制',
    'trademark-use': '商标使用限制'
  }
  return labels[limitation] || limitation
}

const getLimitationDescription = (limitation: string): string => {
  const descriptions: Record<string, string> = {
    'liability': '软件作者不承担使用软件造成的损害责任',
    'warranty': '软件按"现状"提供，不提供任何保证',
    'trademark-use': '不授予使用作者商标的权利'
  }
  return descriptions[limitation] || ''
}

const getCompatibleLicenseName = (licenseId: string): string => {
  const license = getLicenseById(licenseId)
  return license ? license.name : licenseId
}

const handleCopyInfo = () => {
  const info = `
许可证：${props.license.name} (${props.license.fullName})
类别：${getCategoryLabel(props.license.category)}
描述：${props.license.description}
SPDX ID：${props.license.spdxId}
官方链接：${props.license.url}
  `.trim()
  
  navigator.clipboard.writeText(info).then(() => {
    message.success('许可证信息已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败，请手动复制')
  })
}
</script>

<style scoped>
.license-details {
  max-height: 70vh;
  overflow-y: auto;
}

.license-header {
  padding: 20px;
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-success);
}

.license-metrics {
  display: flex;
  gap: 20px;
}

.metric {
  text-align: center;
}

.metric strong {
  display: block;
  font-size: 20px;
  color: var(--color-success);
}

.license-description {
  padding: 16px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-success);
}

.feature-section {
  padding: 16px;
  border-radius: var(--radius-md);
}

.permissions {
  background-color: var(--color-success-alpha-10);
  border-left: 4px solid var(--color-success);
}

.conditions {
  background-color: var(--color-warning-alpha-10);
  border-left: 4px solid var(--color-warning);
}

.limitations {
  background-color: var(--color-error-alpha-10);
  border-left: 4px solid var(--color-error);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: var(--color-background-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  min-width: 200px;
}

.feature-permission .n-icon {
  color: var(--color-success);
}

.feature-condition .n-icon {
  color: var(--color-warning);
}

.feature-limitation .n-icon {
  color: var(--color-error);
}

.compatibility-section {
  padding: 16px;
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
}

.action-buttons {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-header .n-space {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .license-metrics {
    margin-top: 16px;
    justify-content: center;
  }
  
  .feature-item {
    min-width: auto;
    width: 100%;
  }
  
  .action-buttons .n-space {
    flex-direction: column;
  }
}
</style>
