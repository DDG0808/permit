<template>
  <NCard>
    <template #header>
      <NSpace align="center">
        <NIcon size="20" color="var(--color-success)">
          <DocumentTextOutline />
        </NIcon>
        <NText strong>许可证信息</NText>
      </NSpace>
    </template>

    <!-- 有许可证的情况 -->
    <div v-if="license">
      <NSpace vertical size="large">
        <!-- 许可证头部 -->
        <div class="license-header">
          <NSpace align="center" justify="space-between">
            <div class="license-info">
              <NH3 style="margin: 0; color: var(--color-success);">
                {{ license.license.name }}
              </NH3>
              <NSpace align="center" size="small" style="margin-top: 4px;">
                <NTag type="success" size="small">
                  {{ license.license.key }}
                </NTag>
                <NTag v-if="license.license.spdxId" type="info" size="small">
                  SPDX: {{ license.license.spdxId }}
                </NTag>
              </NSpace>
            </div>
            <div class="license-badge">
              <NIcon size="48" color="var(--color-success)">
                <ShieldCheckmarkOutline />
              </NIcon>
            </div>
          </NSpace>
        </div>

        <!-- 许可证详情 -->
        <div v-if="licenseDetails" class="license-details">
          <NSpace vertical size="medium">
            <!-- 许可证描述 -->
            <div>
              <NText strong style="display: block; margin-bottom: 8px;">描述</NText>
              <NP>{{ licenseDetails.description }}</NP>
            </div>

            <!-- 许可证特性 -->
            <div class="license-features">
              <NGrid :cols="1" :y-gap="16">
                <!-- 权限 -->
                <NGi>
                  <div class="feature-section">
                    <NText strong style="color: var(--color-success);">
                      <NIcon style="margin-right: 6px;"><CheckmarkCircleOutline /></NIcon>
                      允许的权限
                    </NText>
                    <NSpace size="small" style="margin-top: 8px;" wrap>
                      <NTag
                        v-for="permission in licenseDetails.permissions"
                        :key="permission"
                        type="success"
                        size="small"
                      >
                        {{ getPermissionLabel(permission) }}
                      </NTag>
                    </NSpace>
                  </div>
                </NGi>

                <!-- 条件 -->
                <NGi>
                  <div class="feature-section">
                    <NText strong style="color: var(--color-warning);">
                      <NIcon style="margin-right: 6px;"><InformationCircleOutline /></NIcon>
                      使用条件
                    </NText>
                    <NSpace size="small" style="margin-top: 8px;" wrap>
                      <NTag
                        v-for="condition in licenseDetails.conditions"
                        :key="condition"
                        type="warning"
                        size="small"
                      >
                        {{ getConditionLabel(condition) }}
                      </NTag>
                    </NSpace>
                  </div>
                </NGi>

                <!-- 限制 -->
                <NGi>
                  <div class="feature-section">
                    <NText strong style="color: var(--color-error);">
                      <NIcon style="margin-right: 6px;"><CloseCircleOutline /></NIcon>
                      限制条款
                    </NText>
                    <NSpace size="small" style="margin-top: 8px;" wrap>
                      <NTag
                        v-for="limitation in licenseDetails.limitations"
                        :key="limitation"
                        type="error"
                        size="small"
                      >
                        {{ getLimitationLabel(limitation) }}
                      </NTag>
                    </NSpace>
                  </div>
                </NGi>
              </NGrid>
            </div>

            <!-- 许可证评级 -->
            <div class="license-rating">
              <NGrid :cols="2" :x-gap="16">
                <NGi>
                  <div class="rating-item">
                    <NText depth="3">流行度</NText>
                    <NProgress
                      type="line"
                      :percentage="(licenseDetails.popularity / 10) * 100"
                      :height="8"
                      :show-indicator="false"
                      color="var(--color-success)"
                    />
                    <NText>{{ licenseDetails.popularity }}/10</NText>
                  </div>
                </NGi>
                <NGi>
                  <div class="rating-item">
                    <NText depth="3">复杂度</NText>
                    <NProgress
                      type="line"
                      :percentage="(licenseDetails.complexity / 10) * 100"
                      :height="8"
                      :show-indicator="false"
                      :color="getComplexityColor(licenseDetails.complexity)"
                    />
                    <NText>{{ licenseDetails.complexity }}/10</NText>
                  </div>
                </NGi>
              </NGrid>
            </div>
          </NSpace>
        </div>

        <!-- 文件信息 -->
        <div class="file-info">
          <NSpace vertical size="small">
            <NText strong>文件信息</NText>
            <NSpace align="center" justify="space-between">
              <div>
                <NText>文件名：{{ license.name }}</NText>
                <NText depth="3" style="margin-left: 16px;">
                  大小：{{ formatFileSize(license.size) }}
                </NText>
              </div>
              <NSpace size="small">
                <NButton
                  tag="a"
                  :href="license.htmlUrl"
                  target="_blank"
                  size="small"
                  secondary
                >
                  <template #icon>
                    <NIcon><EyeOutline /></NIcon>
                  </template>
                  查看文件
                </NButton>
                <NButton
                  tag="a"
                  :href="license.downloadUrl"
                  target="_blank"
                  size="small"
                  type="primary"
                >
                  <template #icon>
                    <NIcon><DownloadOutline /></NIcon>
                  </template>
                  下载
                </NButton>
              </NSpace>
            </NSpace>
          </NSpace>
        </div>

        <!-- 相关链接 -->
        <NSpace>
          <NButton
            v-if="license.license.url"
            tag="a"
            :href="license.license.url"
            target="_blank"
            type="primary"
          >
            <template #icon>
              <NIcon><OpenOutline /></NIcon>
            </template>
            查看许可证详情
          </NButton>
          
          <NButton @click="$emit('compare-license', license.license.key)">
            <template #icon>
              <NIcon><GitCompareOutline /></NIcon>
            </template>
            对比其他许可证
          </NButton>
          
          <NButton @click="$emit('analyze-compatibility', license.license.key)">
            <template #icon>
              <NIcon><AnalyticsOutline /></NIcon>
            </template>
            兼容性分析
          </NButton>
        </NSpace>
      </NSpace>
    </div>

    <!-- 无许可证的情况 -->
    <div v-else>
      <NResult
        status="warning"
        title="未找到许可证"
        description="该仓库没有许可证文件，使用此代码可能存在法律风险"
      >
        <template #icon>
          <NIcon size="48" color="var(--color-warning)">
            <WarningOutline />
          </NIcon>
        </template>
        <template #footer>
          <NSpace>
            <NButton @click="$emit('suggest-license')" type="primary">
              <template #icon>
                <NIcon><BulbOutline /></NIcon>
              </template>
              推荐许可证
            </NButton>
            <NButton @click="$emit('learn-about-licenses')">
              <template #icon>
                <NIcon><SchoolOutline /></NIcon>
              </template>
              了解许可证
            </NButton>
          </NSpace>
        </template>
      </NResult>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard, NSpace, NIcon, NText, NH3, NTag, NP, NGrid, NGi,
  NProgress, NButton, NResult
} from 'naive-ui'
import {
  DocumentTextOutline, ShieldCheckmarkOutline, CheckmarkCircleOutline,
  InformationCircleOutline, CloseCircleOutline, EyeOutline,
  DownloadOutline, OpenOutline, GitCompareOutline, AnalyticsOutline,
  WarningOutline, BulbOutline, SchoolOutline
} from '@vicons/ionicons5'
import type { GitHubRepoLicense } from '@/types/github.types'
import { getLicenseById } from '@/data/licenses.data'

