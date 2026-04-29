---
title: 命令概览
---

# 命令概览

TKP CLI 基于 `cac` 实现，所有命令均可通过 `npx tkp <command>` 调用。常用命令如下：

| 命令 | 说明 |
| --- | --- |
| `tkp` | 打开交互式菜单，聚合所有功能 |
| `tkp init` / `tkp i` | 完整初始化，覆盖 Claude Code 或 Codex |
| `tkp update` / `tkp u` | 更新工作流与模板，可选择语言与输出样式 |
| `tkp ccr` | 管理 Claude Code Router 代理 |
| `tkp ccu` | Claude Code 使用分析与统计 |
| `tkp uninstall` | 卸载配置并可选择保留备份 |
| `tkp config-switch` / `tkp cs` | 在多套配置之间切换 |
| `tkp check-updates` / `tkp check` | 检查并升级工具链 |

每个命令均支持 `--help` 查看详细参数。以下章节将逐一说明。
