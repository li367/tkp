# TKP → TKP 重命名实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将项目从 `tkp` 重命名为 `tkp`，以 `@tkp/cli` 发布，命令行 `npx tkp`，配置目录 `~/.tkp/`，移除所有原作者外部链接。

**Architecture:** 机械性全局替换 + 针对性手动编辑。大部分文件通过精确的 sed/rg 替换完成，配置文件、LICENSE、README 等需要手动精编。

**Tech Stack:** TypeScript, Node.js, ripgrep, sed, git

---

### Task 1: 根目录配置文件

**Files:**
- Modify: `package.json`
- Modify: `LICENSE`
- Modify: `cspell.json`
- Modify: `pnpm-workspace.yaml`

- [ ] **Step 1: 修改 package.json**

```bash
# 用 sed 修改关键字段
cd /home/devbox/project/tkp
# name: "tkp" → "@tkp/cli"
sed -i 's/"name": "tkp"/"name": "@tkp\/cli"/' package.json
# bin: "tkp" → "tkp"
sed -i 's/"tkp": "bin\/tkp.mjs"/"tkp": "bin\/tkp.mjs"/' package.json
# description
sed -i 's/"description": "Zero-Config Code Flow - One-click configuration tool for Code Cli"/"description": "TKP CLI - Code Cli configuration tool"/' package.json
```

然后手动编辑 `package.json`，移除 author 的 `url` 字段，清空 `homepage`/`bugs`/`repository`：

```json
"author": {
  "name": "Miao Da",
  "email": "ufo025174@gmail.com"
},
"homepage": "",
"repository": {
  "type": "git",
  "url": ""
},
"bugs": ""
```

- [ ] **Step 2: 修改 LICENSE**

将 Copyright 行：
```
Copyright (c) 2025-PRESENT UfoMiao <https://github.com/UfoMiao> & Miao Da <https://github.com/WitMiao>
```
改为：
```
Copyright (c) 2025-PRESENT Miao Da
```

- [ ] **Step 3: 修改 cspell.json**

```bash
sed -i 's/"ufomiao"/"tkp"/' /home/devbox/project/tkp/cspell.json
```

- [ ] **Step 4: 修改 pnpm-workspace.yaml**

```bash
sed -i 's/tkp/@tkp\/cli/g' /home/devbox/project/tkp/pnpm-workspace.yaml
```

- [ ] **Step 5: 验证**

```bash
cd /home/devbox/project/tkp && node -e "const p = require('./package.json'); console.log(p.name, p.bin)" 2>&1 || node -e "import('./package.json', {with: {type: 'json'}}).then(p => console.log(p.default.name, p.default.bin))"
```

---

### Task 2: 核心常量与入口文件

**Files:**
- Modify: `src/constants.ts`
- Modify: `src/cli.ts`
- Modify: `src/cli-setup.ts`
- Rename: `bin/tkp.mjs` → `bin/tkp.mjs`

- [ ] **Step 1: 重写 src/constants.ts**

