# Modern UI Components

基于Apple Design Award设计趋势的现代化Vue组件库，为开源许可证助手项目提供一致的现代化UI元素。

## 🎨 设计理念

- **Apple风格设计**：遵循Apple Design Award的设计标准
- **玻璃拟态效果**：现代化的毛玻璃背景和透明度效果
- **流畅动画**：60fps的流畅交互动画和微交互
- **响应式设计**：完美适配各种设备和屏幕尺寸
- **深色模式支持**：原生支持浅色和深色主题切换
- **无障碍访问**：符合WCAG 2.1标准的可访问性设计

## 📦 组件列表

### ModernButton
现代化按钮组件，支持多种变体和交互效果。

**特性：**
- 5种变体：primary、secondary、success、warning、error
- 3种尺寸：small、medium、large
- 涟漪点击效果
- 加载状态支持
- 图标支持
- 幽灵按钮模式

**使用示例：**
```vue
<template>
  <ModernButton variant="primary" size="large" :loading="isLoading" @click="handleClick">
    点击我
  </ModernButton>
</template>
```

### ModernCard
现代化卡片组件，提供玻璃拟态效果和多种布局选项。

**特性：**
- 玻璃拟态背景效果
- 可悬浮和点击交互
- 装饰性背景元素
- 头部、内容、底部插槽
- 加载状态支持

**使用示例：**
```vue
<template>
  <ModernCard title="卡片标题" hoverable glass>
    <template #extra>
      <ModernButton size="small">操作</ModernButton>
    </template>
    
    <p>这是卡片内容</p>
    
    <template #footer>
      <div>底部内容</div>
    </template>
  </ModernCard>
</template>
```

### GlassPanel
专用的玻璃拟态面板组件，提供高度可定制的毛玻璃效果。

**特性：**
- 可调节的模糊强度
- 多种变体和强度级别
- 装饰性浮动元素
- 发光边框效果
- 自定义尺寸和内边距

**使用示例：**
```vue
<template>
  <GlassPanel 
    variant="primary" 
    intensity="heavy" 
    decorative 
    glowing
    :width="400"
    :height="300"
  >
    <h3>玻璃面板</h3>
    <p>这是一个现代化的玻璃拟态面板</p>
  </GlassPanel>
</template>
```

### ModernInput
现代化输入框组件，提供丰富的交互效果和验证支持。

**特性：**
- 焦点指示器动画
- 前缀和后缀图标支持
- 清除按钮
- 密码显示切换
- 字符计数
- 错误状态显示
- 帮助文本支持

**使用示例：**
```vue
<template>
  <ModernInput
    v-model="inputValue"
    label="用户名"
    placeholder="请输入用户名"
    help-text="用户名长度为3-20个字符"
    :maxlength="20"
    clearable
    show-count
    required
  />
</template>
```

## 🚀 快速开始

### 安装

组件库已集成在项目中，无需额外安装。

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { ModernUI } from '@/components/modern'

const app = createApp(App)

// 注册所有现代化组件
app.use(ModernUI)

app.mount('#app')
```

### 按需导入

```vue
<script setup lang="ts">
import { ModernButton, ModernCard } from '@/components/modern'
</script>

<template>
  <ModernCard title="示例">
    <ModernButton variant="primary">按钮</ModernButton>
  </ModernCard>
</template>
```

## 🎯 TypeScript支持

组件库提供完整的TypeScript类型定义：

```typescript
import type { 
  ModernButtonProps, 
  ModernCardProps,
  ComponentSize,
  ComponentVariant 
} from '@/components/modern'

// 使用类型
const buttonProps: ModernButtonProps = {
  variant: 'primary',
  size: 'large',
  loading: false
}
```

## 🎨 主题定制

组件库使用CSS自定义属性，可以轻松定制主题：

```css
:root {
  /* 主色调 */
  --color-primary: #007AFF;
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-error: #FF3B30;
  
  /* 玻璃效果 */
  --glass-background: rgba(255, 255, 255, 0.8);
  --glass-backdrop-filter: blur(10px);
  --glass-border: rgba(255, 255, 255, 0.2);
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
}
```

## 📱 响应式设计

组件库支持响应式设计，使用标准断点：

- `xs`: 0px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## ♿ 无障碍访问

所有组件都遵循WCAG 2.1标准：

- 键盘导航支持
- 屏幕阅读器友好
- 高对比度模式支持
- 焦点指示器
- 语义化HTML结构

## 🔧 开发指南

### 添加新组件

1. 在`src/components/modern/`目录下创建新组件文件
2. 在`src/types/modern.types.ts`中添加类型定义
3. 在`src/components/modern/index.ts`中导出新组件
4. 更新README文档

### 组件命名规范

- 组件文件：`ModernComponentName.vue`
- 类型定义：`ModernComponentNameProps`、`ModernComponentNameEmits`
- CSS类名：`modern-component-name`

### 样式规范

- 使用CSS自定义属性
- 遵循BEM命名规范
- 支持深色模式
- 响应式设计
- 动画性能优化

## 📄 许可证

本组件库遵循项目的MIT许可证。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进组件库。

---

**注意：** 本组件库专为开源许可证助手项目设计，与项目的设计系统紧密集成。
