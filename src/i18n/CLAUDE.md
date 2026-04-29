# I18n Module

**Last Updated**: 2026-04-29

[根目录](../../CLAUDE.md) > [src](../) > **i18n**

## 变更记录 (Changelog)

### v3.6.0+
- 新增 Leibus engineer、rem-engineer 输出风格的国际化翻译 (v3.6.0)
- 新增 AICodeMirror、AICodeMirror CN 提供商相关翻译 (v3.6.1)
- 新增 Crazyrouter 提供商相关翻译 (v3.6.3)
- 新增 BMAD 多智能体命令相关翻译 (v3.6.3)
- 更新 MiniMax M2.7 模型相关翻译 (v3.6.4)

### v3.5.0+
- 模板整合相关翻译更新
- 四模型配置架构相关翻译
- @rainbowatcher/toml-edit-js 相关配置翻译

## Module Responsibilities

Internationalization support module providing complete localization support for Chinese (zh-CN) and English (en), including CLI interfaces, error messages, help text, workflow descriptions, and API provider information.

## Entry Points and Startup

- **Main Entry Points**:
  - `index.ts` - I18n system initialization (i18next + fs-backend)
  - `locales/zh-CN/` - Chinese translation JSON files
  - `locales/en/` - English translation JSON files

## Translation Namespaces (17 namespaces)

| Namespace | Content | Files (per locale) |
|-----------|---------|-------------------|
| common | Common terms and operations | common.json |
| api | API configuration | api.json |
| ccr | Claude Code Router | ccr.json |
| cli | CLI command line interface | cli.json |
| cometix | Cometix status line tools | cometix.json |
| configuration | Configuration management | configuration.json |
| errors | Error messages | errors.json |
| installation | Installation process | installation.json |
| language | Language selection | language.json |
| mcp | MCP services | mcp.json |
| menu | Interactive menu system | menu.json |
| multi-config | Multi-configuration management | multi-config.json |
| tools | Third-party tools | tools.json |
| uninstall | Uninstallation | uninstall.json |
| updater | Auto updater | updater.json |
| workflow | Workflow system | workflow.json |
| codex | Codex integration | codex.json |

## Key Dependencies

- `i18next` - Core i18n framework
- `i18next-fs-backend` - File system backend for loading JSON translations
- `pathe` - Cross-platform path resolution

## System Architecture

```typescript
// Initialize i18n system
export async function initI18n(language: SupportedLang): Promise<void>

// Translation function (via i18next instance)
export const i18n: I18nInstance

// Change language at runtime
export async function changeLanguage(lng: SupportedLang): Promise<void>

// Safety check for initialization
export function ensureI18nInitialized(): void
```

## Supported Languages

- **zh-CN** - Simplified Chinese
- **en** - English

## Quality Metrics

- Translation coverage: **100%** (all 17 namespaces)
- Language consistency: Complete zh-CN/en correspondence
- Automated validation: Included in test suite (`tests/i18n/`)