```typescript
import { homedir } from 'node:os'
import { join } from 'pathe'
import { i18n } from './i18n'

// Claude Code configuration paths
export const CLAUDE_DIR = join(homedir(), '.claude')
export const SETTINGS_FILE = join(CLAUDE_DIR, 'settings.json')
export const CLAUDE_MD_FILE = join(CLAUDE_DIR, 'CLAUDE.md')
export const ClAUDE_CONFIG_FILE = join(homedir(), '.claude.json')
export const CLAUDE_VSC_CONFIG_FILE = join(CLAUDE_DIR, 'config.json')

// Codex configuration paths
export const CODEX_DIR = join(homedir(), '.codex')
export const CODEX_CONFIG_FILE = join(CODEX_DIR, 'config.toml')
export const CODEX_AUTH_FILE = join(CODEX_DIR, 'auth.json')
export const CODEX_AGENTS_FILE = join(CODEX_DIR, 'AGENTS.md')
export const CODEX_PROMPTS_DIR = join(CODEX_DIR, 'prompts')

// TKP configuration paths
export const TKP_CONFIG_DIR = join(homedir(), '.tkp')
export const TKP_CONFIG_FILE = join(TKP_CONFIG_DIR, 'config.toml')
export const LEGACY_TKP_CONFIG_FILES = [
  join(CLAUDE_DIR, '.tkp-config.json'),
  join(homedir(), '.tkp.json'),
]

export const CODE_TOOL_TYPES = ['claude-code', 'codex'] as const
export type CodeToolType = (typeof CODE_TOOL_TYPES)[number]
export const DEFAULT_CODE_TOOL_TYPE: CodeToolType = 'claude-code'

export const CODE_TOOL_BANNERS: Record<CodeToolType, string> = {
  'claude-code': 'for Claude Code',
  'codex': 'for Codex',
}

export const CODE_TOOL_ALIASES: Record<string, CodeToolType> = {
  cc: 'claude-code',
  cx: 'codex',
}

export function isCodeToolType(value: any): value is CodeToolType {
  return CODE_TOOL_TYPES.includes(value as CodeToolType)
}

export const API_DEFAULT_URL = 'https://api.anthropic.com'
export const API_ENV_KEY = 'ANTHROPIC_API_KEY'

export function resolveCodeToolType(value: unknown): CodeToolType {
  if (isCodeToolType(value)) {
    return value
  }
  if (typeof value === 'string' && value in CODE_TOOL_ALIASES) {
    return CODE_TOOL_ALIASES[value]
  }
  return DEFAULT_CODE_TOOL_TYPE
}

export const SUPPORTED_LANGS = ['zh-CN', 'en'] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]

export const LANG_LABELS = {
  'zh-CN': '简体中文',
  'en': 'English',
} as const

export const AI_OUTPUT_LANGUAGES = {
  'zh-CN': { directive: 'Always respond in Chinese-simplified' },
  'en': { directive: 'Always respond in English' },
  'custom': { directive: '' },
} as const

export type AiOutputLanguage = keyof typeof AI_OUTPUT_LANGUAGES

export function getAiOutputLanguageLabel(lang: AiOutputLanguage): string {
  if (lang in LANG_LABELS) {
    return LANG_LABELS[lang as SupportedLang]
  }
  if (lang === 'custom' && i18n?.isInitialized) {
    try {
      return i18n.t('language:labels.custom')
    } catch {
      // Fallback if translation fails
    }
  }
  return lang
}
```

- [ ] **Step 2: 重命名 bin/tkp.mjs → bin/tkp.mjs**

```bash
cd /home/devbox/project/tkp && git mv bin/tkp.mjs bin/tkp.mjs
```

- [ ] **Step 3: 修改 src/cli.ts 和 src/cli-setup.ts 中的命令名**

```bash
# 替换所有小写 tkp 为 tkp（注意边界）
cd /home/devbox/project/tkp
sed -i 's/"tkp"/"tkp"/g' src/cli.ts src/cli-setup.ts
sed -i "s/'tkp'/'tkp'/g" src/cli.ts src/cli-setup.ts
```

---

### Task 3: src/ 源码全局替换

**Files:** `src/` 下全部 `.ts` 文件

- [ ] **Step 1: 执行全局替换（排除 constants.ts 和 cli 文件）**

```bash
cd /home/devbox/project/tkp

# 1. 替换所有 TKP_ 常量名为 TKP_
find src/ -name "*.ts" ! -name "constants.ts" -exec sed -i 's/TKP_CONFIG_DIR/TKP_CONFIG_DIR/g' {} +
find src/ -name "*.ts" ! -name "constants.ts" -exec sed -i 's/TKP_CONFIG_FILE/TKP_CONFIG_FILE/g' {} +
find src/ -name "*.ts" ! -name "constants.ts" -exec sed -i 's/LEGACY_TKP_CONFIG_FILES/LEGACY_TKP_CONFIG_FILES/g' {} +

# 2. 替换路径字符串 '.ufomiao/tkp' → '.tkp'
find src/ -name "*.ts" -exec sed -i "s|.ufomiao/tkp|.tkp|g" {} +

# 3. 替换 import 路径（如果有 from './tkp*' 之类的，项目内检查）
```

- [ ] **Step 2: 检查替换结果**

```bash
# 确保没有残留的 TKP_ 引用（除了 LEGACY_ 中故意保留的 .tkp 历史路径）
rg "TKP_CONFIG_DIR|TKP_CONFIG_FILE" src/ --stats
# 应该只输出 0 matches
```

- [ ] **Step 3: 手动检查关键文件**

```bash
rg "tkp" src/ --ignore-case | grep -v "node_modules" | grep -v ".tkp" | grep -v "legacy"
```

---

### Task 4: i18n 翻译文件

