# 新增小米 MiMo 大模型 API 供应商预设 - 技术实施方案

> **版本**: v1.0  
> **创建日期**: 2026-04-29  
> **目标版本**: ZCF v3.6.5  
> **状态**: 待实施  

---

## 一、目标定义

### 1.1 业务目标

为 ZCF 项目新增「小米 MiMo 大模型」作为 API 供应商预设，使用户能够通过 ZCF 快速配置小米 MiMo API，无需手动输入 Base URL 和认证信息。

### 1.2 技术目标

- 在 `API_PROVIDER_PRESETS` 数组中新增 2 个供应商预设（按量付费 + Token Plan）
- 遵循现有 AICodeMirror 双预设模式（`aicodemirror` + `aicodemirror-cn`）
- 仅支持 Claude Code（不支持 Codex），与 GLM CN、MiniMax、Kimi Coding 等纯 Claude Code 供应商对齐
- 不引入新的依赖，不修改接口定义
- 保持向后兼容，所有现有测试必须通过

### 1.3 供应商规格

| 供应商 ID | 名称 | Base URL (Anthropic 兼容) | API Key 格式 | 默认模型 | 认证方式 | 支持工具 |
|-----------|------|---------------------------|-------------|---------|---------|---------|
| `xiaomi-mimo` | MiMo | `https://api.xiaomimimo.com/anthropic` | `sk-xxxxx` | `mimo-v2.5-pro` | `auth_token` | Claude Code |
| `xiaomi-mimo-tp` | MiMo Token Plan | `https://token-plan-cn.xiaomimimo.com/anthropic` | `tp-xxxxx` | `mimo-v2.5-pro` | `auth_token` | Claude Code |

---

## 二、功能分解

### 2.1 功能点清单

| 序号 | 功能点 | 涉及文件 | 优先级 |
|------|--------|---------|--------|
| 1 | 新增 `xiaomi-mimo` 供应商预设 | `src/config/api-providers.ts` | P0 |
| 2 | 新增 `xiaomi-mimo-tp` 供应商预设 | `src/config/api-providers.ts` | P0 |
| 3 | 更新 `getProviderPreset` JSDoc 示例 | `src/config/api-providers.ts` | P1 |
| 4 | 新增单元测试覆盖 2 个供应商 | `tests/unit/config/api-providers.test.ts` | P0 |
| 5 | 更新 CLAUDE.md 根目录文档 | `CLAUDE.md` | P2 |
| 6 | 更新配置模块文档 | `src/config/CLAUDE.md` | P2 |
| 7 | 更新 CHANGELOG | `CHANGELOG.md` | P2 |

### 2.2 不需要修改的文件

以下文件**不需要**修改，因为添加供应商预设仅需修改数据数组，现有代码通过 `getApiProviders()` 和 `getProviderPreset()` 函数动态读取数组，新条目会被自动发现：

- `src/commands/init.ts` — 通过 `getProviderPreset()` 动态获取预设，无需硬编码
- `src/utils/claude-code-incremental-manager.ts` — 通过 `getApiProviders('claude-code')` 动态获取列表
- `src/utils/code-tools/codex-config-switch.ts` — 通过 `getApiProviders('codex')` 获取，新供应商仅支持 Claude Code，不会出现在 Codex 列表中
- `src/utils/code-tools/codex.ts` — 同上
- `src/commands/config-switch.ts` — 动态读取
- `src/i18n/locales/zh-CN/api.json` — 供应商名称为专有名词，直接硬编码在 `name` 字段中，不通过 i18n 翻译
- `src/i18n/locales/en/api.json` — 同上
- `src/types/*` — 类型定义无需变更
- `src/constants.ts` — 无需新增常量

---

## 三、实施步骤

### 步骤 1：修改 `src/config/api-providers.ts`

**位置**：在 `kimi-coding` 预设条目之后（数组末尾）新增 2 个条目。

**新增代码**：

```typescript
  {
    id: 'xiaomi-mimo',
    name: 'MiMo',
    supportedCodeTools: ['claude-code'],
    claudeCode: {
      baseUrl: 'https://api.xiaomimimo.com/anthropic',
      authType: 'auth_token',
      defaultModels: ['mimo-v2.5-pro'],
    },
    description: 'Xiaomi MiMo (Pay-as-you-go)',
  },
  {
    id: 'xiaomi-mimo-tp',
    name: 'MiMo Token Plan',
    supportedCodeTools: ['claude-code'],
    claudeCode: {
      baseUrl: 'https://token-plan-cn.xiaomimimo.com/anthropic',
      authType: 'auth_token',
      defaultModels: ['mimo-v2.5-pro'],
    },
    description: 'Xiaomi MiMo Token Plan',
  },
```

**设计决策说明**：
- **ID 命名**：遵循 kebab-case 约定（参考 `aicodemirror-cn`、`glm-cn`、`bailian-coding`、`kimi-coding`）
- **`supportedCodeTools`**：仅 `['claude-code']`，因为小米官方明确声明仅支持 Claude Code
- **`authType`**：`'auth_token'`，因为小米 API 通过 `ANTHROPIC_AUTH_TOKEN` 传递认证信息
- **`defaultModels`**：单元素数组 `['mimo-v2.5-pro']`，与 GLM CN 等供应商模式对齐。在 init.ts 中，模型会被解构赋值 `[primary, haiku, sonnet, opus]`，仅传入主模型即可
- **`description`**：英文描述，遵循项目代码注释语言规范