// Props
interface Props {
  license: GitHubRepoLicense | null
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'compare-license', licenseKey: string): void
  (e: 'analyze-compatibility', licenseKey: string): void
  (e: 'suggest-license'): void
  (e: 'learn-about-licenses'): void
}

defineEmits<Emits>()

// 计算属性
const licenseDetails = computed(() => {
  if (!props.license) return null
  return getLicenseById(props.license.license.key)
})

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  }
  return bytes + ' B'
}

const getComplexityColor = (complexity: number): string => {
  if (complexity <= 3) return 'var(--color-success)'
  if (complexity <= 6) return 'var(--color-warning)'
  return 'var(--color-error)'
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

const getLimitationLabel = (limitation: string): string => {
  const labels: Record<string, string> = {
    'liability': '责任限制',
    'warranty': '保证限制',
    'trademark-use': '商标限制'
  }
  return labels[limitation] || limitation
}
</script>

<style scoped>
/* 现代化许可证信息样式 - 深色主题 */
.license-header {
  padding: var(--spacing-6);
  background: var(--glass-background-strong);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-success-alpha-20);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  box-shadow: var(--shadow-glass);
  position: relative;
  overflow: hidden;
  transition: all var(--duration-300) var(--ease-out);
}

.license-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-success-alpha-10) 0%, var(--color-info-alpha-10) 100%);
  z-index: 0;
}