**Files:**
- Modify: `src/i18n/locales/en/` 下所有 `.json`
- Modify: `src/i18n/locales/zh-CN/` 下所有 `.json`
- Modify: `src/i18n/index.ts`

- [ ] **Step 1: 替换翻译文件中的 tkp → tkp**

```bash
cd /home/devbox/project/tkp
find src/i18n/locales/ -name "*.json" -exec sed -i 's/tkp/tkp/g' {} +
find src/i18n/locales/ -name "*.json" -exec sed -i 's/TKP/TKP/g' {} +
# 替换 URL/域名引用为占位符
find src/i18n/locales/ -name "*.json" -exec sed -i 's|https://github.com/UfoMiao/tkp||g' {} +
find src/i18n/locales/ -name "*.json" -exec sed -i 's|https://tkp.ufomiao.com||g' {} +
find src/i18n/locales/ -name "*.json" -exec sed -i 's|https://t.me/ufomiao_tkp||g' {} +
```

- [ ] **Step 2: 修改 src/i18n/index.ts 中的名称引用**

```bash
sed -i 's/tkp/tkp/g' /home/devbox/project/tkp/src/i18n/index.ts
sed -i 's/TKP/TKP/g' /home/devbox/project/tkp/src/i18n/index.ts
```

---

### Task 5: 模板文件

**Files:**
- Modify: `templates/` 下所有 `.md` 和 `CLAUDE.md`
- Rename: `.tkp/` → `.tkp/`

- [ ] **Step 1: 替换模板中的所有 tkp → tkp**

```bash
cd /home/devbox/project/tkp
find templates/ -type f \( -name "*.md" -o -name "*.json" \) -exec sed -i 's/tkp/tkp/g' {} +
find templates/ -type f \( -name "*.md" -o -name "*.json" \) -exec sed -i 's/TKP/TKP/g' {} +
```

- [ ] **Step 2: 替换模板中的配置路径**

```bash
find templates/ -type f \( -name "*.md" -o -name "*.json" \) -exec sed -i 's|.ufomiao/tkp|.tkp|g' {} +
find templates/ -type f \( -name "*.md" -o -name "*.json" \) -exec sed -i 's|.ufomiao/tkp|.tkp|g' {} +
find templates/ -type f \( -name "*.md" -o -name "*.json" \) -exec sed -i 's|.tkp/|.tkp/|g' {} +
```

