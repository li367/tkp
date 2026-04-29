# TKP → TKP 重命名设计

**日期**: 2026-04-29 | **状态**: 待实施

## 目标

将项目从 `tkp` (Zero-Config Code Flow) 重命名为 `tkp`，以 `@tkp/cli` 发布至 npm，清理所有原作者外部链接，作为二次开发起点。

## 命名规范

| 类别 | 原文 | 改为 |
|------|------|------|
| npm 包名 | `tkp` | `@tkp/cli` |
| CLI 命令 | `tkp` | `tkp` |
| 代码常量/类型 | `TKP_*` | `TKP_*` |
| 配置目录 | `~/.ufomiao/tkp/` | `~/.tkp/` |
| 工作流目录 | `.tkp/` | `.tkp/` |
| 小写引用 | `tkp` | `tkp` |
| 入口文件 | `bin/tkp.mjs` | `bin/tkp.mjs` |

## 改动清单

### 根目录配置

| 文件 | 操作 |
|------|------|
| `package.json` | name→`@tkp/cli`, bin→`tkp`, 移除 author/repository/homepage/bugs 中的外部 URL |
| `LICENSE` | Copyright 行更新 |
| `cspell.json` | `ufomiao`→`tkp` |
| `pnpm-workspace.yaml` | 包名更新 |
| `build.config.ts` | 入口名调整 |

### 源码 (src/)

| 文件 | 操作 |
|------|------|
| `bin/tkp.mjs` | 重命名为 `bin/tkp.mjs` |
| `src/constants.ts` | 所有常量/路径重命名 |
| `src/cli.ts` | 命令名、描述更新 |
| `src/` 全部 | 常量引用、import、日志/注释字符串替换 |
| i18n 翻译 | 所有翻译字符串中名称更新 |

### 模板 (templates/)

| 路径 | 操作 |
|------|------|
| `templates/common/` | sixStep 工作流 `.tkp/`→`.tkp/` |
| `templates/claude-code/` | 命令引用更新 |
| `templates/codex/` | 命令引用更新 |
| `.tkp/` | 重命名为 `.tkp/` |

### 文档

| 文件 | 操作 |
|------|------|
| `README.md` / `README_zh-CN.md` / `README_ja-JP.md` | 移除 Badges, 标题更新, 命令示例更新, 移除 Telegram/域名/GitHub 链接 |
| `CLAUDE.md` | 标题/架构描述更新, 移除 Changelog 链接 |
| `CHANGELOG.md` | 保留为历史记录 |
| `CONTRIBUTING.md` | 移除外部 GitHub 链接 |
| `CODE_OF_CONDUCT.md` | 移除外部链接 |
| `AGENTS.md` | 名称更新 |
| `docs/` (VitePress) | 三语言全局替换, 链接移除 |
| `docs/CNAME` | 删除 |

### 测试 (tests/)

| 文件 | 操作 |
|------|------|
| 全部测试文件 | 常量引用、路径字符串、命令名替换 |
| 快照 | 更新全部快照 |

### 其他

| 路径 | 操作 |
|------|------|
| `.husky/` | 名称引用更新 |
| `.github/` | CI 名称引用更新 |
| `.bmad-core/` | BMAD 模块名称引用更新 |
| `.changeset/` | 配置更新 |

## 排除项

- `node_modules/` — 不修改
- `pnpm-lock.yaml` — 通过 `pnpm install` 重新生成
- `CHANGELOG.md` — 保留原作者历史记录

## 待用户确认

- **`description`** 字段：`tkp` 是否代表特定含义？如无，使用通用描述 "TKP CLI - Code Cli configuration tool"
- **LICENSE Copyright**：新版权归属人/组织名称
- **`package.json` 中 author/url**：外部链接移除后，`homepage`/`bugs`/`repository` 暂时清空还是填入占位符？

## 移除策略

所有外部链接（github.com/UfoMiao、tkp.ufomiao.com、t.me/ufomiao_tkp）统一删除或替换为空字符串。`package.json` 中保留 `author` 字段内容但移除 `url` 子字段；`repository`/`homepage`/`bugs` 清空，待用户后续配置。

## 风险

- **快照测试**：大量快照因路径变更失效，需统一更新
- **配置目录变更**：`~/.ufomiao/tkp` → `~/.tkp/` 影响现有用户，需考虑迁移逻辑（可选，后续处理）
- **i18n 键名**：如翻译键中包含 `tkp`，需同步更新键名和引用
