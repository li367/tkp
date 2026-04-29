[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Claude Code][claude-code-src]][claude-code-href]
[![codecov][codecov-src]][codecov-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![Ask DeepWiki][deepwiki-src]][deepwiki-href]

<div align="center">
  <img src="./src/assets/banner.webp" alt="Banner"/>

  <h1>
    ZCF - Zero-Config Code Flow
  </h1>

  <p align="center">
   <a href="README.md">English</a> | <a href="README_zh-CN.md">中文</a> | <b>日本語</b> | <a href="CHANGELOG.md">更新履歴</a>

**✨ 完全ドキュメント**: [ドキュメント入口](https://zcf.ufomiao.com/ja-JP/)

> ゼロ設定、ワンクリックで Claude Code & Codex 環境セットアップ - 多言語設定、インテリジェントプロキシシステム、パーソナライズされたAIアシスタント対応
  </p>
</div>

## 🚀 クイックスタート

- 推奨：`npx zcf` でインタラクティブメニューを開き、必要な操作を選択。
- よく使うコマンド：

```bash
npx zcf i        # フル初期化：インストール + ワークフロー + API/CCR + MCP
npx zcf u        # ワークフローのみ更新
npx zcf --lang ja  # インターフェース言語を切り替え（例）
```

- 非対話例（プロバイダープリセット）：

```bash
npx zcf i -s -p 302ai -k "sk-xxx"
```

より詳しい使い方・オプション・ワークフローはドキュメントを参照してください。

## 📖 完全ドキュメント

- https://zcf.ufomiao.com/ja-JP/

## 💬 コミュニティ

Telegramグループに参加して、サポートやディスカッション、アップデート情報を入手しましょう：

[![Telegram](https://img.shields.io/badge/Telegram-参加-blue?style=flat&logo=telegram)](https://t.me/ufomiao_zcf)

## 📄 ライセンス

[MITライセンス](LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/zcf?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/zcf
[npm-downloads-src]: https://img.shields.io/npm/dm/zcf?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/zcf
[license-src]: https://img.shields.io/github/license/ufomiao/zcf.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/ufomiao/zcf/blob/main/LICENSE
[claude-code-src]: https://img.shields.io/badge/Claude-Code-1fa669?style=flat&colorA=080f12&colorB=1fa669
[claude-code-href]: https://claude.ai/code
[codecov-src]: https://codecov.io/gh/UfoMiao/zcf/graph/badge.svg?token=HZI6K4Y7D7&style=flat&colorA=080f12&colorB=1fa669
[codecov-href]: https://codecov.io/gh/UfoMiao/zcf
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-1fa669?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/zcf
[deepwiki-src]: https://img.shields.io/badge/Ask-DeepWiki-1fa669?style=flat&colorA=080f12&colorB=1fa669
[deepwiki-href]: https://deepwiki.com/UfoMiao/zcf
