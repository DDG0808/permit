import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright配置文件
 * 为开源许可证助手项目提供全面的端到端测试配置
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',
  
  // 全局设置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // 报告配置
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  // 全局测试配置
  use: {
    // 基础URL
    baseURL: 'http://localhost:5173',
    
    // 浏览器配置
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // 截图和视频
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // 等待配置
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // 其他配置
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    colorScheme: 'light'
  },

  // 项目配置 - 多浏览器测试
  projects: [
    // 桌面浏览器
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // 移动设备
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // 平板设备
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 }
      },
    },

    // 高分辨率屏幕
    {
      name: 'Desktop 4K',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2
      },
    },

    // 深色模式测试
    {
      name: 'Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        viewport: { width: 1280, height: 720 }
      },
    },

    // 减少动画模式
    {
      name: 'Reduced Motion',
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
        viewport: { width: 1280, height: 720 }
      },
    },

    // 高对比度模式
    {
      name: 'High Contrast',
      use: {
        ...devices['Desktop Chrome'],
        forcedColors: 'active',
        viewport: { width: 1280, height: 720 }
      },
    }
  ],

  // 开发服务器配置
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // 输出目录
  outputDir: 'test-results',
  
  // 全局设置
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  // 测试超时
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
    toHaveScreenshot: {
      mode: 'strict',
      threshold: 0.2,
      maxDiffPixels: 100
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 100
    }
  },

  // 测试匹配模式
  testMatch: [
    '**/tests/e2e/**/*.spec.ts',
    '**/tests/e2e/**/*.test.ts'
  ],

  // 忽略文件
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ]
})