- [ ] **Step 3: 重命名 .tkp/ → .tkp/**

```bash
cd /home/devbox/project/tkp
if [ -d .tkp ]; then
  git mv .tkp .tkp
fi
```

---

### Task 6: 根目录 Markdown 文件

**Files:**
- Modify: `README.md`, `README_zh-CN.md`, `README_ja-JP.md`
- Modify: `CLAUDE.md`, `CHANGELOG.md`
- Modify: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md`

- [ ] **Step 1: README 系列 — 移除 Badges 并更新内容**

对三个 README 文件执行：

```bash
cd /home/devbox/project/tkp

# 移除 Badge 行（npm/Codecov/DeepWiki/JSDocs 等）
for f in README.md README_zh-CN.md README_ja-JP.md; do
  # 移除 markdown badge 链接行
  sed -i '/^\[!\[/d' "$f"
  # 移除 badge 引用定义行
  sed -i '/^\[npm-version-src\]/d' "$f"
  sed -i '/^\[npm-version-href\]/d' "$f"
  sed -i '/^\[npm-downloads-src\]/d' "$f"
  sed -i '/^\[npm-downloads-href\]/d' "$f"
  sed -i '/^\[license-src\]/d' "$f"
  sed -i '/^\[license-href\]/d' "$f"
  sed -i '/^\[claude-code-src\]/d' "$f"
  sed -i '/^\[claude-code-href\]/d' "$f"
  sed -i '/^\[codecov-src\]/d' "$f"
  sed -i '/^\[codecov-href\]/d' "$f"
  sed -i '/^\[jsdocs-src\]/d' "$f"
  sed -i '/^\[jsdocs-href\]/d' "$f"
  sed -i '/^\[deepwiki-src\]/d' "$f"
  sed -i '/^\[deepwiki-href\]/d' "$f"
  # 移除 banner 图片行（指向原作者 repo）
  sed -i '/banner.webp/d' "$f"
  # 替换命令示例
  sed -i 's/npx tkp /npx @tkp\/cli /g' "$f"
  sed -i 's/npx tkp$/npx @tkp\/cli/g' "$f"
  # 标题替换
  sed -i 's/TKP - Zero-Config Code Flow/TKP CLI/g' "$f"
  sed -i 's/TKP/TKP/g' "$f"
  sed -i 's/tkp/tkp/g' "$f"
  # 移除 Telegram 链接
  sed -i '/t.me\/ufomiao/d' "$f"
  sed -i '/Telegram/d' "$f"
  # 移除文档域名
  sed -i 's|https://tkp.ufomiao.com/[^)]*||g' "$f"
  sed -i 's|tkp.ufomiao.com||g' "$f"
  # 移除 GitHub 链接
  sed -i 's|https://github.com/UfoMiao/tkp[^)]*||g' "$f"
  sed -i 's|https://github.com/ufomiao/tkp[^)]*||g' "$f"
done
```

- [ ] **Step 2: CLAUDE.md — 更新标题和架构描述**

```bash
cd /home/devbox/project/tkp
sed -i 's/TKP (Zero-Config Code Flow)/TKP CLI/g' CLAUDE.md
sed -i 's/TKP/TKP/g' CLAUDE.md
sed -i 's/tkp/tkp/g' CLAUDE.md
sed -i 's|~/.ufomiao/tkp|~/.tkp|g' CLAUDE.md
# 移除 GitHub 链接引用
sed -i 's|https://github.com/UfoMiao/tkp[^)]*||g' CLAUDE.md
sed -i 's|(https://tkp.ufomiao.com[^)]*)||g' CLAUDE.md
```

- [ ] **Step 3: CONTRIBUTING.md, CODE_OF_CONDUCT.md, AGENTS.md**

```bash
cd /home/devbox/project/tkp
for f in CONTRIBUTING.md CODE_OF_CONDUCT.md AGENTS.md; do
  sed -i 's/tkp/tkp/g' "$f"
  sed -i 's/TKP/TKP/g' "$f"
  sed -i 's|https://github.com/UfoMiao/tkp[^)]*||g' "$f"
  sed -i 's|https://github.com/ufomiao/tkp[^)]*||g' "$f"
done
```

- [ ] **Step 4: CHANGELOG.md**

```bash
# 只改标题，保留历史内容
cd /home/devbox/project/tkp
sed -i '1s/.*/# TKP CLI Changelog/' CHANGELOG.md
```

---

### Task 7: 文档文件 (docs/)

**Files:** `docs/` 下所有 `.md` 文件

- [ ] **Step 1: 全局替换**

```bash
cd /home/devbox/project/tkp
find docs/ -name "*.md" -exec sed -i 's/tkp/tkp/g' {} +
find docs/ -name "*.md" -exec sed -i 's/TKP/TKP/g' {} +
find docs/ -name "*.md" -exec sed -i 's|~/.ufomiao/tkp|~/.tkp|g' {} +
find docs/ -name "*.md" -exec sed -i 's|.ufomiao/tkp|.tkp|g' {} +
```

- [ ] **Step 2: 移除外部链接**

```bash
cd /home/devbox/project/tkp
find docs/ -name "*.md" -exec sed -i 's|https://github.com/UfoMiao/tkp[^)]*||g' {} +
find docs/ -name "*.md" -exec sed -i 's|https://github.com/ufomiao/tkp[^)]*||g' {} +
find docs/ -name "*.md" -exec sed -i 's|https://tkp.ufomiao.com[^)]*||g' {} +
find docs/ -name "*.md" -exec sed -i 's|https://t.me/ufomiao_tkp||g' {} +
```

- [ ] **Step 3: 删除 docs/CNAME**

```bash
rm /home/devbox/project/tkp/docs/CNAME
```

---

### Task 8: 测试文件全局替换

**Files:** `tests/` 下所有 `.ts` 文件

- [ ] **Step 1: 替换常量名和路径字符串**

```bash
cd /home/devbox/project/tkp

# 常量名替换
find tests/ -name "*.ts" -exec sed -i 's/TKP_CONFIG_DIR/TKP_CONFIG_DIR/g' {} +
find tests/ -name "*.ts" -exec sed -i 's/TKP_CONFIG_FILE/TKP_CONFIG_FILE/g' {} +
find tests/ -name "*.ts" -exec sed -i 's/LEGACY_TKP_CONFIG_FILES/LEGACY_TKP_CONFIG_FILES/g' {} +

