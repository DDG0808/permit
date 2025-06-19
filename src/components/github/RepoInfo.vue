<template>
  <NCard>
    <template #header>
      <NSpace align="center">
        <NIcon size="20" color="var(--color-info)">
          <InformationCircleOutline />
        </NIcon>
        <NText strong>仓库信息</NText>
      </NSpace>
    </template>

    <template #header-extra>
      <NSpace size="small">
        <NTag v-if="repo.isPrivate" type="warning" size="small">
          <template #icon>
            <NIcon><LockClosedOutline /></NIcon>
          </template>
          私有
        </NTag>
        <NTag v-if="repo.isFork" type="info" size="small">
          <template #icon>
            <NIcon><GitBranchOutline /></NIcon>
          </template>
          Fork
        </NTag>
      </NSpace>
    </template>

    <NSpace vertical size="large">
      <!-- 仓库头部信息 -->
      <div class="repo-header">
        <NSpace align="center" size="medium">
          <NAvatar
            :src="repo.owner.avatarUrl"
            :size="48"
            :fallback-src="getDefaultAvatar(repo.owner.type)"
          />
          <div class="repo-title">
            <NH3 style="margin: 0;">
              <NButton
                text
                tag="a"
                :href="repo.htmlUrl"
                target="_blank"
                style="font-size: 20px; font-weight: 600; padding: 0;"
              >
                {{ repo.fullName }}
                <template #icon>
                  <NIcon style="margin-left: 6px;"><OpenOutline /></NIcon>
                </template>
              </NButton>
            </NH3>
            <NSpace align="center" size="small" style="margin-top: 4px;">
              <NText depth="3">{{ repo.owner.login }}</NText>
              <NTag size="tiny" :type="repo.owner.type === 'Organization' ? 'info' : 'default'">
                {{ repo.owner.type === 'Organization' ? '组织' : '个人' }}
              </NTag>
            </NSpace>
          </div>
        </NSpace>
      </div>

      <!-- 仓库描述 -->
      <div v-if="repo.description" class="repo-description">
        <NP>{{ repo.description }}</NP>
      </div>

      <!-- 仓库统计信息 -->
      <div class="repo-stats">
        <NGrid :cols="2" :x-gap="16" :y-gap="12" responsive="screen">
          <NGi>
            <div class="stat-item">
              <NIcon size="16" color="var(--color-warning)">
                <StarOutline />
              </NIcon>
              <NText strong>{{ formatNumber(repo.stargazersCount) }}</NText>
              <NText depth="3">Stars</NText>
            </div>
          </NGi>
          <NGi>
            <div class="stat-item">
              <NIcon size="16" color="var(--color-info)">
                <GitBranchOutline />
              </NIcon>
              <NText strong>{{ formatNumber(repo.forksCount) }}</NText>
              <NText depth="3">Forks</NText>
            </div>
          </NGi>
          <NGi>
            <div class="stat-item">
              <NIcon size="16" color="var(--color-success)">
                <CodeOutline />
              </NIcon>
              <NText strong>{{ repo.language || '未知' }}</NText>
              <NText depth="3">主要语言</NText>
            </div>
          </NGi>
          <NGi>
            <div class="stat-item">
              <NIcon size="16" color="var(--color-text-secondary)">
                <ArchiveOutline />
              </NIcon>
              <NText strong>{{ formatSize(repo.size) }}</NText>
              <NText depth="3">大小</NText>
            </div>
          </NGi>
        </NGrid>
      </div>

      <!-- 时间信息 -->
      <div class="repo-timeline">
        <NSpace vertical size="small">
          <div class="timeline-item">
            <NIcon size="14" color="var(--color-text-secondary)">
              <CalendarOutline />
            </NIcon>
            <NText depth="3">创建于：{{ formatDate(repo.createdAt) }}</NText>
          </div>
          <div class="timeline-item">
            <NIcon size="14" color="var(--color-text-secondary)">
              <RefreshOutline />
            </NIcon>
            <NText depth="3">更新于：{{ formatDate(repo.updatedAt) }}</NText>
          </div>
          <div v-if="repo.pushedAt" class="timeline-item">
            <NIcon size="14" color="var(--color-text-secondary)">
              <CloudUploadOutline />
            </NIcon>
            <NText depth="3">推送于：{{ formatDate(repo.pushedAt) }}</NText>
          </div>
        </NSpace>
      </div>

      <!-- 操作按钮 -->
      <NSpace>
        <NButton
          tag="a"
          :href="repo.htmlUrl"
          target="_blank"
          type="primary"
        >
          <template #icon>
            <NIcon><LogoGithub /></NIcon>
          </template>
          访问仓库
        </NButton>
        
        <NButton
          v-if="repo.htmlUrl"
          tag="a"
          :href="`${repo.htmlUrl}/issues`"
          target="_blank"
          secondary
        >
          <template #icon>
            <NIcon><BugOutline /></NIcon>
          </template>
          Issues
        </NButton>
        
        <NButton
          v-if="repo.htmlUrl"
          tag="a"
          :href="`${repo.htmlUrl}/pulls`"
          target="_blank"
          secondary
        >
          <template #icon>
            <NIcon><GitPullRequestOutline /></NIcon>
          </template>
          Pull Requests
        </NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import {
  NCard, NSpace, NIcon, NText, NH3, NTag, NAvatar, NButton, NP,
  NGrid, NGi
} from 'naive-ui'
import {
  InformationCircleOutline, LockClosedOutline, GitBranchOutline,
  OpenOutline, StarOutline, CodeOutline, ArchiveOutline,
  CalendarOutline, RefreshOutline, CloudUploadOutline,
  LogoGithub, BugOutline, GitPullRequestOutline
} from '@vicons/ionicons5'
import type { GitHubRepo } from '@/types/github.types'

