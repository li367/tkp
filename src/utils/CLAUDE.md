# Utils Module

**Last Updated**: 2026-04-29

[根目录](../../CLAUDE.md) > [src](../) > **utils**

## 变更记录 (Changelog)

### v3.6.0+
- 新增 Leibus engineer 和 rem-engineer 输出风格支持
- 新增 AICodeMirror (v3.6.1)、Crazyrouter (v3.6.3) 提供商预设
- 更新 MiniMax 预设为 M2.7 模型 (v3.6.4)
- 升级 BMAD 模板至 V6 (v3.6.2)
- 新增 BMAD 多智能体命令支持 (v3.6.3)

### v3.5.0+
- 使用 @rainbowatcher/toml-edit-js 替换 smol-toml 用于 TOML 编辑 (v3.5.1)
- 实现精准 TOML 更新机制，防止 MCP 配置被破坏 (v3.5.1)
- 更新 Codex 模型选项和默认配置 (v3.5.1)
- 移除 writeCodexConfig 函数 (v3.5.1)
- 模板整合到 `templates/common/` 目录 (v3.5.0)
- 统一 sixStep 计划目录为 `.zcf` (v3.5.0)

## Module Responsibilities

Core utility module providing configuration management, platform compatibility, MCP service integration, Claude Code installation, workflow management, and cross-platform tool support for the ZCF project. Contains 52+ TypeScript files organized into specialized subdirectories for CCR, Cometix, Code Tools, and general utilities.

## Entry Points and Startup

- **Main Entry Points**:
  - `config.ts` - Configuration file management and backup operations
  - `installer.ts` - Claude Code installation and update logic
  - `platform.ts` - Cross-platform support and environment detection
  - `workflow-installer.ts` - Workflow template installation and management
  - `claude-code-config-manager.ts` - Advanced Claude Code configuration management (TOML-based)
  - `claude-code-incremental-manager.ts` - Incremental configuration updates
  - `features.ts` - Feature management and installation orchestration
  - `uninstaller.ts` - Advanced uninstallation with conflict resolution
  - `trash.ts` - Cross-platform trash/recycle bin integration
  - `zcf-config.ts` - ZCF-specific configuration management

- **Subdirectories**:
  - `ccr/` - Claude Code Router proxy management
  - `cometix/` - Status line tools and configuration
  - `code-tools/` - Codex integration and dual code tool support

## Key Dependencies

### Core Dependencies

- `pathe` - Cross-platform path operations
- `tinyexec` - Cross-platform command execution
- `@rainbowatcher/toml-edit-js` - Precise TOML editing (v3.5.1+, replaces smol-toml)
- `i18next` - Internationalization via `../i18n/`
- `fs-extra` - File system operations
- `trash` - Cross-platform trash integration

### Template Integration (v3.5.0+)

The workflow-installer now uses consolidated templates from `templates/common/`:
- `templates/common/output-styles/` - AI personality styles (9 styles in v3.6.x)
- `templates/common/workflow/git/` - Git workflow commands
- `templates/common/workflow/sixStep/` - Six-step development workflow

## Submodules

### CCR (Claude Code Router)
- `ccr/installer.ts`, `ccr/config.ts`, `ccr/presets.ts`, `ccr/commands.ts`

### Cometix (Status Line Tools)
- `cometix/installer.ts`, `cometix/commands.ts`, `cometix/menu.ts`, `cometix/types.ts`

### Code Tools (Codex Integration)
- `code-tools/codex.ts`, `codex-config-detector.ts`, `codex-provider-manager.ts`, `codex-uninstaller.ts`, `codex-platform.ts`, `codex-config-switch.ts`, `codex-configure.ts`

## Related Files

- `../commands/` - Command implementations that use utility functions
- `../types/` - TypeScript interfaces
- `../i18n/` - Internationalization support (17 namespaces)
- `../config/` - Configuration definitions (workflows, MCP services, API providers)
- `../../templates/common/` - Consolidated template files (v3.5.0+)
