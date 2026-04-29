# Configuration Module

**Last Updated**: 2026-04-29

[根目录](../../CLAUDE.md) > [src](../) > **config**

## 变更记录 (Changelog)

### v3.6.5+
- 新增小米 MiMo 大模型 API 供应商预设（按量付费 + Token Plan）

### v3.6.0+
- 新增 Leibus engineer 和 rem-engineer 输出风格配置 (v3.6.0)
- 新增 AICodeMirror 和 AICodeMirror CN 提供商预设 (v3.6.1)
- 新增 Crazyrouter 提供商预设 (v3.6.3)
- BMAD V6 工作流升级 (v3.6.2)
- BMAD 多智能体命令支持 (v3.6.3)
- 更新 MiniMax 预设为 M2.7 模型 (v3.6.4)
- 百炼 Coding 默认模型改为小写 glm-5 (v3.6.4)

### v3.5.0+
- 模板整合到 `templates/common/` — 统一 output-styles、git workflows、sixStep workflows
- sixStep 计划目录统一为 `.zcf`

## Module Responsibilities

Configuration definition module providing centralized workflow configurations, MCP service configurations, and API provider presets for the ZCF project.

## Entry Points and Startup

- **Main Entry Points**:
  - `workflows.ts` - Workflow configuration definitions (5 categories: common, plan, sixStep, bmad, git)
  - `mcp-services.ts` - MCP server configurations (7 services)
  - `api-providers.ts` - API provider preset definitions (12 providers)

## External Interfaces

### Workflow Configuration

```typescript
export const WORKFLOW_CONFIG_BASE: WorkflowConfigBase[]
export function getWorkflowConfigs(): WorkflowConfig[]
export function getWorkflowConfig(workflowId: string): WorkflowConfig | undefined
export function getOrderedWorkflows(): WorkflowConfig[]
```

### MCP Service Configuration

```typescript
export const MCP_SERVICE_CONFIGS: McpServiceConfig[]
export async function getMcpServices(): Promise<McpService[]>
export async function getMcpService(id: string): Promise<McpService | undefined>
```

### API Provider Presets (v3.3.0+, expanded v3.6.x)

```typescript
export const API_PROVIDER_PRESETS: ApiProviderPreset[]
export function getApiProviders(codeToolType: CodeToolType): ApiProviderPreset[]
export function getProviderPreset(providerId: string): ApiProviderPreset | undefined
```

## API Provider Presets (12 providers)

| Provider ID | Name | Supported Tools |
|------------|------|-----------------|
| 302ai | 302.AI | claude-code, codex |
| packycode | PackyCode | claude-code, codex |
| aicodemirror | AICodeMirror | claude-code, codex |
| aicodemirror-cn | AICodeMirror CN | claude-code, codex |
| crazyrouter | Crazyrouter | claude-code, codex |
| glm-cn | GLM CN | claude-code |
| z-ai | Z.ai | claude-code |
| bailian-coding | Bailian Coding | claude-code |
| minimax | MiniMax | claude-code |
| kimi-coding | Kimi Coding | claude-code |
| xiaomi-mimo | MiMo | claude-code |
| xiaomi-mimo-tp | MiMo Token Plan | claude-code |

## MCP Services (7 services)

| Service ID | Requires API Key | Technology |
|-----------|-----------------|------------|
| context7 | No | npx @upstash/context7-mcp |
| open-websearch | No | npx open-websearch |
| spec-workflow | No | npx @pimzino/spec-workflow-mcp |
| mcp-deepwiki | No | npx mcp-deepwiki |
| Playwright | No | npx @playwright/mcp |
| exa | Yes (EXA_API_KEY) | npx exa-mcp-server |
| serena | No | uvx serena |

## Workflow Categories (5 categories)

| Category | ID | Commands |
|---------|------|----------|
| common | commonTools | init-project, init-architect, get-current-datetime |
| sixStep | sixStepsWorkflow | workflow |
| plan | featPlanUx | feat, planner, ui-ux-designer |
| git | gitWorkflow | git-commit, git-rollback, git-cleanBranches, git-worktree |
| bmad | bmadWorkflow | bmad-init (+ BMAD V6 multi-agent commands in v3.6.3+) |

## Testing and Quality

### Test Coverage

- Configuration validation tests
- Workflow ID uniqueness tests
- API provider preset validation tests (including MiniMax, Bailian Coding)
- Template mapping verification

## Related Files

- `../types/workflow.ts` - Workflow type definitions
- `../types/config.ts` - Configuration type definitions
- `../utils/workflow-installer.ts` - Workflow installation logic
- `../../templates/common/` - Consolidated template files (v3.5.0+)
- `../i18n/locales/*/` - I18n translations for workflow names, MCP services, providers
