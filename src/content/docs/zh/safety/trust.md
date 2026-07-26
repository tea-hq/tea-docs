---
title: 工作区信任
description: tea 如何决定是否加载项目本地设置、技能与提示模板，以及信任的能与不能。
---

> **轨道：** `next` 预发布。

`AGENTS.md`、`CLAUDE.md` 或 `.tea/` 的存在将工作区标记为拥有项目本地资源。信任前，CLI 不加载
项目设置、技能或提示模板。信任允许加载文本，但不校验文本意图，也不使其安全。

## 信任标志

| 标志 | 行为 |
| --- | --- |
| `--trust default` | 使用已保存决策；否则无头使用失败关闭 |
| `--trust once` | 仅本次调用加载项目资源 |
| `--trust persist` | 为规范工作区身份保存信任 |
| `--trust reject` | 拒绝项目本地资源 |
| `--trust ignore` | 不带项目本地资源继续 |

使用 `--trust ignore` 可在不带项目本地设置与声明资源的情况下工作。显式提示/上下文与普通源文件
仍可能含提示注入。

## 资源发现

- 全局技能发现于 `<data-dir>/skills/**/SKILL.md`；已信任项目技能位于 `.tea/skills/**/SKILL.md`。
- 全局提示模板是 `<data-dir>/prompts` 中的非递归 Markdown 文件；已信任项目模板位于
  `.tea/prompts`。
- 显式 `--context-file` 路径受工作区限定。

## 信任工作区之前

仓库文本是模型输入。`AGENTS.md`、`CLAUDE.md`、源文件、文档、`.tea/settings.json`、提示模板与
`SKILL.md` 内容可能试图覆盖指令或诱导不安全工具使用。

在 `--trust once` 或 `--trust persist` 之前：

1. 在智能体之外检视 `AGENTS.md`、`CLAUDE.md` 与 `.tea/`。
2. 拒绝意外的技能路径或提示模板。
3. 核对每次审批的精确工具、效应、资源、访问与目标。
4. 拒绝宽泛的 shell 命令或读取环境凭据的命令。
5. 保留变更前评审 Git 改动与测试输出。

见 [审批](/zh/safety/approvals/) 与 [安全](/zh/safety/security/)。
