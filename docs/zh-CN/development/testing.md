---
title: 测试指南
---

# 测试指南

TKP 采用 **测试驱动开发（TDD）** 方法，要求所有新功能必须先编写测试，确保代码质量和可维护性。本文档详细介绍测试策略、编写规范和最佳实践。

## 📋 目录

- [测试框架](#测试框架)
- [测试命令](#测试命令)
- [测试结构](#测试结构)
- [编写测试](#编写测试)
- [Mock 和 Fixtures](#mock-和-fixtures)
- [覆盖率要求](#覆盖率要求)
- [最佳实践](#最佳实践)

## 测试框架

### 技术栈

- **测试框架**: Vitest（Vite 的测试框架）
- **断言库**: Vitest 内置（基于 Chai）
- **Mock 库**: Vitest 内置（基于 Sinon）
- **覆盖率**: Vitest 内置（基于 v8）

### 配置

测试配置位于 `vitest.config.ts`：

```typescript
export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // 覆盖率目标：80%
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    // 测试文件匹配
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
```

## 测试命令

### 基本命令

| 命令 | 说明 |
|------|------|
| `pnpm test` | 运行所有测试（一次性） |
| `pnpm test:run` | 运行测试（watch 模式，持续监听） |
| `pnpm test:watch` | 同上，watch 模式 |
| `pnpm test:ui` | 使用 Vitest UI 界面运行测试 |
| `pnpm test:coverage` | 生成覆盖率报告 |

### 高级用法

```bash
# 运行特定测试文件
pnpm vitest tests/unit/utils/config.test.ts

# 运行匹配模式的测试
pnpm vitest --grep "should handle"

# 运行特定目录的测试
pnpm vitest tests/commands

# 只运行失败的测试
pnpm vitest --re-run-failed-tests

# 更新快照
pnpm vitest --update-snapshots
```

### 并行执行控制

```bash
# 单线程运行（调试时有用）
pnpm vitest --no-threads

# 指定并发数
pnpm vitest --maxConcurrency 5
```

## 测试结构

### 目录组织

```
tests/
├── unit/              # 单元测试（单个函数/模块）
│   ├── commands/      # 命令测试
│   ├── utils/         # 工具函数测试
│   ├── config/        # 配置测试
│   └── i18n/          # 国际化测试
│
├── integration/       # 集成测试（跨模块交互）
│   └── ...
│
├── commands/          # 命令集成测试
│   ├── init.test.ts
│   ├── menu.test.ts
│   └── ...
│
├── utils/            # 工具集成测试
│   ├── config.test.ts
│   └── ...
│
├── i18n/             # 国际化完整性测试
│   └── i18n-integrity.test.ts
│
└── templates/        # 模板测试
    └── chinese-templates.test.ts
```

### 测试文件命名

- **核心测试**: `*.test.ts` - 基本功能和主流程
- **边界测试**: `*.edge.test.ts` - 边界条件和错误场景

示例：
- `config.test.ts` - 配置管理核心测试
- `config.edge.test.ts` - 配置边界情况测试

## 编写测试

### TDD 工作流

遵循 **Red-Green-Refactor** 循环：

1. **Red**: 先写一个失败的测试
2. **Green**: 写最小代码使测试通过
3. **Refactor**: 重构代码，保持测试通过

### 测试结构

使用 `describe` 和 `it` 组织测试：

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('ConfigManager', () => {
  beforeEach(() => {
    // 每个测试前的设置
    vi.clearAllMocks()
  })

  describe('readConfig', () => {
    it('should read config from file', async () => {
      // Arrange: 准备测试数据
      const mockConfig = { apiKey: 'test-key' }
      
      // Act: 执行被测试的功能
      const result = await readConfig('config.json')
      
      // Assert: 验证结果
      expect(result).toEqual(mockConfig)
    })

    it('should return null if file does not exist', async () => {
      // ...
    })
  })
})
```

### 测试类型示例

#### 1. 单元测试

测试单个函数或模块：

```typescript
import { describe, it, expect, vi } from 'vitest'
import { readConfig } from '../utils/config'

describe('readConfig', () => {
  it('should read valid JSON config', async () => {
    // Mock 文件系统
    vi.mock('fs/promises', () => ({
      readFile: vi.fn().mockResolvedValue('{"key": "value"}'),
    }))

    const config = await readConfig('config.json')
    expect(config).toEqual({ key: 'value' })
  })
})
```

#### 2. 集成测试

测试跨模块交互：

```typescript
import { describe, it, expect } from 'vitest'
import { init } from '../commands/init'
import { readConfig } from '../utils/config'

describe('Init Integration', () => {
  it('should create config after initialization', async () => {
    await init({ skipPrompt: true })
    
    const config = await readConfig()
    expect(config).toBeDefined()
    expect(config.apiKey).toBeTruthy()
  })
})
```

#### 3. 边界测试

测试错误场景和边界条件：

```typescript
describe('ConfigManager Edge Cases', () => {
  it('should handle invalid JSON gracefully', async () => {
    // 测试无效 JSON
    vi.spyOn(fs, 'readFile').mockResolvedValue('invalid json')
    
    await expect(readConfig('bad.json')).rejects.toThrow()
  })

  it('should handle missing required fields', async () => {
    // 测试缺少必需字段
    const incompleteConfig = { /* 缺少 apiKey */ }
    await expect(validateConfig(incompleteConfig)).rejects.toThrow()
  })
})
```

### 异步测试

```typescript
it('should handle async operations', async () => {
  const result = await asyncOperation()
  expect(result).toBeDefined()
})

it('should handle async errors', async () => {
  await expect(failingAsyncOperation()).rejects.toThrow()
})
```

### 快照测试

用于验证输出格式（注意：避免语言依赖）：

```typescript
it('should generate correct config format', () => {
  const config = generateConfig()
  // 快照测试会保存第一次运行的结果
  expect(config).toMatchSnapshot()
})
```

**注意**: 快照内容应稳定，不受语言设置影响。

## Mock 和 Fixtures

### 文件系统 Mock

使用 Vitest 的临时目录或 mock：

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

describe('File Operations', () => {
  beforeEach(() => {
    // 清理 mock
    vi.clearAllMocks()
  })

  it('should read file', async () => {
    // Mock readFile
    vi.spyOn(await import('fs/promises'), 'readFile')
      .mockResolvedValue('file content')

    const content = await readFile('test.txt')
    expect(content).toBe('file content')
  })
})
```

### 命令执行 Mock

```typescript
import { x } from 'tinyexec'

vi.mock('tinyexec', () => ({
  x: vi.fn().mockResolvedValue({ stdout: 'success' }),
}))

it('should execute command', async () => {
  await executeCommand('echo test')
  expect(x).toHaveBeenCalledWith('echo', ['test'])
})
```

### 交互式提示 Mock

```typescript
import inquirer from 'inquirer'

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({ choice: 'option1' }),
  },
}))

it('should handle user input', async () => {
  const result = await promptUser()
  expect(result).toBe('option1')
})
```

### 测试 Fixtures

创建可复用的测试数据：

```typescript
// tests/fixtures/config.ts
export const mockConfig = {
  apiKey: 'test-key',
  apiUrl: 'https://api.example.com',
}

export const mockInvalidConfig = {
  // 缺少必需字段
  apiUrl: 'https://api.example.com',
}
```

使用：

```typescript
import { mockConfig } from '../fixtures/config'

it('should validate config', () => {
  expect(validateConfig(mockConfig)).toBe(true)
})
```

## 覆盖率要求

### 覆盖率目标

- **行覆盖率**: >= 80%
- **函数覆盖率**: >= 80%
- **分支覆盖率**: >= 80%
- **语句覆盖率**: >= 80%

### 查看覆盖率

```bash
# 生成覆盖率报告
pnpm test:coverage

# 报告位置
# coverage/lcov-report/index.html
```

### 覆盖率报告解读

- **绿色**: 已覆盖
- **红色**: 未覆盖
- **黄色**: 部分覆盖（分支）

重点关注：
- 核心业务逻辑
- 错误处理路径
- 边界条件

## 最佳实践

### 1. 测试命名

使用描述性的测试名称：

```typescript
// ✅ 好的命名
it('should create backup before config changes', async () => {})
it('should handle invalid API key gracefully', async () => {})

// ❌ 不好的命名
it('test1', async () => {})
it('should work', async () => {})
```

### 2. 测试组织

按功能分组，使用嵌套 `describe`：

```typescript
describe('ConfigManager', () => {
  describe('readConfig', () => {
    it('should read valid config', () => {})
    it('should return null if file missing', () => {})
  })

  describe('writeConfig', () => {
    it('should write config to file', () => {})
    it('should create backup before write', () => {})
  })
})
```

### 3. 测试隔离

每个测试应该是独立的：

```typescript
beforeEach(() => {
  // 清理状态
  vi.clearAllMocks()
  // 重置全局状态
})

afterEach(() => {
  // 清理资源
})
```

### 4. 避免测试语言依赖

测试应独立于语言设置：

```typescript
// ❌ 避免
expect(output).toBe('Success')

// ✅ 推荐：使用翻译键或稳定标识
expect(output).toContain('success')
// 或
expect(output).toMatch(/success|成功/i)
```

### 5. Mock 外部依赖

Mock 所有外部依赖（文件系统、网络、命令等）：

```typescript
// Mock 文件系统
vi.mock('fs/promises')
vi.mock('fs')

// Mock 网络请求
vi.mock('node-fetch')

// Mock 命令执行
vi.mock('tinyexec')
```

### 6. 测试边界条件

- 空值/undefined/null
- 无效输入
- 网络错误
- 文件不存在
- 权限错误

### 7. 测试性能（如需要）

对于性能关键代码：

```typescript
it('should complete within time limit', async () => {
  const start = Date.now()
  await performOperation()
  const duration = Date.now() - start
  expect(duration).toBeLessThan(1000) // 1秒内完成
})
```

## 常见问题

### Q: 测试运行很慢？

A: 
1. 使用 `--run` 模式而不是 watch 模式
2. 并行执行（默认开启）
3. 只运行相关测试：`pnpm vitest path/to/test.ts`

### Q: Mock 不生效？

A: 
1. 确保在测试文件顶部调用 `vi.mock()`
2. 检查 mock 路径是否正确
3. 使用 `vi.spyOn` 而不是 `vi.mock`（如适用）

### Q: 快照测试失败？

A: 
1. 检查是否是有意的更改
2. 更新快照：`pnpm vitest --update-snapshots`
3. 确保快照内容稳定（不受语言影响）

### Q: 覆盖率不达标？

A: 
1. 查看覆盖率报告找出未覆盖的代码
2. 添加边界测试覆盖错误路径
3. 确保测试覆盖所有分支

## 相关文档

- [贡献指南](contributing.md) - 包含 TDD 工作流说明
- [架构说明](architecture.md) - 了解模块结构
- [Vitest 文档](https://vitest.dev/) - 官方文档
