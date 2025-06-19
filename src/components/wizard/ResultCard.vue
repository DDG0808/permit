<template>
  <div class="result-container">
    <!-- 主要推荐 -->
    <NCard class="primary-recommendation">
      <template #header>
        <NSpace align="center">
          <NIcon size="24" color="#18a058">
            <TrophyOutline />
          </NIcon>
          <NText strong style="font-size: 20px;">推荐许可证</NText>
        </NSpace>
      </template>

      <NSpace vertical size="large">
        <!-- 许可证信息 -->
        <div class="license-info">
          <NSpace align="center" size="large">
            <div class="license-badge">
              <NH2 style="margin: 0; color: #18a058;">
                {{ primaryLicense?.name }}
              </NH2>
              <NText depth="3">{{ primaryLicense?.fullName }}</NText>
            </div>
            <div class="score-badge">
              <NProgress
                type="circle"
                :percentage="scorePercentage"
                :stroke-width="8"
                style="width: 80px;"
              >
                <div style="text-align: center;">
                  <div style="font-size: 18px; font-weight: 600; color: #18a058;">
                    {{ result.recommendations.primary.score }}
                  </div>
                  <div style="font-size: 12px; color: #666;">分</div>
                </div>
              </NProgress>
            </div>
          </NSpace>
        </div>

        <!-- 许可证描述 -->
        <NP>{{ primaryLicense?.description }}</NP>

        <!-- 匹配说明 -->
        <NAlert type="success" :show-icon="false">
          <template #icon>
            <NIcon><CheckmarkCircleOutline /></NIcon>
          </template>
          {{ result.recommendations.primary.explanation }}
        </NAlert>

        <!-- 许可证特性 -->
        <div v-if="primaryLicense">
          <NText strong style="margin-bottom: 12px; display: block;">许可证特性：</NText>
          <NSpace size="small" style="margin-bottom: 16px;">
            <NTag type="success" v-for="permission in primaryLicense.permissions" :key="permission">
              {{ getPermissionLabel(permission) }}
            </NTag>
          </NSpace>
          
          <NText strong style="margin-bottom: 12px; display: block;">使用条件：</NText>
          <NSpace size="small" style="margin-bottom: 16px;">
            <NTag type="warning" v-for="condition in primaryLicense.conditions" :key="condition">
              {{ getConditionLabel(condition) }}
            </NTag>
          </NSpace>
          
          <NText strong style="margin-bottom: 12px; display: block;">限制条款：</NText>
          <NSpace size="small">
            <NTag type="error" v-for="limitation in primaryLicense.limitations" :key="limitation">
              {{ getLimitationLabel(limitation) }}
            </NTag>
          </NSpace>
        </div>

        <!-- 操作按钮 -->
        <NSpace>
          <NButton 
            type="primary"
            @click="$emit('download-license')"
          >
            <template #icon>
              <NIcon><DownloadOutline /></NIcon>
            </template>
            下载许可证文件
          </NButton>
          
          <NButton 
            v-if="primaryLicense?.url"
            tag="a"
            :href="primaryLicense.url"
            target="_blank"
            secondary
          >
            <template #icon>
              <NIcon><OpenOutline /></NIcon>
            </template>
            查看详细信息
          </NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 备选推荐 -->
    <NCard v-if="result.recommendations.alternatives.length > 0" title="其他选择">
      <NSpace vertical size="medium">
        <div
          v-for="alternative in result.recommendations.alternatives"
          :key="alternative.licenseId"
          class="alternative-item"
        >
          <NSpace justify="space-between" align="center">
            <div>
              <NText strong>{{ getLicenseById(alternative.licenseId)?.name }}</NText>
              <NText depth="3" style="margin-left: 8px;">
                {{ getLicenseById(alternative.licenseId)?.fullName }}
              </NText>
            </div>
            <NSpace align="center">
              <NText>{{ alternative.score }} 分</NText>
              <NButton size="small" quaternary @click="selectAlternative(alternative)">
                选择
              </NButton>
            </NSpace>
          </NSpace>
          <NP depth="3" style="margin: 8px 0 0 0; font-size: 14px;">
            {{ alternative.explanation }}
          </NP>
        </div>
      </NSpace>
    </NCard>

    <!-- 分析结果 -->
    <NCard title="分析结果">
      <NSpace vertical size="medium">
        <!-- 用户需求 -->
        <div v-if="result.analysis.userNeeds.length > 0">
          <NText strong>您的需求：</NText>
          <NList style="margin-top: 8px;">
            <NListItem v-for="(need, index) in result.analysis.userNeeds" :key="index">
              <NIcon color="#2080f0" style="margin-right: 8px;">
                <CheckmarkOutline />
              </NIcon>
              {{ need }}
            </NListItem>
          </NList>
        </div>

        <!-- 考虑因素 -->
        <div v-if="result.analysis.considerations.length > 0">
          <NText strong>需要考虑：</NText>
          <NList style="margin-top: 8px;">
            <NListItem v-for="(consideration, index) in result.analysis.considerations" :key="index">
              <NIcon color="#f0a020" style="margin-right: 8px;">
                <InformationCircleOutline />
              </NIcon>
              {{ consideration }}
            </NListItem>
          </NList>
        </div>

        <!-- 警告信息 -->
        <div v-if="result.analysis.warnings.length > 0">
          <NText strong>注意事项：</NText>
          <NList style="margin-top: 8px;">
            <NListItem v-for="(warning, index) in result.analysis.warnings" :key="index">
              <NIcon color="#d03050" style="margin-right: 8px;">
                <WarningOutline />
              </NIcon>
              {{ warning }}
            </NListItem>
          </NList>
        </div>
      </NSpace>
    </NCard>

    <!-- 操作区域 -->
    <NCard>
      <NSpace justify="space-between">
        <NButton @click="$emit('restart')">
          <template #icon>
            <NIcon><RefreshOutline /></NIcon>
          </template>
          重新开始
        </NButton>
        
        <NSpace>
          <NButton @click="$emit('compare')">
            <template #icon>
              <NIcon><GitCompareOutline /></NIcon>
            </template>
            对比许可证
          </NButton>
          
          <NButton type="primary" @click="$emit('confirm')">
            <template #icon>
              <NIcon><CheckmarkOutline /></NIcon>
            </template>
            确认选择
          </NButton>
        </NSpace>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard, NSpace, NIcon, NText, NH2, NP, NProgress, NAlert, NTag,
  NButton, NList, NListItem
} from 'naive-ui'
import {
  TrophyOutline, CheckmarkCircleOutline, DownloadOutline, OpenOutline,
  CheckmarkOutline, InformationCircleOutline, WarningOutline,
  RefreshOutline, GitCompareOutline
} from '@vicons/ionicons5'
import type { WizardResult, LicenseScore } from '@/types/wizard.types'
import { getLicenseById } from '@/data/licenses.data'

// Props
interface Props {
  result: WizardResult
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'download-license'): void
  (e: 'restart'): void
  (e: 'compare'): void
  (e: 'confirm'): void
  (e: 'select-alternative', alternative: LicenseScore): void
}

const emit = defineEmits<Emits>()

// 计算属性
const primaryLicense = computed(() => {
  return getLicenseById(props.result.recommendations.primary.licenseId)
})

const scorePercentage = computed(() => {
  const maxScore = 60 // 假设最高分为60分
  return Math.min((props.result.recommendations.primary.score / maxScore) * 100, 100)
})

// 方法
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

const selectAlternative = (alternative: LicenseScore) => {
  emit('select-alternative', alternative)
}
</script>

<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.primary-recommendation {
  border: 2px solid #18a058;
}

.license-info {
  padding: 20px;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
  border-radius: 8px;
}

.license-badge {
  flex: 1;
}

.score-badge {
  display: flex;
  align-items: center;
}

.alternative-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.alternative-item:hover {
  border-color: #2080f0;
  box-shadow: 0 2px 8px rgba(32, 128, 240, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .license-info .n-space {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .score-badge {
    align-self: center;
  }
}
</style>
