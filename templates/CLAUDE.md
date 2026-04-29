# Templates Module

**Last Updated**: 2026-04-29

[根目录](../CLAUDE.md) > **templates**

## 变更记录 (Changelog)

### v3.6.0+
- 新增 Leibus engineer 输出风格（专业 Leibus 技术指导，v3.6.0）
- 新增 rem-engineer 输出风格（动漫风格开发辅助，v3.6.0）
- 模板系统现支持 9 种输出风格
- BMAD V6 模板升级（v3.6.2）
- BMAD 多智能体命令模板（v3.6.3）
- 更新 MiniMax 模板文档以匹配 M2.7 模型（v3.6.4）

### v3.5.0+ (Major Consolidation)
- 模板整合到 `templates/common/` 目录以最大化代码复用
- 统一 output-styles 到 `templates/common/output-styles/`
- 统一 git workflows 到 `templates/common/workflow/git/`
- 统一 sixStep workflows 到 `templates/common/workflow/sixStep/`
- 移除重复的 Codex 模板（现与 Claude Code 共享）
- 统一 sixStep 计划目录为 `.zcf`

## Module Responsibilities

Template system module providing multilingual configuration templates, AI personality styles, and workflow definitions for both Claude Code and Codex environments. Supports Chinese (zh-CN) and English (en) locales with comprehensive workflow coverage.

## Template Structure (v3.5.0+ Consolidated)

```
templates/
  common/                    # Shared templates (cross code-tool)
    output-styles/           # 9 AI personality styles
      en/                    # English output styles
        engineer-professional.md
        laowang-engineer.md
        nekomata-engineer.md
        ojousama-engineer.md
        leibus-engineer.md        (v3.6.0+)
        rem-engineer.md           (v3.6.0+)
      zh-CN/                 # Chinese output styles
        (same set as en/)
    workflow/
      git/                   # Git workflow commands (en + zh-CN)
        git-commit.md
        git-worktree.md
        git-cleanBranches.md
        git-rollback.md
      sixStep/               # Six-step workflow (en + zh-CN)
        workflow.md
  claude-code/               # Claude Code specific templates
    en/  zh-CN/              # Workflow agent templates
      workflow/
        common/  plan/  bmad/
  codex/                     # Codex specific templates (minimal)
    en/  zh-CN/              # Shared with Claude Code via common/
```

## Output Styles (9 styles)

1. **engineer-professional** - Professional engineering style (default)
2. **laowang-engineer** - Laowang engineer
3. **nekomata-engineer** - Nekomata cat-girl engineer
4. **ojousama-engineer** - Ojou-sama aristocrat engineer
5. **leibus-engineer** - Leibus professional technical guidance (v3.6.0+)
6. **rem-engineer** - Rem anime-inspired assistant (v3.6.0+)
7. **default** - Default output style
8. **explanatory** - Explanatory style
9. **learning** - Learning-focused style

## Workflow Templates

### Common Tools Workflow
- **Commands**: `init-project`
- **Agents**: `init-architect`, `get-current-datetime`

### Six-Step Workflow
- **Commands**: `workflow`
- **Plan Directory**: `.zcf` (unified in v3.5.0)

### Planning Workflow (Plan)
- **Commands**: `feat`
- **Agents**: `planner`, `ui-ux-designer`

### BMAD Workflow (V6)
- **Commands**: `bmad-init` + multi-agent commands (v3.6.3+):
  `bmad-agent-_`, `bmad-bmm-_`, `bmad-editorial-_`, `bmad-review-_`, `bmad-help`, `bmad-party-mode`
- **Core**: `.bmad-core/` directory with BMAD V6 modules

### Git Workflow
- **Commands**: `git-commit`, `git-worktree`, `git-cleanBranches`, `git-rollback`

## Related Files

- `src/utils/workflow-installer.ts` - Template installation logic
- `src/config/workflows.ts` - Workflow configuration definitions
- `src/config/api-providers.ts` - API provider configurations
- `src/i18n/` - Internationalization support
- `tests/templates/` - Template validation tests
