# 🚀 开源许可证选择助手

<div align="center">

![License Helper](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5+-4FC08D.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg)

一个智能化的开源许可证选择工具，帮助开发者快速找到最适合的许可证

[在线体验](https://permit.orm.li/) | [功能介绍](#功能特性) | [快速开始](#快速开始) | [贡献指南](#贡献指南)

</div>

## 📖 项目简介

开源许可证选择助手是一个基于 Vue 3 + TypeScript 的现代化 Web 应用，旨在帮助开发者更好地理解和选择合适的开源许可证。通过智能问答、GitHub 仓库分析和全面的知识库，让许可证选择变得简单高效。

## ✨ 功能特性

### 🧙‍♂️ 许可证选择向导
- **智能问答引导**：通过6个核心问题了解项目需求
- **个性化推荐**：基于回答提供定制化许可证建议
- **详细解释**：每个推荐都包含选择理由和使用场景

### 🔍 GitHub 仓库分析
- **一键分析**：输入仓库 URL 即可获取详细信息
- **许可证检测**：自动识别现有许可证和潜在问题
- **兼容性检查**：分析依赖项许可证兼容性
- **可视化报告**：清晰展示分析结果

### 📚 许可证知识库
- **全面覆盖**：涵盖8+主流开源许可证
- **对比分析**：直观的许可证特性对比表
- **深度学习**：详细的许可证条款解读
- **实用指南**：许可证应用的最佳实践

### 🎨 用户体验
- **现代化设计**：基于 Naive UI 的精美界面
- **响应式布局**：完美适配桌面端和移动端
- **深色模式**：支持明暗主题切换
- **无障碍访问**：遵循 WCAG 无障碍标准

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: 最新版本

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd open-source-license-helper
```

2. **安装依赖**
```bash
npm install
# 或者使用 yarn
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或者使用 yarn
yarn dev
```

4. **打开浏览器**
```
访问 http://localhost:5173
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run type-check
```

## 📁 项目结构

```
open-source-license-helper/
├── public/                     # 静态资源
│   └── favicon.ico
├── src/
│   ├── assets/                 # 资源文件
│   │   ├── base.css           # 基础样式
│   │   ├── main.css           # 主样式
│   │   └── logo.svg           # Logo
│   ├── components/            # 组件目录
│   │   ├── common/            # 通用组件
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── PageHeader.vue
│   │   │   └── ThemeToggle.vue
│   │   ├── github/            # GitHub 相关组件
│   │   │   ├── LicenseDisplay.vue
│   │   │   ├── RepoInfo.vue
│   │   │   └── UrlInput.vue
│   │   ├── knowledge/         # 知识库组件
│   │   │   ├── ComparisonTable.vue
│   │   │   ├── FeatureMatrix.vue
│   │   │   ├── LicenseCard.vue
│   │   │   └── LicenseDetails.vue
│   │   └── wizard/            # 向导组件
│   │       ├── ProgressBar.vue
│   │       ├── QuestionCard.vue
│   │       └── ResultCard.vue
│   ├── composables/           # 组合式 API
│   │   ├── useGitHub.ts       # GitHub API 逻辑
│   │   └── useWizard.ts       # 向导逻辑
│   ├── data/                  # 数据文件
│   │   ├── licenses.data.ts   # 许可证数据
│   │   └── questions.data.ts  # 问答数据
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── services/              # 服务层
│   │   └── github.service.ts  # GitHub API 服务
│   ├── styles/                # 样式文件
│   │   ├── main.css
│   │   ├── responsive.css
│   │   └── variables.css
│   ├── types/                 # 类型定义
│   │   ├── github.types.ts
│   │   ├── license.types.ts
│   │   └── wizard.types.ts
│   ├── utils/                 # 工具函数
│   │   ├── performance.utils.ts
│   │   └── url-parser.util.ts
│   ├── views/                 # 页面组件
│   │   ├── AnalyzerView.vue   # GitHub 分析页
│   │   ├── HomeView.vue       # 首页
│   │   ├── KnowledgeView.vue  # 知识库页
│   │   └── WizardView.vue     # 向导页
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── tests/                     # 测试文件
├── package.json               # 项目配置
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 项目说明
```

## 🛠️ 技术栈

### 前端框架
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vue Router 4**: 官方路由管理器

### 构建工具
- **Vite**: 下一代前端构建工具
- **vue-tsc**: Vue 3 TypeScript 支持

### UI 框架
- **Naive UI**: 现代化的 Vue 3 组件库
- **@vicons/ionicons5**: 精美的图标库

### 开发工具
- **Vue DevTools**: Vue 开发调试工具
- **npm-run-all2**: 并行执行 npm 脚本

### 网络请求
- **Axios**: 基于 Promise 的 HTTP 客户端

## 🔧 开发指南

### 代码规范

项目采用以下代码规范：
- **组件命名**: PascalCase (如: `LicenseCard.vue`)
- **文件命名**: kebab-case (如: `license-card.vue`)
- **函数命名**: camelCase (如: `getLicenseInfo`)
- **常量命名**: UPPER_SNAKE_CASE (如: `API_BASE_URL`)

### 提交规范

使用 [Conventional Commits](https://conventionalcommits.org/) 规范：
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

### 目录约定

- `components/`: 可复用组件
- `views/`: 页面级组件
- `composables/`: 组合式 API 逻辑
- `services/`: API 服务层
- `types/`: TypeScript 类型定义
- `utils/`: 工具函数
- `data/`: 静态数据文件

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. **Fork 项目**
2. **创建特性分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'feat: add amazing feature'`)
4. **推送分支** (`git push origin feature/amazing-feature`)
5. **创建 Pull Request**

### 开发环境设置

```bash
# 1. Fork 并克隆项目
git clone <your-fork-url>
cd open-source-license-helper

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 运行测试
npm run test

# 5. 类型检查
npm run type-check
```

## 📝 许可证信息

本项目采用 [MIT 许可证](LICENSE) 开源。

```
MIT License

Copyright (c) 2024 开源许可证助手

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 联系方式

- 项目地址: [GitHub Repository](#)
- 问题反馈: [GitHub Issues](#)
- 邮箱: [your-email@example.com](#)

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Naive UI](https://www.naiveui.com/) - 现代化组件库
- [Vite](https://vitejs.dev/) - 下一代构建工具
- [Choose a License](https://choosealicense.com/) - 许可证选择指南
- [Open Source Initiative](https://opensource.org/) - 开源倡议组织

---

<div align="center">
  <strong>🌟 如果这个项目对您有帮助，请给我们一个 Star！</strong>
</div>
