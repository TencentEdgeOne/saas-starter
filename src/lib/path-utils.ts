import path from 'path'

/**
 * 获取项目根目录的路径
 * 在 SSR 环境中，process.cwd() 可能指向构建目录而不是项目根目录
 */
export function getProjectRoot(): string {
  // 方法1: 尝试从环境变量获取
  if (process.env.PROJECT_ROOT) {
    return process.env.PROJECT_ROOT
  }
  
  // 方法2: 尝试从 process.cwd() 开始，向上查找 package.json
  let currentDir = process.cwd()
  const maxDepth = 10 // 防止无限循环
  let depth = 0
  
  while (depth < maxDepth) {
    try {
      const packageJsonPath = path.join(currentDir, 'package.json')
      const fs = require('fs')
      if (fs.existsSync(packageJsonPath)) {
        return currentDir
      }
    } catch (error) {
      // 忽略错误，继续向上查找
    }
    
    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) {
      // 已经到达根目录
      break
    }
    currentDir = parentDir
    depth++
  }
  
  // 方法3: 回退到 process.cwd()
  return process.cwd()
}

/**
 * 获取内容目录的路径
 */
export function getContentDirectory(lang: string = 'en', type: 'blog' | 'cases' = 'blog'): string {
  const projectRoot = getProjectRoot()
  return path.join(projectRoot, 'content', lang, type)
}
