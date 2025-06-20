/**
 * 许可证生成服务测试工具
 * 用于在浏览器控制台中测试服务功能
 */

import { 
  generateLicenseFile, 
  validateLicenseParams,
  previewLicenseContent,
  getSupportedFormats,
  getMimeTypeFromFilename,
  downloadLicenseFile
} from '@/services/license-generator.service'

// 导出到全局对象以便在控制台中使用
declare global {
  interface Window {
    testLicenseGenerator: typeof testLicenseGenerator
  }
}

export function testLicenseGenerator() {
  console.log('🧪 开始测试许可证生成服务...')

  try {
    // 测试1: 生成MIT许可证
    console.log('\n📝 测试1: 生成MIT许可证')
    const mitParams = {
      licenseId: 'mit',
      year: '2024',
      fullname: 'Test User',
      project: 'Test Project'
    }
    const mitResult = generateLicenseFile(mitParams)
    console.log('✅ MIT许可证生成成功')
    console.log('文件名:', mitResult.filename)
    console.log('内容预览:', mitResult.content.substring(0, 100) + '...')

    // 测试2: 生成Apache 2.0许可证
    console.log('\n📝 测试2: 生成Apache 2.0许可证')
    const apacheParams = {
      licenseId: 'apache-2.0',
      year: '2024',
      fullname: 'Test User'
    }
    const apacheResult = generateLicenseFile(apacheParams)
    console.log('✅ Apache 2.0许可证生成成功')
    console.log('文件名:', apacheResult.filename)

    // 测试3: 验证参数
    console.log('\n📝 测试3: 验证参数')
    const validParams = validateLicenseParams(mitParams)
    console.log('✅ 有效参数验证:', validParams.isValid)

    const invalidParams = validateLicenseParams({ licenseId: '' })
    console.log('✅ 无效参数验证:', invalidParams.isValid, '错误:', invalidParams.errors)

    // 测试4: 预览内容
    console.log('\n📝 测试4: 预览内容')
    const preview = previewLicenseContent(mitParams)
    console.log('✅ 内容预览成功，长度:', preview.length)

    // 测试5: 获取支持的格式
    console.log('\n📝 测试5: 获取支持的格式')
    const formats = getSupportedFormats()
    console.log('✅ 支持的格式:', formats)

    // 测试6: MIME类型检测
    console.log('\n📝 测试6: MIME类型检测')
    console.log('LICENSE:', getMimeTypeFromFilename('LICENSE'))
    console.log('LICENSE.txt:', getMimeTypeFromFilename('LICENSE.txt'))
    console.log('LICENSE.md:', getMimeTypeFromFilename('LICENSE.md'))

    console.log('\n🎉 所有测试通过！')

    // 提供下载测试函数
    ;(window as any).testDownload = () => {
      console.log('🔽 测试下载功能...')
      downloadLicenseFile(
        mitParams,
        (filename) => console.log('✅ 下载成功:', filename),
        (error) => console.error('❌ 下载失败:', error)
      )
    }

    console.log('\n💡 提示: 在控制台中运行 testDownload() 来测试下载功能')

  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

// 自动运行测试（如果在开发环境）
if (import.meta.env.DEV) {
  // 延迟执行以确保模块加载完成
  setTimeout(() => {
    ;(window as any).testLicenseGenerator = testLicenseGenerator
    console.log('🔧 许可证生成服务测试工具已加载')
    console.log('💡 在控制台中运行 testLicenseGenerator() 来测试服务')
  }, 1000)
}