**同时更新** `getProviderPreset` 的 JSDoc 注释（第 177 行）：

```typescript
// 修改前：
* @param providerId - The provider ID (302ai, glm, minimax, kimi, packycode)
// 修改后：
* @param providerId - The provider ID (e.g. 302ai, xiaomi-mimo, xiaomi-mimo-tp)
```

### 步骤 2：新增单元测试 `tests/unit/config/api-providers.test.ts`

在现有测试文件中新增以下测试用例，参照 `minimax` 和 `aicodemirror-cn` 的测试模式：

**新增测试用例清单**：

1. **`xiaomi-mimo provider should have correct configuration`**
   - 验证 `id === 'xiaomi-mimo'`
   - 验证 `name === 'MiMo'`
   - 验证 `supportedCodeTools` 仅包含 `'claude-code'`，不包含 `'codex'`
   - 验证 `claudeCode.baseUrl === 'https://api.xiaomimimo.com/anthropic'`
   - 验证 `claudeCode.authType === 'auth_token'`
   - 验证 `claudeCode.defaultModels` 等于 `['mimo-v2.5-pro']`
   - 验证不存在 `codex` 配置

2. **`xiaomi-mimo-tp provider should have correct configuration`**
   - 验证 `id === 'xiaomi-mimo-tp'`
   - 验证 `name === 'MiMo Token Plan'`
   - 验证 `supportedCodeTools` 仅包含 `'claude-code'`，不包含 `'codex'`
   - 验证 `claudeCode.baseUrl === 'https://token-plan-cn.xiaomimimo.com/anthropic'`
   - 验证 `claudeCode.authType === 'auth_token'`
   - 验证 `claudeCode.defaultModels` 等于 `['mimo-v2.5-pro']`
   - 验证不存在 `codex` 配置

3. **`xiaomi-mimo providers should not appear in codex provider list`**
   - 调用 `getApiProviders('codex')`
   - 验证返回列表中不包含 `xiaomi-mimo` 和 `xiaomi-mimo-tp`

4. **`xiaomi-mimo providers should appear in claude-code provider list`**
   - 调用 `getApiProviders('claude-code')`
   - 验证返回列表中包含 `xiaomi-mimo` 和 `xiaomi-mimo-tp`

5. **更新现有测试中的计数验证**（如适用）
   - 检查 `API_PROVIDER_PRESETS.length` 相关断言，将 10 更新为 12

**测试模式参考**：完全参照 `minimax` 测试用例（第 83-91 行）的结构。

### 步骤 3：更新文档 — `CLAUDE.md`（根目录）

**需要更新的位置**：

1. **变更记录**（文件顶部）：新增 v3.6.5 条目
   ```
   ### v3.6.5 (2026-04)
   - 新增小米 MiMo 大模型 API 供应商预设（按量付费 + Token Plan）
   ```

2. **Module Index 表格**：将 API 供应商预设数量从 10 更新为 12

3. **API Provider Presets 章节**：
   - 计数从 10 更新为 12
   - 新增 11、12 条目：MiMo、MiMo Token Plan

4. **Sponsors 章节**（如适用）：考虑是否将小米 MiMo 添加为赞助商

### 步骤 4：更新文档 — `src/config/CLAUDE.md`

1. **变更记录**：新增 v3.6.5 条目
2. **API Provider Presets 表格**：新增 2 行

### 步骤 5：更新 `CHANGELOG.md`

在文件顶部新增 v3.6.5 条目，格式参照现有条目。

---

## 四、验证标准

### 4.1 功能验收

| 编号 | 验收项 | 验证方法 |
|------|--------|---------|
| F-1 | `npx zcf i` 交互式初始化时，供应商列表中显示 "MiMo" 和 "MiMo Token Plan" | 手动测试 |
| F-2 | 选择 MiMo 后，Base URL 自动填充为 `https://api.xiaomimimo.com/anthropic` | 手动测试 |
| F-3 | 选择 MiMo Token Plan 后，Base URL 自动填充为 `https://token-plan-cn.xiaomimimo.com/anthropic` | 手动测试 |
| F-4 | 认证方式自动选择为 Auth Token | 手动测试 |
| F-5 | 默认模型自动填充为 `mimo-v2.5-pro` | 手动测试 |
| F-6 | `npx zcf i -s -p xiaomi-mimo -k "sk-xxxx"` 非交互式初始化正确执行 | 手动测试 |
| F-7 | `npx zcf i -s -p xiaomi-mimo-tp -k "tp-xxxx"` 非交互式初始化正确执行 | 手动测试 |
| F-8 | Codex 模式下不显示 MiMo 供应商选项 | 手动测试 |
| F-9 | 现有供应商功能不受影响（回归测试） | 自动化测试 |

### 4.2 测试验收