# 路径字符串替换
find tests/ -name "*.ts" -exec sed -i "s|/\.ufomiao/tkp|/.tkp|g" {} +
find tests/ -name "*.ts" -exec sed -i "s|'\.ufomiao/tkp'|'.tkp'|g" {} +
find tests/ -name "*.ts" -exec sed -i "s|\"\.ufomiao/tkp\"|\".tkp\"|g" {} +
find tests/ -name "*.ts" -exec sed -i "s|'\.ufomiao'|'.tkp'|g" {} +
find tests/ -name "*.ts" -exec sed -i "s|\.ufomiao/tkp|.tkp|g" {} +

# 命令名替换
find tests/ -name "*.ts" -exec sed -i "s/'tkp'/'tkp'/g" {} +
find tests/ -name "*.ts" -exec sed -i 's/"tkp"/"tkp"/g' {} +

# 通用 tkp → tkp
find tests/ -name "*.ts" -exec sed -i 's/tkp/tkp/g' {} +
find tests/ -name "*.ts" -exec sed -i 's/TKP/TKP/g' {} +
```

- [ ] **Step 2: 检查替换结果**

```bash
# 确保无 TKP_ 常量残留
rg "TKP_CONFIG" tests/ --stats
# 确保无 .ufomiao 路径残留
rg "ufomiao" tests/ --stats
```

---

### Task 9: BMAD Core 与 配置文件

**Files:**
- Modify: `.bmad-core/` 下所有文件
- Modify: `.github/` 下所有文件
- Modify: `.husky/` 下所有文件
- Modify: `.changeset/config.json`

- [ ] **Step 1: BMAD Core 替换**

```bash
cd /home/devbox/project/tkp
find .bmad-core/ -type f -exec sed -i 's/tkp/tkp/g' {} +
find .bmad-core/ -type f -exec sed -i 's/TKP/TKP/g' {} +
```

- [ ] **Step 2: GitHub CI 配置**

```bash
find .github/ -type f -exec sed -i 's/tkp/tkp/g' {} +
find .github/ -type f -exec sed -i 's/TKP/TKP/g' {} +
```

- [ ] **Step 3: Husky, Changeset**

```bash
sed -i 's/tkp/tkp/g' /home/devbox/project/tkp/.husky/* 2>/dev/null
sed -i 's/tkp/tkp/g' /home/devbox/project/tkp/.changeset/config.json 2>/dev/null
```

---

### Task 10: 构建、验证、修复

- [ ] **Step 1: 运行 typecheck**

```bash
cd /home/devbox/project/tkp && pnpm typecheck 2>&1
```

修复所有类型错误（主要是模块引用路径）。

- [ ] **Step 2: 运行 lint**

```bash
cd /home/devbox/project/tkp && pnpm lint 2>&1
```

- [ ] **Step 3: 更新测试快照**

```bash
cd /home/devbox/project/tkp && pnpm vitest --update 2>&1
```

- [ ] **Step 4: 运行全部测试**

```bash
cd /home/devbox/project/tkp && pnpm test:run 2>&1
```

修复失败的测试。

- [ ] **Step 5: 全局检查残留**

```bash
cd /home/devbox/project/tkp
# 检查是否还有 TKP_ 常量（排除 LEGACY_、node_modules、.git、锁文件）
rg "TKP_CONFIG_DIR|TKP_CONFIG_FILE|LEGACY_TKP" --glob '!node_modules' --glob '!.git' --glob '!pnpm-lock.yaml' --glob '!CHANGELOG.md' --glob '!*.spec.md'
# 检查是否还有 ufomiao/WitMiao 引用（排除设计文档和锁文件）
rg "ufomiao|UfoMiao|WitMiao|ufo025174" --glob '!node_modules' --glob '!.git' --glob '!pnpm-lock.yaml' --glob '!docs/superpowers/**'
# 检查是否还有 tkp.ufomiao.com 域名
rg "tkp\.ufomiao" --glob '!node_modules' --glob '!.git' --glob '!docs/superpowers/**'
```

- [ ] **Step 6: 清理链接移除后的残留**

```bash
cd /home/devbox/project/tkp
# 清理空链接 [text]() 和空引用 [text]: 
find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/\[\]([^)]*)//g' {} +
find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i 's/\[\([^]]*\)\]()/\1/g' {} +
# 清理纯空行
find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sed -i '/^[[:space:]]*$/N;/^\n[[:space:]]*$/D' {} +
```

- [ ] **Step 7: 构建**

```bash
cd /home/devbox/project/tkp && pnpm build 2>&1
```