// Props
interface Props {
  repo: GitHubRepo
}

defineProps<Props>()

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatSize = (sizeKB: number): string => {
  if (sizeKB >= 1024 * 1024) {
    return (sizeKB / (1024 * 1024)).toFixed(1) + ' GB'
  } else if (sizeKB >= 1024) {
    return (sizeKB / 1024).toFixed(1) + ' MB'
  }
  return sizeKB + ' KB'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDefaultAvatar = (type: string): string => {
  return type === 'Organization' 
    ? 'https://github.com/identicons/organization.png'
    : 'https://github.com/identicons/user.png'
}
</script>

<style scoped>
/* 现代化仓库信息样式 - 深色主题 */
.repo-header {
  padding: var(--spacing-6);
  background: var(--glass-background-strong);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-300) var(--ease-out);
}

.repo-header:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glass);
  border-color: var(--color-primary-alpha-20);
}

.repo-title {
  flex: 1;
}

.repo-description {
  padding: var(--spacing-4) var(--spacing-5);
  background: var(--color-info-alpha-10);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-info);
  border: 1px solid var(--color-info-alpha-20);
  transition: all var(--duration-200) var(--ease-out);
}

.repo-description:hover {
  background: var(--color-info-alpha-15);
  border-color: var(--color-info-alpha-30);
}

.repo-stats {
  padding: var(--spacing-5);
  background: var(--glass-background-medium);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-backdrop-filter);
  -webkit-backdrop-filter: var(--glass-backdrop-filter);
  transition: all var(--duration-300) var(--ease-out);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-200) var(--ease-out);
}

.stat-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-alpha-20);
  background: var(--color-background-tertiary);
}

.repo-timeline {
  padding: var(--spacing-4) var(--spacing-5);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  transition: all var(--duration-200) var(--ease-out);
}

.repo-timeline:hover {
  background: var(--color-background-tertiary);
  border-color: var(--color-border);
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) 0;
  transition: all var(--duration-200) var(--ease-out);
}

.timeline-item:hover {
  transform: translateX(var(--spacing-1));
  color: var(--color-text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .repo-header .n-space {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .repo-title {
    text-align: center;
    width: 100%;
  }

  .repo-header {
    padding: var(--spacing-4);
  }

  .repo-stats {
    padding: var(--spacing-4);
  }

  .repo-timeline {
    padding: var(--spacing-3) var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .repo-header {
    padding: var(--spacing-3);
  }

  .repo-stats {
    padding: var(--spacing-3);
  }

  .stat-item {
    padding: var(--spacing-2);
    gap: var(--spacing-1);
  }
}

/* 深色模式优化 */
[data-theme="dark"] .repo-header {
  background: var(--glass-background-strong);
  border-color: var(--glass-border);
}

[data-theme="dark"] .repo-description {
  background: var(--color-info-alpha-10);
  border-color: var(--color-info);
}

[data-theme="dark"] .repo-stats {
  background: var(--glass-background-medium);
  border-color: var(--glass-border);
}

[data-theme="dark"] .stat-item {
  background: var(--color-background-secondary);
  border-color: var(--color-border-light);
}

[data-theme="dark"] .repo-timeline {
  background: var(--color-background-secondary);
  border-color: var(--color-border-light);
}
</style>