| 编号 | 验收项 | 验证方法 |
|------|--------|---------|
| T-1 | ✅ `pnpm test` 全部通过，无回归 | CI 自动化 |
| T-2 | ✅ 新增测试用例覆盖率满足要求 | CI 自动化 |
| T-3 | ✅ TypeScript 类型检查通过 (`pnpm typecheck`) | CI 自动化 |
| T-4 | ✅ ESLint 检查通过 (`pnpm lint`) | CI 自动化 |

### 4.3 边界条件验证

| 编号 | 边界条件 | 预期行为 |
|------|---------|---------|
| E-1 | 用户对 MiMo 使用 `api_key` 而非 `auth_token` | 系统自动使用预设的 `auth_token` |
| E-2 | Codex 模式下调用 `getApiProviders('codex')` | 不返回 MiMo 供应商 |
| E-3 | 传入无效供应商 ID `xiaomi-invalid` | `getProviderPreset` 返回 `undefined`，抛出错误 |

---

## 五、影响文件清单

### 5.1 必须修改

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/config/api-providers.ts` | 新增 2 个预设条目 | 核心变更 |
| `tests/unit/config/api-providers.test.ts` | 新增 5 个测试用例 | 测试覆盖 |

### 5.2 建议修改

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `CLAUDE.md` | 更新文档 | 反映新供应商 |
| `src/config/CLAUDE.md` | 更新文档 | 反映新供应商 |
| `CHANGELOG.md` | 新增条目 | 变更记录 |

### 5.3 无需修改

| 文件路径 | 原因 |
|---------|------|
| `src/commands/init.ts` | 通过 `getProviderPreset()` 动态获取，自动发现新预设 |
| `src/utils/claude-code-incremental-manager.ts` | 通过 `getApiProviders()` 动态获取 |
| `src/utils/code-tools/codex-config-switch.ts` | 通过 `getApiProviders('codex')` 获取，自动过滤 |
| `src/utils/code-tools/codex.ts` | 同上 |
| `src/utils/code-tools/codex-provider-manager.ts` | 通用提供商管理，无需硬编码 |
| `src/commands/config-switch.ts` | 动态读取 |
| `src/commands/menu.ts` | 动态读取 |
| `src/constants.ts` | 无需新增常量 |
| `src/types/*` | 接口定义无需变更 |
| `src/i18n/locales/zh-CN/api.json` | 供应商名称为专有名词 |
| `src/i18n/locales/en/api.json` | 同上 |

---

## 六、风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 小米 API 端点变更 | 低 | 中 | 预设值可被用户手动覆盖；后续版本更新即可 |
| 小米新增 Codex 支持 | 中 | 低 | 届时将 `supportedCodeTools` 扩展为 `['claude-code', 'codex']` 并新增 `codex` 配置即可 |
| 与现有 302.AI 等供应商的 Token Plan 模式混淆 | 低 | 低 | 通过独立的供应商名称 `MiMo Token Plan` 明确区分 |

---

## 七、实施时序

```
步骤 1 (P0) ➜ 步骤 2 (P0) ➜ 运行测试验证 ➜ 步骤 3 (P2) ➜ 步骤 4 (P2) ➜ 步骤 5 (P2)
                    └── 核心开发 ──┘   └── 质量验证 ──┘  └────── 文档更新 ──────┘
```

预计总工时：约 1-2 小时。

---

## 八、附录：参考代码模式

### 8.1 纯 Claude Code 供应商模式（MiniMax，第 141-151 行）

```typescript
{
  id: 'minimax',
  name: 'MiniMax',
  supportedCodeTools: ['claude-code'],
  claudeCode: {
    baseUrl: 'https://api.minimax.io/anthropic',
    authType: 'auth_token',
    defaultModels: ['MiniMax-M2.7', 'MiniMax-M2.7-highspeed'],
  },
  description: 'MiniMax API Service',
},
```

### 8.2 双预设模式（AICodeMirror，第 68-95 行）

```typescript
{
  id: 'aicodemirror',
  name: 'AICodeMirror',
  // ...
},
{
  id: 'aicodemirror-cn',
  name: 'AICodeMirror CN',
  // ...
},
```

### 8.3 defaultModels 模型解构逻辑（init.ts 第 1308-1313 行）

```typescript
if (preset.claudeCode.defaultModels && preset.claudeCode.defaultModels.length > 0) {
  const [p, h, s, o] = preset.claudeCode.defaultModels
  primaryModel = primaryModel || p
  defaultHaikuModel = defaultHaikuModel || h
  defaultSonnetModel = defaultSonnetModel || s
  defaultOpusModel = defaultOpusModel || o
}
```

注意：对于仅有 1 个默认模型的供应商（如 `['mimo-v2.5-pro']`），只有 `p`（主模型）会被赋值，`h`、`s`、`o` 为 `undefined`，由 `||` 运算符回退到用户手动输入或其他默认值。这是预期行为，无需特殊处理。

---

> **文档结束** — 实施时请严格按照步骤顺序执行，每完成一个步骤后运行 `pnpm test` 和 `pnpm typecheck` 确保无回归。