.license-header > * {
  position: relative;
  z-index: 1;
}

.license-header:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glass);
  border-color: var(--color-success-alpha-30);
}

.license-details {
  padding: var(--spacing-5);
  background: var(--color-background-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  transition: all var(--duration-200) var(--ease-out);
}

.license-details:hover {
  background: var(--color-background-tertiary);
  border-color: var(--color-border);
}

.feature-section {
  padding: var(--spacing-4);
  background: var(--color-background-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-200) var(--ease-out);
}

.feature-section:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-alpha-20);
  background: var(--color-background-secondary);
}

.license-rating {
  padding: var(--spacing-5);
  background: var(--glass-background-medium);
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  transition: all var(--duration-200) var(--ease-out);
}

.license-rating:hover {
  background: var(--glass-background-strong);
  border-color: var(--color-primary-alpha-20);
}

.rating-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.file-info {
  padding: var(--spacing-4) var(--spacing-5);
  background: var(--color-info-alpha-10);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-info);
  border: 1px solid var(--color-info-alpha-20);
  transition: all var(--duration-200) var(--ease-out);
}

.file-info:hover {
  background: var(--color-info-alpha-15);
  border-color: var(--color-info-alpha-30);
  transform: translateX(var(--spacing-1));
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-header .n-space {
    flex-direction: column;
    align-items: center !important;
  }

  .license-badge {
    margin-top: var(--spacing-4);
  }

  .license-header {
    padding: var(--spacing-4);
  }

  .license-details {
    padding: var(--spacing-4);
  }

  .feature-section {
    padding: var(--spacing-3);
  }

  .license-rating {
    padding: var(--spacing-4);
  }

  .file-info {
    padding: var(--spacing-3) var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .license-header {
    padding: var(--spacing-3);
  }

  .license-details {
    padding: var(--spacing-3);
  }

  .feature-section {
    padding: var(--spacing-2);
  }

  .license-rating {
    padding: var(--spacing-3);
  }

  .file-info {
    padding: var(--spacing-2) var(--spacing-3);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .license-header {
  background: var(--glass-background-strong);
  border-color: var(--color-success-alpha-20);
}

[data-theme="dark"] .license-details {
  background: var(--color-background-secondary);
  border-color: var(--color-border-light);
}

[data-theme="dark"] .feature-section {
  background: var(--color-background-primary);
  border-color: var(--color-border-light);
}

[data-theme="dark"] .license-rating {
  background: var(--glass-background-medium);
  border-color: var(--glass-border);
}

[data-theme="dark"] .file-info {
  background: var(--color-info-alpha-10);
  border-color: var(--color-info);
}
</style>
