# Tests Module

**Last Updated**: 2026-04-29

[根目录](../CLAUDE.md) > **tests**

## 变更记录 (Changelog)

### v3.6.0+
- 新增 MiniMax 提供商配置的单元测试覆盖 (v3.6.4)
- 新增百炼 Coding 默认模型的单元测试 (v3.6.4)
- 新增 Leibus engineer 和 rem-engineer 输出风格测试 (v3.6.0)
- 新增 AICodeMirror 提供商预设测试 (v3.6.1)
- 新增 Crazyrouter 提供商预设测试 (v3.6.3)
- 新增 BMAD V6 模板测试 (v3.6.2)
- 新增 BMAD 多智能体命令测试 (v3.6.3)

### v3.5.0+
- 模板整合验证测试（common/ 目录结构）
- Codex 工作流选择 presetWorkflows 过滤测试
- @rainbowatcher/toml-edit-js 集成测试
- Codex skip-prompt 模式测试覆盖增强

## Module Responsibilities

Test suite module providing comprehensive test coverage for the ZCF project, including unit tests, integration tests, edge tests, and template validation tests. Targeting 80%+ coverage on all metrics.

## Entry Points and Startup

- **Testing Framework**: Vitest
- **Coverage Tool**: @vitest/coverage-v8
- **Test UI**: @vitest/ui
- **Main Test Directories**:
  - `tests/commands/` - Command layer tests
  - `tests/utils/` - Utility layer tests (ccr/, cometix/)
  - `tests/unit/` - Unit test suites
  - `tests/integration/` - Integration tests
  - `tests/edge/` - Edge case tests
  - `tests/i18n/` - Internationalization tests
  - `tests/templates/` - Template validation tests

## Test Commands

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:ui           # UI interface
pnpm test:coverage     # Coverage report
pnpm test:run          # Single run
```

## Quality Metrics

- **Line Coverage**: 80%+ target
- **Function Coverage**: 80%+ target
- **Branch Coverage**: 80%+ target
- **Statement Coverage**: 80%+ target

## Testing Strategy

1. **Unit Tests** (`tests/unit/`) - Isolated function testing
2. **Integration Tests** (`tests/integration/`) - Cross-module interaction
3. **Edge Tests** (`*.edge.test.ts`) - Boundary conditions and error scenarios
4. **I18n Tests** (`tests/i18n/`) - Translation validation
5. **Template Tests** (`tests/templates/`) - Template validation
6. **Provider Tests** - API provider preset validation (MiniMax, Bailian Coding, etc.)
