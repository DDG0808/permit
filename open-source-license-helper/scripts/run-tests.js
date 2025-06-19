#!/usr/bin/env node

/**
 * 测试运行脚本
 * 提供便捷的测试执行和报告生成功能
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan')
  log(`  ${message}`, 'bright')
  log('='.repeat(60), 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// 测试配置
const testConfigs = {
  smoke: {
    name: '冒烟测试',
    command: 'npx playwright test --grep @smoke',
    description: '快速验证核心功能是否正常'
  },
  unit: {
    name: '单元测试',
    command: 'npm run test',
    description: '运行所有单元测试'
  },
  e2e: {
    name: '端到端测试',
    command: 'npx playwright test',
    description: '运行所有端到端测试'
  },
  visual: {
    name: '视觉回归测试',
    command: 'npx playwright test --grep @visual',
    description: '检查UI视觉变化'
  },
  accessibility: {
    name: '无障碍访问测试',
    command: 'npx playwright test --grep @accessibility',
    description: '验证无障碍访问标准'
  },
  performance: {
    name: '性能测试',
    command: 'npx playwright test --grep @performance',
    description: '检查应用性能指标'
  },
  responsive: {
    name: '响应式测试',
    command: 'npx playwright test --grep @responsive',
    description: '验证响应式设计'
  },
  'cross-browser': {
    name: '跨浏览器测试',
    command: 'npx playwright test --grep @cross-browser',
    description: '在多个浏览器中测试'
  },
  integration: {
    name: '集成测试',
    command: 'npx playwright test --grep @integration',
    description: '测试完整用户流程'
  },
  all: {
    name: '完整测试套件',
    command: 'npm run test:all',
    description: '运行所有测试'
  }
}

// 浏览器配置
const browsers = {
  chromium: 'Chromium (Chrome)',
  firefox: 'Firefox',
  webkit: 'WebKit (Safari)',
  'mobile-chrome': 'Mobile Chrome',
  'mobile-safari': 'Mobile Safari'
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    testType: 'smoke',
    browser: 'chromium',
    headed: false,
    debug: false,
    ui: false,
    report: false,
    parallel: true,
    retries: 2,
    timeout: 30000,
    help: false
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '--type':
      case '-t':
        if (nextArg && testConfigs[nextArg]) {
          options.testType = nextArg
          i++
        }
        break
      case '--browser':
      case '-b':
        if (nextArg && browsers[nextArg]) {
          options.browser = nextArg
          i++
        }
        break
      case '--headed':
        options.headed = true
        break
      case '--debug':
        options.debug = true
        break
      case '--ui':
        options.ui = true
        break
      case '--report':
        options.report = true
        break
      case '--no-parallel':
        options.parallel = false
        break
      case '--retries':
        if (nextArg && !isNaN(nextArg)) {
          options.retries = parseInt(nextArg)
          i++
        }
        break
      case '--timeout':
        if (nextArg && !isNaN(nextArg)) {
          options.timeout = parseInt(nextArg)
          i++
        }
        break
      case '--help':
      case '-h':
        options.help = true
        break
    }
  }

  return options
}

// 显示帮助信息
function showHelp() {
  logHeader('测试运行脚本帮助')
  
  log('\n使用方法:', 'bright')
  log('  node scripts/run-tests.js [选项]')
  
  log('\n测试类型:', 'bright')
  Object.entries(testConfigs).forEach(([key, config]) => {
    log(`  ${key.padEnd(15)} - ${config.description}`)
  })
  
  log('\n浏览器选项:', 'bright')
  Object.entries(browsers).forEach(([key, name]) => {
    log(`  ${key.padEnd(15)} - ${name}`)
  })
  
  log('\n选项:', 'bright')
  log('  -t, --type <type>     测试类型 (默认: smoke)')
  log('  -b, --browser <name>  浏览器 (默认: chromium)')
  log('  --headed              显示浏览器窗口')
  log('  --debug               调试模式')
  log('  --ui                  使用UI模式')
  log('  --report              生成测试报告')
  log('  --no-parallel         禁用并行执行')
  log('  --retries <num>       重试次数 (默认: 2)')
  log('  --timeout <ms>        超时时间 (默认: 30000)')
  log('  -h, --help            显示帮助信息')
  
  log('\n示例:', 'bright')
  log('  node scripts/run-tests.js --type smoke --headed')
  log('  node scripts/run-tests.js --type e2e --browser firefox')
  log('  node scripts/run-tests.js --type visual --ui')
}

// 检查环境
function checkEnvironment() {
  logInfo('检查测试环境...')
  
  // 检查Node.js版本
  const nodeVersion = process.version
  logInfo(`Node.js版本: ${nodeVersion}`)
  
  // 检查依赖
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const hasPlaywright = packageJson.devDependencies && packageJson.devDependencies['@playwright/test']
  
  if (!hasPlaywright) {
    logError('未找到Playwright依赖，请运行: npm install')
    process.exit(1)
  }
  
  // 检查测试目录
  if (!fs.existsSync('tests/e2e')) {
    logError('未找到测试目录: tests/e2e')
    process.exit(1)
  }
  
  logSuccess('环境检查通过')
}

// 运行测试
function runTests(options) {
  const config = testConfigs[options.testType]
  
  logHeader(`运行${config.name}`)
  logInfo(`描述: ${config.description}`)
  logInfo(`浏览器: ${browsers[options.browser]}`)
  
  // 构建命令
  let command = config.command
  
  // 添加浏览器选项
  if (options.browser !== 'chromium') {
    command += ` --project="${options.browser}"`
  }
  
  // 添加其他选项
  if (options.headed) {
    command += ' --headed'
  }
  
  if (options.debug) {
    command += ' --debug'
  }
  
  if (options.ui) {
    command += ' --ui'
  }
  
  if (!options.parallel) {
    command += ' --workers=1'
  }
  
  if (options.retries !== 2) {
    command += ` --retries=${options.retries}`
  }
  
  if (options.timeout !== 30000) {
    command += ` --timeout=${options.timeout}`
  }
  
  logInfo(`执行命令: ${command}`)
  
  try {
    const startTime = Date.now()
    
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    const duration = Date.now() - startTime
    const durationMinutes = Math.round(duration / 1000 / 60 * 100) / 100
    
    logSuccess(`测试完成，耗时: ${durationMinutes} 分钟`)
    
    // 生成报告
    if (options.report) {
      generateReport()
    }
    
  } catch (error) {
    logError(`测试失败: ${error.message}`)
    process.exit(1)
  }
}

// 生成测试报告
function generateReport() {
  logInfo('生成测试报告...')
  
  try {
    // 打开HTML报告
    execSync('npx playwright show-report', { stdio: 'inherit' })
    logSuccess('测试报告已生成')
  } catch (error) {
    logWarning('无法打开测试报告')
  }
}

// 主函数
function main() {
  const options = parseArgs()
  
  if (options.help) {
    showHelp()
    return
  }
  
  logHeader('开源许可证助手 - 自动化测试')
  
  checkEnvironment()
  runTests(options)
}

// 运行脚本
if (require.main === module) {
  main()
}

module.exports = {
  testConfigs,
  browsers,
  runTests,
  generateReport
}
