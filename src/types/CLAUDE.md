# Types Module

**Last Updated**: 2026-04-29

[根目录](../../CLAUDE.md) > [src](../) > **types**

## 变更记录 (Changelog)

### v3.6.0+
- ApiProviderPreset 接口扩展支持 AICodeMirror、AICodeMirror CN (v3.6.1) 和 Crazyrouter (v3.6.3)
- 新增 `codex` 相关类型定义扩展
- 新增输出风格类型支持 Leibus engineer 和 rem-engineer (v3.6.0)

### v3.5.0+
- 四模型 API 配置架构类型定义
- 模板整合相关路径类型更新

## Module Responsibilities

TypeScript type definition module providing complete type system support for the ZCF project, including workflow configuration, Claude configuration, CCR integration, and core business logic type definitions.

## Entry Points and Startup

- **Main Entry Points**:
  - `workflow.ts` - Workflow-related type definitions
  - `config.ts` - Configuration-related type definitions
  - `ccr.ts` - Claude Code Router type definitions

## Core Type Definitions

### Workflow Types (`workflow.ts`)
```typescript
export interface WorkflowConfig {
  id: string
  name?: string
  description?: string
  defaultSelected: boolean
  order: number
  commands: string[]
  agents: Array<{ id: string, filename: string, required: boolean }>
  autoInstallAgents: boolean
  category: 'common' | 'plan' | 'sixStep' | 'bmad' | 'git'
  outputDir: string
}
```

### Configuration Types (`config.ts`)
```typescript
export interface McpService {
  id: string
  name: string
  description: string
  requiresApiKey: boolean
  apiKeyPrompt?: string
  apiKeyEnvVar?: string
  config: McpServerConfig
}
```

### CCR Types (`ccr.ts`)
```typescript
// Claude Code Router configuration types
```

## Related Files

- `../config/workflows.ts` - Workflow configuration implementation
- `../config/mcp-services.ts` - MCP service configurations
- `../config/api-providers.ts` - API provider preset definitions
- `../commands/*.ts` - Type usage in command implementations
- `../utils/*.ts` - Type usage in utility functions
