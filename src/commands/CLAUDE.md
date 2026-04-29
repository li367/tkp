# Commands Module

**Last Updated**: 2026-04-29

[根目录](../../CLAUDE.md) > [src](../) > **commands**

## 变更记录 (Changelog)

### v3.6.0+
- 支持跳过输出风格选择（v3.6.2）
- 新增 AICodeMirror 和 Crazyrouter 提供商预设支持（v3.6.1, v3.6.3）

### v3.5.0+
- 适配 consolidated 模板架构，统一使用 `templates/common/` 路径
- init 命令支持新的四模型 API 配置架构

## Module Responsibilities

CLI command implementation module containing all major command functions for ZCF, providing both interactive and non-interactive operation interfaces for Claude Code and Codex environment setup and management.

## Entry Points and Startup

- **Main Entry Points**:
  - `init.ts` - Complete initialization flow with full setup options (~1200+ lines)
  - `menu.ts` - Interactive menu system with feature selection (~350+ lines)
  - `update.ts` - Workflow template updates without full reinstall
  - `ccr.ts` - Claude Code Router proxy configuration
  - `ccu.ts` - CCusage tool integration and execution
  - `check-updates.ts` - Tool version checking and update management
  - `config-switch.ts` - Configuration switching for multi-provider support
  - `uninstall.ts` - ZCF uninstallation with selective removal

## External Interfaces

### Command Interfaces

```typescript
// Initialize command options
export interface InitOptions {
  configLang?: SupportedLang
  aiOutputLang?: AiOutputLanguage | string
  force?: boolean
  skipPrompt?: boolean
  codeType?: CodeToolType | string
  // Non-interactive mode parameters
  configAction?: 'new' | 'backup' | 'merge' | 'docs-only' | 'skip'
  apiType?: 'auth_token' | 'api_key' | 'ccr_proxy' | 'skip'
  apiKey?: string
  apiUrl?: string
  apiModel?: string
  apiHaikuModel?: string
  apiSonnetModel?: string
  apiOpusModel?: string
  provider?: string // API provider preset (302ai, glm, minimax, kimi, packycode, aicodemirror, crazyrouter, etc.)
  mcpServices?: string[] | string | boolean
  workflows?: string[] | string | boolean
  outputStyles?: string[] | string | boolean
  defaultOutputStyle?: string
  allLang?: string
  installCometixLine?: string | boolean
  apiConfigs?: string
  apiConfigsFile?: string
}
```

### API Endpoints

- `init(options: InitOptions)` - Execute complete initialization workflow with dual code tool support
- `update(options)` - Update workflow templates and configurations
- `showMainMenu(options)` - Display interactive main menu with all features
- `ccr()` - Configure Claude Code Router proxy settings
- `executeCcusage(args)` - Execute CCusage tool with specified arguments
- `checkUpdates(options)` - Check for tool updates and perform upgrades
- `configSwitch(target, options)` - Switch between API configurations
- `uninstall(options)` - Uninstall ZCF with selective removal options

## Key Dependencies and Configuration

### Core Dependencies

- **Configuration and utilities**: config.ts, installer.ts, platform.ts, workflow-installer.ts
- **I18n System**: Full internationalization via i18next (17 namespaces)
- **Platform Detection**: Windows/macOS/Linux/Termux compatibility handling
- **Configuration Management**: Smart merging and backup of existing configurations
- **Template System**: Consolidated templates in `templates/common/` (v3.5.0+)

## Testing and Quality

### Test Coverage

- **Unit Tests**: Individual command function testing
- **Integration Tests**: Full workflow execution testing
- **Edge Case Tests**: Platform-specific and error condition testing
- **Mock Testing**: External tool integration testing with comprehensive mocking

### Test Files

- `tests/commands/*.test.ts` - Core command functionality tests
- `tests/commands/*.edge.test.ts` - Edge case and error condition tests
- `tests/unit/commands/` - Isolated unit tests for command logic

## Related Files

- `../utils/` - Core utility functions for configuration, installation, and platform support
- `../i18n/` - Internationalization support for command interfaces
- `../types/` - TypeScript interfaces for command options and configurations
- `../config/workflows.ts` - Workflow configuration definitions
- `../config/api-providers.ts` - API provider preset definitions
- `../../templates/` - Template files used by commands
